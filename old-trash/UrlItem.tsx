// UrlItem.tsx

import { useRef, useState } from "preact/hooks";
import IconQrcode from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/qrcode.tsx";
import IconCopy from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/copy.tsx";
import IconEdit from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/edit.tsx";
import IconDeviceFloppy from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/device-floppy.tsx";
import IconArchive from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/archive.tsx";

interface UrlEntry {
  id: string;
  originalUrl: string;
  shortUrl: string;
}

function sanitizeInput(input: string): string {
  return input.replace(/[^a-zA-Z0-9-_]/g, "");
}

const UrlItem = ({
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
}) => {
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

  const getShortenedUrl = (url: string) => {
    if (url.length > 40) {
      return url.slice(0, 17) + "...";
    }
    return url;
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
        <div class="flex flex-col font-mono">
          {!editing && (
            <div class="flex items-center">
              <a
                href={url.shortUrl}
                class="text-blue-600 hover:text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {getShortenedUrl(url.shortUrl)}
              </a>
              <button
                class="p-2 ml-2 rounded flex items-center text-blue-500 hover:text-blue-400 active:text-green-500"
                onClick={handleCopy}
                title="Copy"
              >
                <IconCopy />
              </button>
              {copied && (
                <div class="text-xs ml-2 text-green-500">
                  Copied to clipboard!
                </div>
              )}
            </div>
          )}
          <a
            href={url.originalUrl}
            class="text-xs opacity-50 leading-loose hover:text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {url.originalUrl.length > 40
              ? url.originalUrl.slice(0, 40) + "..."
              : url.originalUrl}
          </a>

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
                style={{ minWidth: "10ch" }} // Minimum width to prevent squishing
              />
              {error && <p class="text-red-600 text-xs">{error}</p>}
            </>
          )}
        </div>
      </div>

      <div class="flex p-4 gap-2 items-center sm:flex-end">
        {!editing && (
          <button
            class="p-2 ml-2 bg-blue-200 rounded flex items-center"
            onClick={handleEdit}
            title="Edit"
          >
            <IconEdit />
          </button>
        )}
        {editing && (
          <>
            <button
              class="p-2 mr-2 bg-blue-500 text-white rounded flex items-center"
              onClick={handleSave}
              title="Save"
            >
              <IconDeviceFloppy />
            </button>

            <button
              class="p-2 border-2 rounded"
              onClick={handleCancel}
              title="Cancel"
            >
              ❌
            </button>
          </>
        )}
        <button
          class="p-2 ml-2 bg-gray-200 rounded flex items-center"
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
          <IconArchive />
        </button>
      </div>
    </div>
  );
};

export default UrlItem;
