import { Handlers, PageProps } from "$fresh/server.ts";
import UrlShortenerView from "../islands/UrlShortenerView.tsx";
import { ShortenerService } from "../services/shortener.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const path = url.pathname.slice(1); // Extract the path

    // If the path is empty, render the homepage
    if (!path) {
      const urls = await ShortenerService.getAll();
      return ctx.render({ urls });
    }

    // Otherwise, try to fetch the URL entry by short URL
    const shortUrl = `${url.origin}/${path}`;
    const urlEntry = await ShortenerService.getShortUrlEntry(shortUrl);

    // If a valid URL entry is found and not archived, redirect
    if (urlEntry && !urlEntry.archived) {
      return Response.redirect(urlEntry.originalUrl, 302);
    }

    // If no valid entry is found, render the homepage with all URLs
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
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>hehawwwwww</title>
<link rel="stylesheet" href="/styles.css" />
</head>
export default function Home({ data }: PageProps) {
  return (
    
    <div>
      <UrlShortenerView initialData={data.urls} latency={0} />
    </div>
  );
}
