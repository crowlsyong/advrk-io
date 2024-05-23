// database.ts
import { z } from "zod";

export const kv = await Deno.openKv();

export const urlSchema = z.object({
  originalUrl: z.string().url(),
  shortUrl: z.string(),
  archived: z.boolean(),
  timestamp: z.string(), // Add timestamp field
});
export type UrlSchema = z.infer<typeof urlSchema>;

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(), // In a real application, you'd store a hashed password
});
export type UserSchema = z.infer<typeof userSchema>;
export const sessionSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  timestamp: z.string(),
});
export type SessionSchema = z.infer<typeof sessionSchema>;

export async function saveSession(
  userId: string,
  sessionId: string,
): Promise<void> {
  const timestamp = new Date().toISOString();
  const sessionEntry: SessionSchema = { userId, sessionId, timestamp };
  await kv.set(["session", sessionId], sessionEntry);
}

export async function getSession(
  sessionId: string,
): Promise<SessionSchema | undefined> {
  const entry = await kv.get(["session", sessionId]);
  return entry.value as SessionSchema | undefined;
}
const BASE_URL = Deno.env.get("BASE_URL") || "https://advrk.io";

function generateShortId(length = 4) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function createUrlEntry(originalUrl: string): Promise<string> {
  const id = generateShortId();
  const shortUrl = `${BASE_URL}/${id}`;
  const timestamp = new Date().toISOString(); // Add timestamp
  const urlEntry: UrlSchema = {
    originalUrl,
    shortUrl,
    archived: false,
    timestamp,
  };
  await kv.set(["url", id], urlEntry);
  return shortUrl;
}

export async function isDuplicateUrl(originalUrl: string): Promise<boolean> {
  const it = kv.list({ prefix: ["url"] });
  for await (const entry of it) {
    const url = entry.value as UrlSchema;
    if (!url.archived && url.originalUrl === originalUrl) {
      return true;
    }
  }
  return false;
}

export async function isDuplicateShortUrl(shortUrl: string): Promise<boolean> {
  const it = kv.list({ prefix: ["url"] });
  for await (const entry of it) {
    const url = entry.value as UrlSchema;
    if (!url.archived && url.shortUrl === shortUrl) {
      return true;
    }
  }
  return false;
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

export async function getAllArchivedUrls(): Promise<
  Array<{ id: string } & UrlSchema>
> {
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

export async function getUrlEntry(id: string): Promise<UrlSchema | undefined> {
  const entry = await kv.get(["url", id]);
  return entry.value as UrlSchema | undefined;
}

export async function getShortUrlEntry(
  shortUrl: string,
): Promise<UrlSchema | undefined> {
  const it = kv.list({ prefix: ["url"] });
  for await (const entry of it) {
    const url = entry.value as UrlSchema;
    if (url.shortUrl === shortUrl) {
      return url;
    }
  }
  return undefined;
}

export async function updateUrl(
  id: string,
  newShortUrl: string,
): Promise<boolean> {
  const entry = await kv.get(["url", id]);
  if (!entry.value) {
    console.error(`No URL entry found for id: ${id}`);
    return false;
  }
  const updatedEntry: UrlSchema = {
    ...entry.value as UrlSchema,
    shortUrl: newShortUrl,
  };
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
  const updatedEntry: UrlSchema = {
    ...entry.value as UrlSchema,
    archived: true,
  };
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

// User-related functions
export async function createUser(
  username: string,
  password: string,
): Promise<void> {
  const id = generateShortId(8); // Generate unique ID for the user
  const userEntry: UserSchema = { id, username, password };
  await kv.set(["user", id], userEntry);
}

export async function getUser(
  username: string,
): Promise<UserSchema | undefined> {
  const it = kv.list({ prefix: ["user"] });
  for await (const entry of it) {
    const user = entry.value as UserSchema;
    if (user.username === username) {
      return user;
    }
  }
  return undefined;
}
