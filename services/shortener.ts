import { kv, createUrlEntry, getAllUrls, updateUrl, archiveUrl, UrlSchema, getAllArchivedUrls, deleteUrl, getUrlEntry, getShortUrlEntry } from "./database.ts";

export class ShortenerService {
  static async create(originalUrl: string): Promise<string> {
    return await createUrlEntry(originalUrl);
  }

  static async getAll(): Promise<Array<{ id: string } & UrlSchema>> {
    return await getAllUrls();
  }

  static async get(id: string): Promise<UrlSchema | undefined> {
    return await getUrlEntry(id);
  }

  static async getShortUrlEntry(shortUrl: string): Promise<UrlSchema | undefined> {
    return await getShortUrlEntry(shortUrl);
  }

  static async update(id: string, newShortUrl: string): Promise<boolean> {
    return await updateUrl(id, newShortUrl);
  }

  static async archive(id: string): Promise<boolean> {
    return await archiveUrl(id);
  }

  static async getAllArchived(): Promise<Array<{ id: string } & UrlSchema>> {
    return await getAllArchivedUrls();
  }

  static async delete(id: string): Promise<boolean> {
    return await deleteUrl(id);
  }

  static async restore(id: string): Promise<boolean> {
    const entry = await kv.get(["url", id]);
    if (!entry.value) {
      return false;
    }
    const updatedEntry: UrlSchema = { ...entry.value as UrlSchema, archived: false };
    await kv.set(["url", id], updatedEntry);
    return true;
  }
}
