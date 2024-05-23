import { h } from "preact";
import { UrlSchema } from "../services/database.ts"; // Adjust the import path as needed

interface DataComponentProps {
  urls: Array<{ id: string } & UrlSchema>;
  archivedUrls: Array<{ id: string } & UrlSchema>;
}

export default function DataComponent({ urls, archivedUrls }: DataComponentProps) {
  return (
    <div class="bg-gray-900 flex gap-2 w-full items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-4xl mx-auto sm:px-6 lg:px-8 bg-gray-800 border border-gray-700 rounded p-4">
        <h1 class="text-xl font-bold text-white mb-4">📊 Database</h1>
        <div>
          <h2 class="text-md font-semibold text-white mt-4">Active URLs</h2>
          <ul>
            {urls.map((url) => (
              <li key={url.id} class="text-gray-300">
                <p>
                  Short URL:{" "}
                  <a href={url.shortUrl} class="text-blue-600 hover:underline">
                    {url.shortUrl}
                  </a>
                </p>
                <p>Original URL: {url.originalUrl}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 class="text-md font-semibold text-white mt-4">Archived URLs</h2>
          <ul>
            {archivedUrls.map((url) => (
              <li key={url.id} class="text-gray-300">
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
