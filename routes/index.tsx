import { Handlers, PageProps } from "$fresh/server.ts";
import UrlShortenerView from "../islands/UrlShortenerView.tsx";

import { ShortenerService } from "../services/shortener.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const urls = await ShortenerService.getAll();
    return ctx.render({ urls });
  },
  async POST(req, ctx) {
    const { url } = await req.json();
    await ShortenerService.create(url);
    const urls = await ShortenerService.getAll();
    return new Response(JSON.stringify({ urls }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  },
  async PUT(req, ctx) {
    const { id, shortUrl } = await req.json();
    const success = await ShortenerService.update(id, shortUrl);
    if (success) {
      const urls = await ShortenerService.getAll();
      return new Response(JSON.stringify({ urls }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response("Not Found", { status: 404 });
    }
  },
  async DELETE(req, ctx) {
    const { id } = await req.json();
    await ShortenerService.archive(id);
    const urls = await ShortenerService.getAll();
    return new Response(JSON.stringify({ urls }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
};

export default function Home({ data }: PageProps) {
  return (
    <div>
      <UrlShortenerView initialData={data.urls} latency={0} />
    </div>
  );
}
