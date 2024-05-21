import { Handlers } from "$fresh/server.ts";
import { ShortenerService } from "../services/shortener.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const { id } = ctx.params;
    const urlEntry = await ShortenerService.get(id);

    if (urlEntry) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: urlEntry.originalUrl,
        },
      });
    }

    return new Response("URL not found", { status: 404 });
  },
  async PUT(req, ctx) {
    const { id } = ctx.params;
    const { shortUrl } = await req.json();
    const success = await ShortenerService.update(id, shortUrl);
    if (success) {
      return new Response(null, { status: 200 });
    }
    return new Response("URL not found", { status: 404 });
  },
};
