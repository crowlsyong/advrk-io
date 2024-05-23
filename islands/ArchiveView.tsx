import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import axios from "axios-web";
import IconSelectAll from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/select-all.tsx";
import IconDeselect from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/deselect.tsx";
import IconRestore from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/restore.tsx";
import IconTrash from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/trash.tsx";
import IconTextScan2 from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/text-scan-2.tsx";

interface UrlEntry {
  id: string;
  originalUrl: string;
  shortUrl: string;
}

export default function ArchivesView(props: { initialData: UrlEntry[]; latency: number }) {
  const [data, setData] = useState(props.initialData);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [duplicateUrls, setDuplicateUrls] = useState<Set<string>>(new Set());
  const lastSelectedIndex = useRef<number | null>(null);

  useEffect(() => {
    const checkForDuplicates = async () => {
      try {
        const response = await axios.post('/api/check-duplicates', { shortUrls: data.map(url => url.shortUrl) });
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

      return newSelected;
    });
  };

  const deleteSelected = useCallback(async () => {
    const confirmed = confirm("Are you sure you want to delete the selected items?");
    if (!confirmed) return;

    try {
      for (const id of selected) {
        await axios.delete(window.location.href, { data: { id } });
      }
      setData((prevData) => prevData.filter((url) => !selected.has(url.id)));
      setSelected(new Set());
    } catch (error) {
      console.error("Failed to delete the URLs:", error);
    }
  }, [selected]);

  const restoreSelected = useCallback(async () => {
    const confirmed = confirm("Are you sure you want to restore the selected items?");
    if (!confirmed) return;

    try {
      for (const id of selected) {
        await axios.put(window.location.href, { id });
      }
      setData((prevData) => prevData.filter((url) => !selected.has(url.id)));
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

  const hasDuplicateSelected = Array.from(selected).some(id => {
    const url = data.find(url => url.id === id);
    return url && duplicateUrls.has(url.shortUrl);
  });
  
  return (
    <div class="flex gap-2 w-full items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-4xl mx-auto sm:px-6 lg:px-8 bg-gray-100 border border-black rounded p-4">
        <div class="flex flex-col pb-4">
          <div class="flex flex-row gap-2 items-center">
            <h1 class="font-bold text-xl m-4">📁 Archive</h1>
            <a
              href="/s"
              class="px-1 py-1 text-gray-600  hover:bg-gray-200 hover:text-black rounded flex gap-1 text-xs ml-auto"
            >
              <IconTextScan2 class="w-4 h-4" />
              Go to URL Shortener
            </a>
          </div>

          <div class="flex justify-between mt-2">
            <div class="flex gap-1">
              {selected.size === 0
                ? (
                  <button
                    type="button"
                    class="px-1 py-1 rounded border(gray-400 1) hover:bg-gray-200 flex gap-1 text-xs"
                    onClick={selectAll}
                  >
                    <IconSelectAll class="w-4 h-4" />
                    Select All
                  </button>
                )
                : (
                  <button
                    type="button"
                    class="px-1 py-1 rounded flex gap-1 text-xs"
                    onClick={deselectAll}
                  >
                    <IconDeselect class="w-4 h-4" />
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
      class={`px-1 py-1 rounded flex gap-1 text-xs ${hasDuplicateSelected ? 'bg-gray-300 text-black' : 'bg-blue-600 text-white'}`}
      onClick={hasDuplicateSelected ? deselectAll : restoreSelected}
      disabled={hasDuplicateSelected}
    >
      <IconRestore class="w-4 h-4" />
      {hasDuplicateSelected ? 'Deselect Duplicate' : 'Restore Selected'}
    </button>
  </div>
)}

          </div>
        </div>
        <div>
          {data.map((url, index) => (
            <UrlItem
              key={url.id}
              url={url}
              selected={selected.has(url.id)}
              isDuplicate={duplicateUrls.has(url.shortUrl)}
              toggleSelect={(event: MouseEvent) => toggleSelect(url.id, index, event)}
            />
          ))}
        </div>

        <div class="pt-6 opacity-50 text-sm">
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
    <div class={`flex my-2 border-b border-gray-300 items-center h-16 gap-2 ${isDuplicate ? 'text-red-500' : ''}`}>
      <input
        type="checkbox"
        checked={selected}
        onClick={handleSelect}
        class="mr-2"
      />
      <div class="flex flex-col w-full font-mono">
        <div class="flex items-center">
          <a href={url.shortUrl} class="text-blue-600 hover:underline">
            {url.shortUrl}
          </a>
          {isDuplicate && (
            <span class="ml-2 text-red-500">duplicate in production</span>
          )}
        </div>
        <p class="text-xs opacity-50 leading-loose text-black">{url.originalUrl}</p>
      </div>
    </div>
  );
}
