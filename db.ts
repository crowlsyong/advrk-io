import { openKv } from "https://deno.land/x/kv/mod.ts";

const kv = await openKv();

export async function shortenURL(originalURL: string): Promise<string> {
  const shortCode = Math.random().toString(36).substring(2, 8);
  await kv.set(shortCode, originalURL);
  return shortCode;
}

export async function getOriginalURL(shortCode: string): Promise<string | null> {
  const value = await kv.get(shortCode);
  return value ?? null;
}
