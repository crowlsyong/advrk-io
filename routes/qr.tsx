import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import QRCode from "../islands/qrcode.tsx";

export const handler: Handlers = {
  GET(req, ctx) {
    const url = new URL(req.url);
    const text = url.searchParams.get("text") || "";
    return ctx.render({ text });
  },
};

export default function QR({ data }: PageProps) {
  return (
    <div>
      <h1>QR Code Generator</h1>
      <form method="get">
        <input type="text" name="text" placeholder="Enter text" />
        <button type="submit">Generate QR Code</button>
      </form>
      {data.text && <QRCode text={data.text} />}
    </div>
  );
}
