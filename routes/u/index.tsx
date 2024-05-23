// routes/index.tsx
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET() {
    return new Response("Hello World");
  },
};

export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
