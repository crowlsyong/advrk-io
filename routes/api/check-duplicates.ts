import { HandlerContext } from "$fresh/server.ts";
import { isDuplicateShortUrl } from "../../services/database.ts";

export const handler = async (
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { shortUrls } = await req.json();
    const duplicates: string[] = [];

    for (const shortUrl of shortUrls) {
      if (await isDuplicateShortUrl(shortUrl)) {
        duplicates.push(shortUrl);
      }
    }

    return new Response(JSON.stringify({ duplicates }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error checking duplicates:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
