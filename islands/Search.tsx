import { useRef } from "preact/hooks";

interface SearchProps {
  searchUrl: (query: string) => Promise<void>;
  searching: boolean;
  onSearch: (query: string) => void;
}

export default function Search({ searchUrl, searching, onSearch }: SearchProps) {
  const urlInput = useRef<HTMLInputElement>(null);

  const handleSearchUrl = async () => {
    if (urlInput.current) {
      const value = urlInput.current.value;
      if (value) {
        urlInput.current.value = "";
        await searchUrl(value);
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearchUrl();
    }
  };

  const handleInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    onSearch(value);
  };

  return (
    <div class="flex gap-2">
      <input
        class="border border-gray-600 bg-gray-700 text-white rounded w-full py-2 px-3"
        placeholder="Search"
        ref={urlInput}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
      />
    </div>
  );
}
