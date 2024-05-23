import { useState, useRef } from "preact/hooks";

interface UrlEntry {
  id: string;
  originalUrl: string;
  shortUrl: string;
}

export default function ArchivesView2(props: { initialData: UrlEntry[] }) {
  const [data, setData] = useState(props.initialData);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const lastSelectedIndex = useRef<number | null>(null);

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

  return (
    <div>
      <h1>Archive</h1>
      {data.map((url, index) => (
        <UrlItem
          key={url.id}
          url={url}
          selected={selected.has(url.id)}
          toggleSelect={(event: MouseEvent) =>
            toggleSelect(url.id, index, event)}
        />
      ))}
    </div>
  );
}

function UrlItem(
  { url, selected, toggleSelect }: {
    url: UrlEntry;
    selected: boolean;
    toggleSelect: (event: MouseEvent) => void;
  },
) {
  return (
    <div>
      <input
        type="checkbox"
        checked={selected}
        onClick={toggleSelect}
      />
      <a href={url.shortUrl}>{url.shortUrl}</a>
      <p>{url.originalUrl}</p>
    </div>
  );
}
