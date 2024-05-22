import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { qrcode } from "https://deno.land/x/qrcode@v2.0.0/mod.ts";

interface QrCodeGeneratorProps {
  shortUrl: string;
  originalUrl: string;
  onClose: () => void;
}

const QrCodeGenerator = ({ shortUrl, originalUrl, onClose }: QrCodeGeneratorProps) => {
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
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
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
        <div ref={popupRef} class="relative bg-white p-4 rounded shadow-lg max-w-sm w-full">
          <div class="mb-4">
            <h2 class="text-lg font-semibold mb-2">QR Code for:</h2>
            <p class="text-sm text-gray-700">{shortUrl}</p>
            <p class="text-xs text-gray-500">{originalUrl}</p>
          </div>
          {src && (
            <img
              src={src}
              alt={`QR Code for ${shortUrl}`}
              className="w-32 h-32 mx-auto mb-4"
            />
          )}
          {src && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDownloadBase64Image}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Download Base64 Image
              </button>
              <button
                onClick={handleOpenImageInNewTab}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Open Image in New Tab
              </button>
            </div>
          )}
          <button
            class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
};

export default QrCodeGenerator;
