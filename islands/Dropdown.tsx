import { h } from 'preact';
import { useState } from 'preact/hooks';
import IconDotsVertical from 'https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/dots-vertical.tsx';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface DropdownProps {
  onEdit: () => void;
  onGenerateQrCode: () => void;
  onArchive: () => void;
}

export default function Dropdown({ onEdit, onGenerateQrCode, onArchive }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-gray-700"
        >
          <IconDotsVertical className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <button
              onClick={() => { onEdit(); setOpen(false); }}
              className={classNames(
                'block px-4 py-2 text-sm w-full text-left text-gray-300 hover:bg-gray-700'
              )}
            >
              Edit
            </button>
            <button
              onClick={() => { onGenerateQrCode(); setOpen(false); }}
              className={classNames(
                'block px-4 py-2 text-sm w-full text-left text-gray-300 hover:bg-gray-700'
              )}
            >
              Generate QR Code
            </button>
            <button
              onClick={() => { onArchive(); setOpen(false); }}
              className={classNames(
                'block px-4 py-2 text-sm w-full text-left text-gray-300 hover:bg-gray-700'
              )}
            >
              Archive
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
