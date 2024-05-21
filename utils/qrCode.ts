import { qrcode } from "https://raw.githubusercontent.com/denorg/qrcode/master/mod.ts";

export async function generateQRCode(url: string): Promise<string> {
  try {
    const qrCode = await qrcode(url);
    const qrCodeDataURL = `data:image/png;base64,${qrCode}`;
    return qrCodeDataURL;
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    throw error;
  }
}
