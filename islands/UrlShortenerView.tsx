import { useCallback, useRef, useState } from "preact/hooks";
import axios from "axios-web";
import QrCodeGenerator from "../islands/QrCodeGenerator.tsx";
import IconQrcode from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/qrcode.tsx";
import IconQrcodeOff from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/qrcode-off.tsx";
import IconHttpDelete from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/http-delete.tsx";
import IconCopy from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/copy.tsx";
import IconDatabase from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/database.tsx";
import IconArchive from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/archive.tsx";
import IconDeviceFloppy from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/device-floppy.tsx";
import IconArchiveFilled from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/archive-filled.tsx";
interface UrlEntry {
  id: string;
  originalUrl: string;
  shortUrl: string;
}

function ensureProtocol(url: string): string {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}

function sanitizeInput(input: string): string {
  return input.replace(/[^a-zA-Z0-9-_]/g, "");
}

export default function UrlShortenerView(
  props: { initialData: UrlEntry[]; latency: number },
) {
  const [data, setData] = useState(props.initialData);
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const urlInput = useRef<HTMLInputElement>(null);

  const toggleSelect = (id: string) => {
    setSelected((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const addUrl = useCallback(async () => {
    let value = urlInput.current!.value;
    if (!value) return;
    value = ensureProtocol(value);
    urlInput.current!.value = "";
    setAdding(true);

    try {
      const response = await axios.post(window.location.href, { url: value });
      if (response.status === 201) {
        setData(response.data.urls);
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
        setData((prevData) =>
          prevData.map((url) =>
            url.id === id ? { ...url, shortUrl: newShortUrl } : url
          )
        );
      }
    } catch (error) {
      console.error("Failed to update URL:", error);
    } finally {
      setAdding(false);
    }
  }, []);

  const archiveUrl = useCallback(async (id: string) => {
    setAdding(true);
    try {
      await axios.delete(window.location.href, { data: { id } });
      setData((prevData) => prevData.filter((url) => url.id !== id));
    } catch (error) {
      console.error("Failed to archive URL:", error);
    } finally {
      setAdding(false);
    }
  }, []);

  const archiveSelected = useCallback(async () => {
    const confirmed = confirm(
      "Are you sure you want to archive the selected items?",
    );
    if (!confirmed) return;

    try {
      const remainingUrls = data.filter((url) => !selected.has(url.id));
      setData(remainingUrls); // Update state immediately
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

  return (
    <div class="flex gap-2 w-full items-center justify-center py-8 xl:py-8 px-6">
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="flex flex-col pb-4">
          <div class="flex flex-row gap-2 items-center">
            <h1 class="font-bold text-xl">🤏 URL Shortener</h1>
          </div>
          <div class="flex gap-2">
            <input
              class="border border-gray-300 rounded w-full py-2 px-3"
              placeholder="Enter your URL here"
              ref={urlInput}
              onKeyDown={handleKeyDown}
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

        <div>
          {data.map((url) => (
            <UrlItem
              key={url.id}
              url={url}
              data={data}
              updateUrl={updateUrl}
              archiveUrl={archiveUrl}
              selected={selected.has(url.id)}
              toggleSelect={toggleSelect}
              generateQrCode={generateQrCode}
              qrCodeUrl={qrCodeUrl}
            />
          ))}
        </div>
        {qrCodeUrl && (
          <div class="flex justify-center mt-4 relative">
            <QrCodeGenerator url={qrCodeUrl} />
            <button
              class="absolute top-0 right-0 p-2 bg-red-500 text-white rounded"
              onClick={() => setQrCodeUrl(null)}
            >
              Close
            </button>
          </div>
        )}
        <div class="flex flex-col py-4 gap-2 sm:items-end">
          <div class="flex">
          </div>
          <button
            class="p-2 bg-red-600 text-white rounded disabled:opacity-50 flex items-center"
            onClick={archiveSelected}
            disabled={selected.size === 0}
          >
            <IconArchive class="mr-2" />
            Archive Selected
          </button>
        </div>
        <div class="pt-6 opacity-50 text-sm">
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

function UrlItem({
  url,
  data,
  updateUrl,
  archiveUrl,
  selected,
  toggleSelect,
  generateQrCode,
  qrCodeUrl,
}: {
  url: UrlEntry;
  data: UrlEntry[];
  updateUrl: (id: string, newShortUrl: string) => void;
  archiveUrl: (id: string) => void;
  selected: boolean;
  toggleSelect: (id: string) => void;
  generateQrCode: (id: string) => void;
  qrCodeUrl: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [newShortUrlEnding, setNewShortUrlEnding] = useState(
    url.shortUrl.split("/").pop() || "",
  );
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSave = () => {
    const sanitizedEnding = sanitizeInput(newShortUrlEnding);
    const baseUrl = url.shortUrl.split("/").slice(0, -1).join("/");
    const newShortUrl = `${baseUrl}/${sanitizedEnding}`;

    if (
      data.some((entry) =>
        entry.shortUrl === newShortUrl && entry.id !== url.id
      )
    ) {
      setError("That one is already taken!");
      return;
    }

    updateUrl(url.id, newShortUrl);
    setEditing(false);
    setError("");
  };

  const handleCancel = () => {
    setNewShortUrlEnding(url.shortUrl.split("/").pop() || "");
    setEditing(false);
    setError("");
  };

  const handleArchive = () => {
    archiveUrl(url.id);
  };

  const handleGenerateQrCode = () => {
    generateQrCode(url.id);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url.shortUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      class={`flex flex-col sm:flex-row p-4 gap-4 border-b border-gray-300 items-center ${
        qrCodeUrl === url.shortUrl ? "bg-green-300" : ""
      }`}
    >
      <div class="flex w-full gap-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => toggleSelect(url.id)}
          class="mr-2"
        />
        <div class="flex flex-col w-full font-mono">
          {!editing && (
            <>
              <a href={url.shortUrl} class="text-blue-600 hover:underline">
                {url.shortUrl}
              </a>
              <p class="text-xs opacity-50 leading-loose">{url.originalUrl}</p>
            </>
          )}
          {editing && (
            <>
              <span>{url.shortUrl.split("/").slice(0, -1).join("/")}/</span>
              <input
                class={`border rounded w-full py-2 px-3 mr-4 ${
                  error ? "border-red-600" : ""
                }`}
                value={newShortUrlEnding}
                onInput={(e) =>
                  setNewShortUrlEnding((e.target as HTMLInputElement).value)}
                ref={inputRef}
              />
              {error && <p class="text-red-600 text-xs">{error}</p>}
            </>
          )}
        </div>
      </div>

      <div class="flex p-4 gap-2 items-center sm:flex-end">
        {!editing && (
          <button class="p-2 mr-2" onClick={handleEdit} title="Edit">
            ✏️ Edit
          </button>
        )}
        {editing && (
          <>
            <button
              class="p-2 mr-2 flex items-center"
              onClick={handleSave}
              title="Save"
            >
              <IconDeviceFloppy class="mr-2" />
              Save
            </button>

            <button class="p-2" onClick={handleCancel} title="Cancel">
              ❌
            </button>
          </>
        )}
        <button
          class="p-2 ml-2 border-2 border-black rounded flex items-center"
          onClick={handleGenerateQrCode}
          title="Generate QR Code"
        >
          <IconQrcode />
        </button>

        <button
          class="p-2 ml-2 bg-red-200 rounded flex items-center"
          onClick={handleArchive}
          title="Archive"
        >
          <IconHttpDelete />
        </button>

        <button
          class="p-2 ml-2 bg-green-200 rounded flex items-center"
          onClick={handleCopy}
          title="Copy"
        >
          <IconCopy />
        </button>

        {copied && (
          <div class="text-xs ml-2">
            Copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
}
