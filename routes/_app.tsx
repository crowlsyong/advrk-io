import { type AppProps } from "$fresh/server.ts";
import TopBar from "../islands/TopBar.tsx"; // Ensure this matches the casing of your file

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>shrt url</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
      <TopBar /> {/* Include the Menu component */}
        <Component />
      </body>
    </html>
  );
}
