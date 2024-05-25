import { UrlEntry } from "./UrlShortenerView.tsx";
import { useRef, useState } from "preact/hooks";
import Dropdown from "./Dropdown.tsx";
import IconQrcode from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/qrcode.tsx";
import IconCopy from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/copy.tsx";
import IconDeviceFloppy from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/device-floppy.tsx";
import IconEdit from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/edit.tsx";
import IconTrashX from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/trash-x.tsx";
import IconX from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/x.tsx";

interface UrlItemProps {
  url: UrlEntry;
  data: UrlEntry[];
  index: number;
  updateUrl: (id: string, newShortUrl: string) => void;
  archiveUrl: (id: string) => void;
  generateQrCode: (id: string) => void;
  qrCodeUrl: string | null;
}

function sanitizeInput(input: string): string {
  return input.replace(/[^a-zA-Z0-9-_]/g, "");
}

function UrlItem({
  url,
  data,
  updateUrl,
  archiveUrl,
  generateQrCode,
  qrCodeUrl,
  index,
}: UrlItemProps) {
  const [editing, setEditing] = useState(false);
  const [newShortUrlEnding, setNewShortUrlEnding] = useState(
    url.shortUrl.split("/").pop() || "",
  );
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyColor, setCopyColor] = useState("text-blue-400");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSave();
    }
  };

  const handleSave = () => {
    const sanitizedEnding = sanitizeInput(newShortUrlEnding);

    if (sanitizedEnding.length < 4) {
      setError("Too short. Minimum 4 characters.");
      return;
    }

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
      setCopyColor("text-green-400");
      setTimeout(() => {
        setCopyColor("text-blue-400");
        setCopied(false);
      }, 2000); // Keep the green color for 2 seconds
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
    class={`flex flex-col sm:flex-row p-2 sm:p-4 gap-2 sm:gap-4 border-b border-gray-700 items-center ${
      qrCodeUrl === url.shortUrl ? "bg-gray-600" : "bg-gray-800"
    }`}
  >
    <div class="flex flex-row sm:flex-row w-full gap-2 tems-center justify-between">
    <div class="flex flex-col font-mono text-xs sm:text-sm  items-start">
        {!editing && (
            <div class="flex items-center">
              <a
                href={url.shortUrl}
                class="text-blue-400 hover:text-blue-300 text-xl hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {getShortenedUrl(url.shortUrl)}
              </a>
              <button
                class={`ml-2 rounded flex items-center ${
                  copied
                    ? "text-green-400"
                    : "text-blue-400 hover:text-blue-300"
                } transition-colors duration-2000`}
                onClick={handleCopy}
                title="Copy"
              >
                <IconCopy />
              </button>
              {copied && (
                <div class="text-xs ml-2 text-green-400">
                  Copied to clipboard!
                </div>
              )}
            </div>
          )}
          <a
            href={url.originalUrl}
            class="text-xs opacity-50 leading-loose hover:text-blue-400 hover:underline text-gray-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            {url.originalUrl.length > 40
              ? url.originalUrl.slice(0, 40) + "..."
              : url.originalUrl}
          </a>
          <div class="text-xxs text-gray-500">Created at: {url.timestamp}</div>
          {editing && (
            <>
              <span class="text-gray-400">{url.shortUrl.split("/").slice(0, -1).join("/")}/</span>
              <input
                class={`border rounded w-full py-1 px-2 mr-4 bg-gray-700 text-white ${
                  error ? "border-red-600" : ""
                }`}
                value={newShortUrlEnding}
                onInput={(e) =>
                  setNewShortUrlEnding((e.target as HTMLInputElement).value)}
                ref={inputRef}
                onKeyDown={handleKeyDown}
                style={{ minWidth: "10ch" }} // Minimum width to prevent squishing
              />
              {error && <p class="text-red-600 text-xs">{error}</p>}
            </>
          )}
        </div>
        <div class="flex gap-2 items-center justify-end  mt-2 sm:mt-0">
          {/* Desktop Buttons */}
          <div class="hidden sm:flex gap-2">
            {!editing && (
              <button
                class="p-1 sm:p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded flex items-center"
                onClick={handleEdit}
                title="Edit"
              >
                <IconEdit />
              </button>
            )}
            {editing && (
              <>
                <button
                  class="p-1 sm:p-2 text-blue-400 rounded flex items-center hover:bg-gray-700"
                  onClick={handleSave}
                  title="Save"
                >
                  <IconDeviceFloppy />
                </button>
                <button
                  class="p-1 sm:p-2 text-red-500 rounded flex items-center hover:bg-gray-700"
                  onClick={handleCancel}
                  title="Cancel"
                >
                  <IconX />
                </button>
              </>
            )}
            <button
              class="p-1 sm:p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded flex items-center"
              onClick={handleGenerateQrCode}
              title="Generate QR Code"
            >
              <IconQrcode />
            </button>
            <button
              class="p-1 sm:p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded flex items-center"
              onClick={handleArchive}
              title="Archive"
            >
              <IconTrashX />
            </button>
          </div>

          {/* Mobile Dropdown */}
          <div class="sm:hidden">
            <Dropdown
              onEdit={handleEdit}
              onGenerateQrCode={handleGenerateQrCode}
              onArchive={handleArchive}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UrlList({
  data,
  updateUrl,
  archiveUrl,
  generateQrCode,
  qrCodeUrl,
}: {
  data: UrlEntry[];
  updateUrl: (id: string, newShortUrl: string) => void;
  archiveUrl: (id: string) => void;
  generateQrCode: (id: string) => void;
  qrCodeUrl: string | null;
}) {
  return (
    <div>
      {data.map((url, index) => (
        <UrlItem
          key={url.id}
          url={url}
          data={data}
          updateUrl={updateUrl}
          archiveUrl={archiveUrl}
          generateQrCode={generateQrCode}
          qrCodeUrl={qrCodeUrl}
          index={index}
        />
      ))}
    </div>
  );
}
