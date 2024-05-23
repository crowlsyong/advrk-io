// UrlInput.tsx

import { useRef, useCallback } from "preact/hooks";

interface UrlInputProps {
  addUrl: (url: string) => Promise<void>;
  adding: boolean;
}

export default function UrlInput({ addUrl, adding }: UrlInputProps) {
  const urlInput = useRef<HTMLInputElement>(null);

  const handleAddUrl = useCallback(() => {
    if (urlInput.current) {
      const value = urlInput.current.value;
      if (value) {
        urlInput.current.value = "";
        addUrl(value);
      }
    }
  }, [addUrl]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleAddUrl();
    }
  };

  return (
    <div class="flex gap-2">
      <input
        class="border border-gray-300 rounded w-full py-2 px-3"
        placeholder="Enter your URL here"
        ref={urlInput}
        onKeyDown={handleKeyDown}
      />
      <button
        class="p-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={handleAddUrl}
        disabled={adding}
      >
        Shorten
      </button>
    </div>
  );
}
