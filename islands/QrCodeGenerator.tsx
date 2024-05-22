import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { qrcode } from "https://deno.land/x/qrcode@v2.0.0/mod.ts";

interface QrCodeGeneratorProps {
  url: string;
}

const QrCodeGenerator = ({ url }: QrCodeGeneratorProps) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const generateQRCode = async () => {
      const base64Image = await qrcode(url);
      if (typeof base64Image === "string") {
        console.log(`Base64 Image URL: ${base64Image}`);
        setSrc(base64Image);
      }
    };
    generateQRCode();
  }, [url]);

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
        newWindow.document.write(`<img src="${src}" alt="QR Code" class="w-full h-full">`);
      }
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">QR Code for: {url}</h2>
      {src && (
        <img
          src={src}
          alt={`QR Code for ${url}`}
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
    </div>
  );
};

export default QrCodeGenerator;
