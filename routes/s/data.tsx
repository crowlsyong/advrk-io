import { Handlers, PageProps } from "$fresh/server.ts";
import {
  getAllArchivedUrls,
  getAllUrls,
  UrlSchema,
} from "../../services/database.ts";
import DataComponent from "../../components/Data.tsx";

export const handler: Handlers = {
  async GET(_, ctx) {
    const urls = await getAllUrls();
    const archivedUrls = await getAllArchivedUrls();
    return ctx.render({ urls, archivedUrls });
  },
};

export default function DataPage(
  { data }: PageProps<
    {
      urls: Array<{ id: string } & UrlSchema>;
      archivedUrls: Array<{ id: string } & UrlSchema>;
    }
  >,
) {
  return <DataComponent urls={data.urls} archivedUrls={data.archivedUrls} />;
}
