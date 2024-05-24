import { Handlers, PageProps } from "$fresh/server.ts";
import UrlShortenerView from "../../islands/UrlShortenerView.tsx";
import { ShortenerService } from "../../services/shortener.ts";
import { getCookies } from "https://deno.land/std@0.203.0/http/cookie.ts";
import Hero from "../../components/Hero.tsx"; // Ensure this path is correct

interface Data {
  isAllowed: boolean;
  urls?: Url[];
}

interface Url {
  id: string;
  shortUrl: string;
  originalUrl: string;
  timestamp: string; // Add timestamp here
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const cookies = getCookies(req.headers);
    const isAllowed = Boolean(cookies.auth); // Check if the auth cookie exists

    let urls: Url[] = [];
    if (isAllowed) {
      urls = await ShortenerService.getAll();
    }

    return ctx.render({ isAllowed, urls });
  },

  async POST(req, ctx) {
    const { url } = await req.json();
    await ShortenerService.create(url);
    const urls: Url[] = await ShortenerService.getAll();
    return new Response(JSON.stringify({ urls }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  },

  async PUT(req, ctx) {
    const { id, shortUrl } = await req.json();
    const success = await ShortenerService.update(id, shortUrl);
    if (success) {
      const urls: Url[] = await ShortenerService.getAll();
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
    const urls: Url[] = await ShortenerService.getAll();
    return new Response(JSON.stringify({ urls }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
};

export default function Home({ data }: PageProps<Data>) {
  return (
    <div>
      {data.isAllowed
        ? <UrlShortenerView initialData={data.urls ?? []} latency={0} />
        : <Hero />}
    </div>
  );
}
