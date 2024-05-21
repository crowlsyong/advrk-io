import { Handlers, PageProps } from "$fresh/server.ts";
import ArchivesView from "../islands/ArchiveView.tsx";
import { ShortenerService } from "../services/shortener.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const urls = await ShortenerService.getAllArchived();
    return ctx.render({ urls });
  },
  async DELETE(req, ctx) {
    const { id } = await req.json();
    await ShortenerService.delete(id);
    const urls = await ShortenerService.getAllArchived();
    return new Response(JSON.stringify({ urls }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
  async PUT(req, ctx) {
    const { id } = await req.json();
    await ShortenerService.restore(id);
    const urls = await ShortenerService.getAllArchived();
    return new Response(JSON.stringify({ urls }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
};

export default function Archives({ data }: PageProps) {
  return (
    <div>
      <ArchivesView initialData={data.urls} latency={0} />
    </div>
  );
}
