import { useCallback, useState } from "preact/hooks";
import axios from "axios-web";

interface UrlEntry {
  id: string;
  originalUrl: string;
  shortUrl: string;
}

export default function ArchivesView(props: { initialData: UrlEntry[]; latency: number }) {
  const [data, setData] = useState(props.initialData);
  const [selected, setSelected] = useState<Set<string>>(new Set());

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

  const deleteSelected = useCallback(async () => {
    const confirmed = confirm("Are you sure you want to delete the selected items?");
    if (!confirmed) return;

    try {
      for (const id of selected) {
        await axios.delete(window.location.href, { data: { id } });
      }
      setData((prevData) => prevData.filter(url => !selected.has(url.id)));
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
      setData((prevData) => prevData.filter(url => !selected.has(url.id)));
      setSelected(new Set());
    } catch (error) {
      console.error("Failed to restore the URLs:", error);
    }
  }, [selected]);

  return (
    <div class="flex gap-2 w-full items-center justify-center py-8 xl:py-16 px-6">
      <div class="rounded w-full xl:max-w-xl">
        <div class="flex flex-col gap-4 pb-4">
          <div class="flex flex-row gap-2 items-center">
            <h1 class="font-bold text-xl">Archives</h1>
          </div>
          <div class="flex gap-2">
            <button
              class="p-2 bg-red-400 text-white rounded disabled:opacity-50"
              onClick={deleteSelected}
              disabled={selected.size === 0}
            >
              Delete Selected
            </button>
            <button
              class="p-2 bg-green-400 text-white rounded disabled:opacity-50"
              onClick={restoreSelected}
              disabled={selected.size === 0}
            >
              Restore Selected
            </button>
          </div>
        </div>
        <div>
          {data.map((url) => (
            <UrlItem key={url.id} url={url} selected={selected.has(url.id)} toggleSelect={toggleSelect} />
          ))}
        </div>
        <div class="flex gap-2">
          <a href="/" class="p-2 bg-blue-600 text-white rounded text-center w-full">
            Back to Shortening
          </a>
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

function UrlItem({ url, selected, toggleSelect }: { url: UrlEntry; selected: boolean; toggleSelect: (id: string) => void }) {
  const handleSelect = () => {
    toggleSelect(url.id);
  };

  return (
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <input type="checkbox" checked={selected} onChange={handleSelect} class="mr-2" />
      <div class="flex flex-col w-full font-mono">
        <a href={url.shortUrl} class="text-blue-600 hover:underline">{url.shortUrl}</a>
        <p class="text-xs opacity-50 leading-loose">{url.originalUrl}</p>
      </div>
    </div>
  );
}
