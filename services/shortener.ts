import { db, createUrlEntry, getAllUrls, getUrl, updateUrl, archiveUrl, UrlSchema, getAllArchivedUrls, deleteUrl } from "./database.ts";

export class ShortenerService {
  static create(originalUrl: string): Promise<string> {
    return createUrlEntry(originalUrl);
  }

  static getAll(): Promise<Array<{ id: string } & UrlSchema>> {
    return getAllUrls();
  }

  static get(id: string): Promise<UrlSchema | undefined> {
    return getUrl(id);
  }

  static update(id: string, newShortUrl: string): Promise<boolean> {
    return updateUrl(id, newShortUrl);
  }

  static archive(id: string): Promise<boolean> {
    return archiveUrl(id);
  }

  static getAllArchived(): Promise<Array<{ id: string } & UrlSchema>> {
    return getAllArchivedUrls();
  }

  static delete(id: string): Promise<boolean> {
    return deleteUrl(id);
  }

  static async restore(id: string): Promise<boolean> {
    const entry = await db.get(["url", id]);
    if (!entry.value) {
      return false;
    }
    const updatedEntry: UrlSchema = { ...entry.value as UrlSchema, archived: false };
    await db.set(["url", id], updatedEntry);
    return true;
  }
}
