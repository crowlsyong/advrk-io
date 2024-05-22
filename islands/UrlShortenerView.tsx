import { useCallback, useRef, useState } from "preact/hooks";
import axios from "axios-web";
import { generateQRCode } from "../utils/qrCode.ts";
import QrCodeGenerator from "../islands/QrCodeGenerator.tsx";

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
      console.log(`Sending PUT request: id=${id}, shortUrl=${newShortUrl}`);
      const response = await axios.put(`${window.location.origin}/${id}`, {
        id, // Ensure id is included
        shortUrl: newShortUrl, // Properly include shortUrl
      });
      if (response.status === 200) {
        console.log(`Response from PUT request: ${JSON.stringify(response.data)}`);
        setData((prevData) =>
          prevData.map((url) =>
            url.id === id ? { ...url, shortUrl: newShortUrl } : url
          )
        );
      } else {
        console.error(`Failed to update URL: ${response.status}`);
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
    <div class="flex gap-2 w-full items-center justify-center py-8 xl:py-16 px-6">
      <div class="rounded w-full xl:max-w-xl gap-4">
        <div class="flex flex-col pb-4">
          <div class="flex flex-row gap-2 items-center">
            <h1 class="font-bold text-xl">URL Shortener</h1>
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
              data={data} // Pass data as a prop
              updateUrl={updateUrl}
              archiveUrl={archiveUrl}
              selected={selected.has(url.id)}
              toggleSelect={toggleSelect}
              generateQrCode={generateQrCode}
              
            />
          ))}
          
        </div>
        {qrCodeUrl && (
          <div class="flex justify-center mt-4">
            <QrCodeGenerator url={qrCodeUrl} />
          </div>
        )}
        <div class="flex flex-col py-4 gap-2 sm:items-end">
          <button
            class="p-2 border border-gray-500 text-black rounded"
            onClick={() => window.location.href = '/data'}
          >
            📊 Database
          </button>
          <button
            class="p-2 bg-red-600 text-white rounded disabled:opacity-50"
            onClick={archiveSelected}
            disabled={selected.size === 0}
          >
            Archive Selected
          </button>
          <div class="flex">
          <a
            href="/archives"
            class="text-red-500 rounded text-center w-full"
          >
            View Archives
          </a>
          
        </div>
        </div>
        <div class="pt-6 opacity-50 text-sm">
          <p>Initial data fetched in {props.latency}ms</p>
          <p class="flex gap-2">
            <a
              href="https://github.com/denoland/showcase_todo"
              class="underline"
            >
              Source code
            </a>
            <a
              href="https://github.com/crowlsyong/advrk-io"
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
}: {
  url: UrlEntry;
  data: UrlEntry[];
  updateUrl: (id: string, newShortUrl: string) => void;
  archiveUrl: (id: string) => void;
  selected: boolean;
  toggleSelect: (id: string) => void;
  generateQrCode: (id: string) => void;
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

    // Check for duplicate short URLs
    if (data.some((entry) => entry.shortUrl === newShortUrl && entry.id !== url.id)) {
      setError("That one is already taken!");
      return;
    }

    console.log(`Updating URL: id=${url.id}, newShortUrl=${newShortUrl}`);
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
    <div class="flex flex-col sm:flex-row p-4 gap-4 border-b border-gray-300 items-center">
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
                class={`border rounded w-full py-2 px-3 mr-4 ${error ? "border-red-600" : ""}`}
                value={newShortUrlEnding}
                onInput={(e) => setNewShortUrlEnding((e.target as HTMLInputElement).value)}
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
            ✏️
          </button>
        )}
        {editing && (
          <>
            <button class="p-2 mr-2" onClick={handleSave} title="Save">
              💾
            </button>
            <button class="p-2" onClick={handleCancel} title="Cancel">
              🚫
            </button>
          </>
        )}
        <button
          class="p-2 ml-2 border-2 border-black rounded"
          onClick={handleGenerateQrCode}
          title="Generate QR Code"
        >
          QR
        </button>
        
        <button
          class="p-2 ml-2 bg-red-200 text-white rounded"
          onClick={handleArchive}
          title="Archive"
        >
          🗑️
        </button>
        <button
          class="p-2 ml-2 bg-green-200 text-white rounded"
          onClick={handleCopy}
          title="Copy"
        >
          📋
        </button>
        {copied && (
          <div class="text-xs text-green-500 ml-2">
            Copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
}
