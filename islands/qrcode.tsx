import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { qrcode } from "https://deno.land/x/qrcode@v2.0.0/mod.ts";

interface QRCodeProps {
  text: string;
}

const QRCode = ({ text }: QRCodeProps) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const generateQRCode = async () => {
      const base64Image = await qrcode(text);
      if (typeof base64Image === 'string') {
        setSrc(base64Image);
      }
    };
    generateQRCode();
  }, [text]);

  return (
    <div>
      <h2>QR Code for: {text}</h2>
      {src && <img src={src} alt={`QR Code for ${text}`} />}
    </div>
  );
};

export default QRCode;
