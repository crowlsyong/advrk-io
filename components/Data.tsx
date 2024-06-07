import { UrlSchema } from "../services/database.ts"; // Adjust the import path as needed

interface DataComponentProps {
  urls: Array<{ id: string } & UrlSchema>;
  archivedUrls: Array<{ id: string } & UrlSchema>;
}

export default function DataComponent({ urls, archivedUrls }: DataComponentProps) {
  return (
    <div class="flex gap-2 w-full items-center justify-center py-0 px-0 sm:px-8 sm:py-8 dark:bg-gray-900">
      <div class="w-full max-w-4xl mx-auto sm:px-6 lg:px-8 bg-gray-800 border border-gray-700 rounded p-4">
        <h1 class="text-3xl sm:text-xl font-bold text-white mb-4">📊 Database</h1>
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
