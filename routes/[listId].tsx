import { Handlers, PageProps } from "$fresh/server.ts";
import { ShortenerService } from "../services/shortener.ts"; // Ensure this path is correct

export const handler: Handlers = {
  async GET(req, ctx) {
    const urls = await ShortenerService.getAll();
    return ctx.render({ urls });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const url = form.get("url") as string;
    const shortUrl = await ShortenerService.create(url);
    return new Response(null, {
      status: 303,
      headers: { Location: "/" },
    });
  },
};

export default function Home({ data }: PageProps) {
  return (
    <div>
      <h1>URL Shortener</h1>
      <form method="POST">
        <input type="url" name="url" required />
        <button type="submit">Shorten</button>
      </form>
      <ul>
        {data.urls.map((
          url: { id: string; shortUrl: string; originalUrl: string },
        ) => (
          <li key={url.id}>
            <a href={url.shortUrl}>{url.shortUrl}</a> - {url.originalUrl}
          </li>
        ))}
      </ul>
    </div>
  );
}
