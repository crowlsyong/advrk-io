import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import axios from "axios-web";
import QrCodeGenerator from "../islands/QrCodeGenerator.tsx";
import IconTrashX from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/trash-x.tsx";
import UrlList from "../islands/UrlList.tsx";

export interface UrlEntry {
  id: string;
  originalUrl: string;
  shortUrl: string;
  timestamp: string;
}

function ensureProtocol(url: string): string {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}

export default function UrlShortenerView(
  props: { initialData: UrlEntry[]; latency: number },
) {
  const [data, setData] = useState(props.initialData);
  const [filteredData, setFilteredData] = useState(props.initialData);
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const urlInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setData((prevData) =>
      [...prevData].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    );
    setFilteredData((prevData) =>
      [...prevData].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    );
  }, [props.initialData]);

  const toggleSelect = (id: string, index: number, event: Event) => {
    const { shiftKey } = event as KeyboardEvent;
    setSelected((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (shiftKey && lastSelectedIndex !== null) {
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);
        for (let i = start; i <= end; i++) {
          newSelected.add(data[i].id);
        }
      } else {
        if (newSelected.has(id)) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
        setLastSelectedIndex(index);
      }
      return newSelected;
    });
  };

  const anySelected = selected.size > 0;

  const addUrl = useCallback(async () => {
    let value = urlInput.current!.value.toLowerCase();
    if (!value) return;
    value = ensureProtocol(value);
    urlInput.current!.value = "";
    setAdding(true);
  
    try {
      const response = await axios.post(window.location.href, { url: value });
      if (response.status === 201) {
        const updatedData = [...response.data.urls].sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setData(updatedData);
        setFilteredData(updatedData);
      }
    } catch (error) {
      console.error("Failed to add URL:", error);
    } finally {
      setAdding(false);
    }
  }, []);
  

  const updateUrl = useCallback(async (id: string, newShortUrl: string) => {
    setAdding(true);
    try {
      const response = await axios.put(`${window.location.origin}/${id}`, {
        id,
        shortUrl: newShortUrl,
      });
      if (response.status === 200) {
        const updatedData = [
          ...data.map((url) =>
            url.id === id ? { ...url, shortUrl: newShortUrl } : url
          ),
        ].sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setData(updatedData);
        setFilteredData(updatedData);
      }
    } catch (error) {
      console.error("Failed to update URL:", error);
    } finally {
      setAdding(false);
    }
  }, [data]);

  const archiveUrl = useCallback(async (id: string) => {
    setAdding(true);
    try {
      await axios.delete(window.location.href, { data: { id } });
      const updatedData = [...data.filter((url) => url.id !== id)].sort((
        a,
        b,
      ) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setData(updatedData);
      setFilteredData(updatedData);
    } catch (error) {
      console.error("Failed to archive URL:", error);
    } finally {
      setAdding(false);
    }
  }, [data]);

  const archiveSelected = useCallback(async () => {
    const confirmed = confirm(
      "Are you sure you want to archive the selected items?",
    );
    if (!confirmed) return;

    try {
      const remainingUrls = data.filter((url) => !selected.has(url.id));
      setData(
        [...remainingUrls].sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
      );
      setFilteredData(
        [...remainingUrls].sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
      );
      for (const id of selected) {
        await axios.delete(window.location.href, { data: { id } });
      }
      setSelected(new Set());
    } catch (error) {
      console.error("Failed to archive the URLs:", error);
    }
  }, [selected, data]);

  const generateQrCode = useCallback((id: string) => {
    const url = data.find((entry) => entry.id === id)?.shortUrl;
    if (url) {
      setQrCodeUrl((prevQrCodeUrl) => (prevQrCodeUrl === url ? null : url));
    }
  }, [data]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      addUrl();
    }
  };

  const handleInput = (event: Event) => {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    const filtered = data.filter((url) =>
      url.originalUrl.toLowerCase().includes(query) || url.shortUrl.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };
  

  return (
    <div class="flex gap-2 w-full items-center justify-center py-8 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div class="w-full max-w-4xl mx-auto sm:px-6 lg:px-8 bg-gray-800 border border-gray-700 rounded p-4">
        <div class="flex flex-col pb-4">
          <div class="flex flex-row gap-2 items-center">
            <h1 class="font-bold text-xl m-4 text-white">🤏 URL Shortener</h1>
            <a
              href="/s/archive"
              class="px-1 py-1 text-gray-400 hover:bg-gray-700 hover:text-white rounded flex gap-1 text-xs ml-auto"
            >
              <IconTrashX class="w-4 h-4" />
              View Archived Links
            </a>
          </div>
          <div class="flex gap-2">
            <input
              class="border border-gray-600 bg-gray-700 text-white rounded w-full py-2 px-3"
              placeholder="Enter your URL here"
              ref={urlInput}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
            />
            <button
              class="p-2 bg-blue-600 text-white rounded disabled:opacity-50"
              onClick={addUrl}
              disabled={adding}
            >
              Shorten
            </button>
          </div>
        </div>

        <UrlList
          data={filteredData}
          updateUrl={updateUrl}
          archiveUrl={archiveUrl}
          selected={selected}
          toggleSelect={toggleSelect}
          generateQrCode={generateQrCode}
          qrCodeUrl={qrCodeUrl}
        />

        {qrCodeUrl && (
          <QrCodeGenerator
            shortUrl={qrCodeUrl}
            originalUrl={data.find((entry) => entry.shortUrl === qrCodeUrl)
              ?.originalUrl || ""}
            onClose={() =>
              setQrCodeUrl(null)}
          />
        )}

        <div class="flex flex-col py-4 gap-2 sm:items-end">
          <div class="flex"></div>
          {anySelected && (
            <button
              class="text-sm p-2 rounded text-white bg-red-500 disabled:opacity-50 disabled:bg-gray-500 flex items-center"
              onClick={archiveSelected}
            >
              <IconTrashX class="mr-2" />
              Archive Selected
            </button>
          )}
        </div>
        <div class="pt-6 opacity-50 text-sm text-gray-400">
          <p>Initial data fetched in {props.latency}ms</p>
          <p class="flex gap-2">
            <a
              href="https://github.com/crowlsyong/advrk-io"
              class="underline"
            >
              Source code
            </a>
            <a
              href="https://adventurerock.com/"
              class="underline"
            >
              Adventure Rock
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
