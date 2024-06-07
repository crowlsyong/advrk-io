import { useEffect, useRef, useState } from "preact/hooks";
import { qrcode } from "https://deno.land/x/qrcode@v2.0.0/mod.ts";
import IconDownload from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/download.tsx";
import IconSquareRoundedPlus2 from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/square-rounded-plus-2.tsx";
import IconX from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/x.tsx";

interface QrCodeGeneratorProps {
  shortUrl: string;
  originalUrl: string;
  onClose: () => void;
}

const QrCodeGenerator = (
  { shortUrl, originalUrl, onClose }: QrCodeGeneratorProps,
) => {
  const [src, setSrc] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateQRCode = async () => {
      const base64Image = await qrcode(shortUrl);
      if (typeof base64Image === "string") {
        console.log(`Base64 Image URL: ${base64Image}`);
        setSrc(base64Image);
      }
    };
    generateQRCode();
  }, [shortUrl]);

  const handleDownloadBase64Image = () => {
    if (src) {
      const link = document.createElement("a");
      link.href = src;
      link.download = "qrcode.png";
      link.click();
    }
  };

  const handleOpenImageInNewTab = () => {
    if (src) {
      const newWindow = globalThis.open();

      if (newWindow) {
        newWindow.document.write(
          `<img src="${src}" alt="QR Code" class="w-full h-full">`,
        );
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current && !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div
          ref={popupRef}
          class="relative bg-gray-100 p-4 rounded shadow-lg max-w-sm w-full"
        >
          <div class="mb-4">
            <h2 class="text-lg font-semibold mb-2">QR Code for:</h2>
            <p class="text-sm text-gray-700 pb-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="underline text-blue-500 hover:text-blue-700"
              >
                {shortUrl}
              </a>
            </p>
            <p class="text-xs text-gray-500">
              Redirects to{" "}
              <a
                href={originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="bg-green-500 text-white hover:bg-green-400 p-1"
              >
                {originalUrl}
              </a>
            </p>
          </div>

          {src && (
            <img
              src={src}
              alt={`QR Code for ${shortUrl}`}
              className="w-60 h-60 mx-auto mb-4"
            />
          )}
          {src && (
            <div className="flex flex-col justify-center gap-2">
              <button
                onClick={handleOpenImageInNewTab}
                className="text-sm p-2 text-gray-600 hover:bg-gray-200 hover:text-black rounded flex items-center justify-center w-full"
              >
                <IconSquareRoundedPlus2 className="mr-1" /> Open in new tab
              </button>
              <button
                onClick={handleDownloadBase64Image}
                className="text-sm p-2 text-gray-300 bg-blue-600 hover:bg-blue-500 hover:text-white rounded flex items-center justify-center w-full"
              >
                <IconDownload className="mr-1" /> Download
              </button>
            </div>
          )}
          <button
            class="absolute top-2 right-2 p-2 bg-red-500 text-white hover:bg-red-400 rounded-full"
            onClick={onClose}
          >
            <IconX />
          </button>
        </div>
      </div>
    </>
  );
};

export default QrCodeGenerator;
