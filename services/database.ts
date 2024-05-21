import { z } from "zod";

export const kv = await Deno.openKv();

export const urlSchema = z.object({
  originalUrl: z.string().url(),
  shortUrl: z.string(),
  archived: z.boolean(),
});
export type UrlSchema = z.infer<typeof urlSchema>;

const BASE_URL = Deno.env.get("BASE_URL") || "http://advrk.io";

function generateShortId(length = 7) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function createUrlEntry(originalUrl: string): Promise<string> {
  const id = generateShortId();
  const shortUrl = `${BASE_URL}/${id}`;
  const urlEntry: UrlSchema = { originalUrl, shortUrl, archived: false };
  await kv.set(["url", id], urlEntry);
  return shortUrl;
}

export async function getAllUrls(): Promise<Array<{ id: string } & UrlSchema>> {
  const urls = [];
  const it = kv.list({ prefix: ["url"] });
  for await (const entry of it) {
    const url = entry.value as UrlSchema;
    if (!url.archived) {
      urls.push({ id: entry.key[1] as string, ...url });
    }
  }
  return urls;
}

export async function getAllArchivedUrls(): Promise<Array<{ id: string } & UrlSchema>> {
  const urls = [];
  const it = kv.list({ prefix: ["url"] });
  for await (const entry of it) {
    const url = entry.value as UrlSchema;
    if (url.archived) {
      urls.push({ id: entry.key[1] as string, ...url });
    }
  }
  return urls;
}

export async function getUrl(id: string): Promise<UrlSchema | undefined> {
  const entry = await kv.get(["url", id]);
  return entry.value as UrlSchema | undefined;
}

export async function updateUrl(id: string, newShortUrl: string): Promise<boolean> {
  const entry = await kv.get(["url", id]);
  if (!entry.value) {
    console.error(`No URL entry found for id: ${id}`);
    return false;
  }
  const updatedEntry: UrlSchema = { ...entry.value as UrlSchema, shortUrl: newShortUrl };
  await kv.set(["url", id], updatedEntry);
  console.log(`Updated URL entry for id: ${id}, new short URL: ${newShortUrl}`);
  return true;
}

export async function archiveUrl(id: string): Promise<boolean> {
  const entry = await kv.get(["url", id]);
  if (!entry.value) {
    console.error(`No URL entry found for id: ${id}`);
    return false;
  }
  const updatedEntry: UrlSchema = { ...entry.value as UrlSchema, archived: true };
  await kv.set(["url", id], updatedEntry);
  return true;
}

export async function deleteUrl(id: string): Promise<boolean> {
  const entry = await kv.get(["url", id]);
  if (!entry.value) {
    console.error(`No URL entry found for id: ${id}`);
    return false;
  }
  await kv.delete(["url", id]);
  return true;
}
