import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import axios from "axios-web";
import IconSelectAll from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/select-all.tsx";
import IconDeselect from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/deselect.tsx";
import IconRestore from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/restore.tsx";
import IconTrash from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/trash.tsx";
import IconTextScan2 from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/text-scan-2.tsx";
import Search from "./Search.tsx";

interface UrlEntry {
  id: string;
  originalUrl: string;
  shortUrl: string;
}

export default function ArchivesView(
  props: { initialData: UrlEntry[]; latency: number },
) {
  const [data, setData] = useState(props.initialData);
  const [filteredData, setFilteredData] = useState(props.initialData);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [duplicateUrls, setDuplicateUrls] = useState<Set<string>>(new Set());
  const lastSelectedIndex = useRef<number | null>(null);

  useEffect(() => {
    const checkForDuplicates = async () => {
      try {
        const response = await axios.post("/api/check-duplicates", {
          shortUrls: data.map((url) => url.shortUrl),
        });
        console.log("Duplicate check response:", response.data);
        if (response.data.duplicates) {
          setDuplicateUrls(new Set(response.data.duplicates));
        }
      } catch (error) {
        console.error("Failed to check for duplicates:", error);
      }
    };
    checkForDuplicates();
  }, [data]);

  const [duplicatesSelected, setDuplicatesSelected] = useState(false);

  const toggleSelect = (id: string, index: number, event: MouseEvent) => {
    setSelected((prevSelected) => {
      const newSelected = new Set(prevSelected);

      if (event.shiftKey && lastSelectedIndex.current !== null) {
        const start = Math.min(lastSelectedIndex.current, index);
        const end = Math.max(lastSelectedIndex.current, index);

        for (let i = start; i <= end; i++) {
          newSelected.add(data[i].id);
        }
      } else {
        if (newSelected.has(id)) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
        lastSelectedIndex.current = index;
      }

      const selectedUrls = Array.from(newSelected).map((id) =>
        data.find((url) => url.id === id)?.shortUrl
      );
      const hasDuplicates = new Set(selectedUrls).size !== selectedUrls.length;

      const archiveDuplicates = Array.from(newSelected).some((id) => {
        const url = data.find((url) => url.id === id);
        return url && duplicateUrls.has(url.shortUrl);
      });

      const pageDuplicates = new Set(
        selectedUrls.filter((item, index) =>
          selectedUrls.indexOf(item) !== index
        ),
      ).size > 0;

      setDuplicatesSelected(
        hasDuplicates || archiveDuplicates || pageDuplicates,
      );

      return newSelected;
    });
  };

  const deleteSelected = useCallback(async () => {
    const confirmed = confirm(
      "Are you sure you want to delete the selected items?",
    );
    if (!confirmed) return;

    try {
      for (const id of selected) {
        await axios.delete(window.location.href, { data: { id } });
      }
      setData((prevData) => prevData.filter((url) => !selected.has(url.id)));
      setFilteredData((prevData) =>
        prevData.filter((url) => !selected.has(url.id))
      );
      setSelected(new Set());
    } catch (error) {
      console.error("Failed to delete the URLs:", error);
    }
  }, [selected]);

  const restoreSelected = useCallback(async () => {
    const confirmed = confirm(
      "Are you sure you want to restore the selected items?",
    );
    if (!confirmed) return;

    try {
      for (const id of selected) {
        await axios.put(window.location.href, { id });
      }
      setData((prevData) => prevData.filter((url) => !selected.has(url.id)));
      setFilteredData((prevData) =>
        prevData.filter((url) => !selected.has(url.id))
      );
      setSelected(new Set());
    } catch (error) {
      console.error("Failed to restore the URLs:", error);
    }
  }, [selected]);

  const selectAll = () => {
    const allIds = new Set(data.map((url) => url.id));
    setSelected(allIds);
  };

  const deselectAll = () => {
    setSelected(new Set());
  };

  const handleSearch = (query: string) => {
    const filtered = data.filter((url) =>
      url.originalUrl.includes(query) || url.shortUrl.includes(query)
    );
    setFilteredData(filtered);
  };

  return (
    <div class="flex gap-2 w-full items-center justify-center py-0 px-0 sm:px-8 sm:py-8 dark:bg-gray-900">
      <div class="w-full max-w-4xl mx-auto sm:px-6 lg:px-8 bg-gray-800 border border-gray-700 rounded p-4">
        <div class="flex flex-col pb-4">
          <div class="flex flex-row gap-2 items-center">
            <h1 class="font-bold text-3xl sm:text-xl m-4 text-white">
              📁 Archive
            </h1>
            <a
              href="/s"
              class="px-1 py-1 text-gray-400 hover:bg-gray-700 hover:text-white rounded flex gap-1 text-xs ml-auto"
            >
              <IconTextScan2 class="w-4 h-4" />
              Go to URL Shortener
            </a>
          </div>

          <Search
            searchUrl={async () => {}} // Update this if you have a specific search function
            searching={false}
            onSearch={handleSearch}
          />

          <div class="flex justify-between mt-2 pt-4">
            <div class="flex gap-1">
              {selected.size === 0
                ? (
                  <button
                    type="button"
                    class="text-gray-300 px-1 py-1 rounded border-gray-700 hover:bg-gray-700 hover:text-white flex gap-1 text-xs"
                    onClick={selectAll}
                  >
                    <IconSelectAll class="w-4 h-4" />
                    Select All
                  </button>
                )
                : (
                  <button
                    type="button"
                    class="text-white px-1 py-1 rounded flex gap-1 text-xs hover:bg-gray-700 hover:text-white"
                    onClick={deselectAll}
                  >
                    <IconDeselect class="w-4 h-4 text-red-500" />
                    Deselect All
                  </button>
                )}
            </div>

            {selected.size > 0 && (
              <div class="flex gap-1">
                <button
                  type="button"
                  class="px-1 py-1 rounded flex gap-1 text-xs bg-red-500 text-white"
                  onClick={deleteSelected}
                >
                  <IconTrash class="w-4 h-4" />
                  Delete Selected
                </button>
                <button
                  type="button"
                  class={`px-1 py-1 rounded flex gap-1 text-xs ${
                    duplicatesSelected
                      ? "bg-gray-500 text-gray-300"
                      : "bg-blue-600 text-white"
                  }`}
                  onClick={duplicatesSelected ? deselectAll : restoreSelected}
                  disabled={duplicatesSelected}
                >
                  <IconRestore class="w-4 h-4" />
                  {duplicatesSelected
                    ? "Deselect Duplicate"
                    : "Restore Selected"}
                </button>
              </div>
            )}
          </div>
        </div>
        <div>
          {filteredData.map((url, index) => (
            <UrlItem
              key={url.id}
              url={url}
              selected={selected.has(url.id)}
              isDuplicate={duplicateUrls.has(url.shortUrl)}
              toggleSelect={(event: MouseEvent) =>
                toggleSelect(url.id, index, event)}
            />
          ))}
        </div>

        <div class="pt-6 opacity-50 text-sm text-gray-400">
          <p>Initial data fetched in {props.latency}ms</p>
          <p>
            <a href="https://github.com/crowlsyong/advrk-io" class="underline">
              Source code
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function UrlItem(
  { url, selected, isDuplicate, toggleSelect }: {
    url: UrlEntry;
    selected: boolean;
    isDuplicate: boolean;
    toggleSelect: (event: MouseEvent) => void;
  },
) {
  const handleSelect = (event: MouseEvent) => {
    toggleSelect(event);
  };

  return (
    <div
      class={`flex my-2 border-b border-gray-700 items-center h-16 gap-2 ${
        isDuplicate ? "text-red-500" : "text-white"
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onClick={handleSelect}
        class="mr-2"
      />
      <div class="flex flex-col w-full font-mono">
        <div class="flex items-center">
          <a
            href={url.shortUrl}
            class="text-blue-400 hover:blue-300 hover:underline text-xs sm:text-base"
          >
            {url.shortUrl}
          </a>
          {isDuplicate && (
            <span class="ml-2 text-red-500 text-xxs sm:text-base">
              ❗️ duplicate in production
            </span>
          )}
        </div>
        <p class="text-xs opacity-50 leading-loose text-gray-400">
          {url.originalUrl}
        </p>
      </div>
    </div>
  );
}
