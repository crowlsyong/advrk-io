// utils/qrCode.ts
import { qrcode } from "https://deno.land/x/qrcode/mod.ts";

export async function generateQRCode(url: string): Promise<string> {
  try {
    const base64Image = qrcode(url);
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    throw error;
  }
}
