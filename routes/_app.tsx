import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import TopBar from "../islands/TopBar.tsx";
import Footer from "../islands/Footer.tsx";

export default function App({ Component, state }: PageProps) {
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
        <Footer /> {/* Include the Footer component */}
      </body>
    </html>
  );
}
