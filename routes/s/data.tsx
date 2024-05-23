import { Handlers, PageProps } from "$fresh/server.ts";
import {
  getAllArchivedUrls,
  getAllUrls,
  UrlSchema,
} from "../../services/database.ts";

export const handler: Handlers = {
  async GET(_, ctx) {
    const urls = await getAllUrls();
    const archivedUrls = await getAllArchivedUrls();
    return ctx.render({ urls, archivedUrls });
  },
};

export default function DataPage(
  { data }: PageProps<
    {
      urls: Array<{ id: string } & UrlSchema>;
      archivedUrls: Array<{ id: string } & UrlSchema>;
    }
  >,
) {
  return (
    <div class="bg-gray-900 flex gap-2 w-full items-center  justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-4xl mx-auto sm:px-6 lg:px-8 bg-gray-100 border border-black rounded p-4">
        <h1 class="text-xl font-bold mb-4">📊 Database</h1>
        <div>
          <h2 class="text-md font-semibold mt-4">Active URLs</h2>
          <ul>
            {data.urls.map((url) => (
              <li key={url.id}>
                <p>
                  Short URL:{" "}
                  <a href={url.shortUrl} class="text-blue-600">
                    {url.shortUrl}
                  </a>
                </p>
                <p>Original URL: {url.originalUrl}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 class="text-md font-semibold mt-4">Archived URLs</h2>
          <ul>
            {data.archivedUrls.map((url) => (
              <li key={url.id}>
                <p>Short URL: {url.shortUrl}</p>
                <p>Original URL: {url.originalUrl}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
