import { Handlers } from "$fresh/server.ts";
import { getUrlEntry, getShortUrlEntry, updateUrl } from "../services/database.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const { id } = ctx.params;
    console.log(`Received GET request with ID: ${id}`);
    
    let urlEntry = await getUrlEntry(id);
    console.log(`Fetched URL entry by ID: ${JSON.stringify(urlEntry)}`);
    
    // If not found by ID, try fetching by short URL
    if (!urlEntry) {
      const shortUrl = `${new URL(req.url).origin}/${id}`;
      urlEntry = await getShortUrlEntry(shortUrl);
      console.log(`Fetched URL entry by short URL: ${JSON.stringify(urlEntry)}`);
    }

    if (urlEntry && !urlEntry.archived) {
      console.log(`Redirecting to: ${urlEntry.originalUrl}`);
      return new Response(null, {
        status: 302,
        headers: {
          Location: urlEntry.originalUrl,
        },
      });
    }

    console.log("URL not found or archived.");
    return new Response("URL not found lol", { status: 404 });
  },

  async PUT(req, ctx) {
    const { id } = ctx.params;
    const { shortUrl } = await req.json();
    console.log(`Received PUT request with ID: ${id} and shortUrl: ${shortUrl}`);

    const success = await updateUrl(id, shortUrl);
    console.log(`Update result: ${success}`);

    if (success) {
      return new Response("URL updated", { status: 200 });
    }
    return new Response("URL not found", { status: 404 });
  },
};
