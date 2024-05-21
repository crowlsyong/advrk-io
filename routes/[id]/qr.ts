// routes/qr/[id].ts
import { Handlers } from "$fresh/server.ts";
import { generateQRCode } from "../../utils/qrCode.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const { id } = ctx.params;
    const url = `http://localhost:8000/${id}`;
    const qrCode = await generateQRCode(url);
    return new Response(qrCode, {
      headers: { "Content-Type": "image/png" }
    });
  }
};
