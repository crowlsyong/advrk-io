// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_id_ from "./routes/[id].tsx";
import * as $_listId_ from "./routes/[listId].tsx";
import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_check_duplicates from "./routes/api/check-duplicates.ts";
import * as $api_joke from "./routes/api/joke.ts";
import * as $api_login from "./routes/api/login.ts";
import * as $archive2 from "./routes/archive2.tsx";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $login from "./routes/login.tsx";
import * as $logindex from "./routes/logindex.tsx";
import * as $logout from "./routes/logout.ts";
import * as $qr from "./routes/qr.tsx";
import * as $s_middleware from "./routes/s/_middleware.ts";
import * as $s_archive from "./routes/s/archive.tsx";
import * as $s_data from "./routes/s/data.tsx";
import * as $s_index from "./routes/s/index.tsx";
import * as $u_create from "./routes/u/create.tsx";
import * as $u_db from "./routes/u/db.tsx";
import * as $u_index from "./routes/u/index.tsx";
import * as $ArchiveView from "./islands/ArchiveView.tsx";
import * as $ArchiveView2 from "./islands/ArchiveView2.tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $CreateUserForm from "./islands/CreateUserForm.tsx";
import * as $ErrorHandler from "./islands/ErrorHandler.tsx";
import * as $Footer from "./islands/Footer.tsx";
import * as $Notification from "./islands/Notification.tsx";
import * as $QrCodeGenerator from "./islands/QrCodeGenerator.tsx";
import * as $Search from "./islands/Search.tsx";
import * as $TopBar from "./islands/TopBar.tsx";
import * as $UrlList from "./islands/UrlList.tsx";
import * as $UrlShortenerView from "./islands/UrlShortenerView.tsx";
import * as $qrcode from "./islands/qrcode.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/[id].tsx": $_id_,
    "./routes/[listId].tsx": $_listId_,
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/check-duplicates.ts": $api_check_duplicates,
    "./routes/api/joke.ts": $api_joke,
    "./routes/api/login.ts": $api_login,
    "./routes/archive2.tsx": $archive2,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
    "./routes/login.tsx": $login,
    "./routes/logindex.tsx": $logindex,
    "./routes/logout.ts": $logout,
    "./routes/qr.tsx": $qr,
    "./routes/s/_middleware.ts": $s_middleware,
    "./routes/s/archive.tsx": $s_archive,
    "./routes/s/data.tsx": $s_data,
    "./routes/s/index.tsx": $s_index,
    "./routes/u/create.tsx": $u_create,
    "./routes/u/db.tsx": $u_db,
    "./routes/u/index.tsx": $u_index,
  },
  islands: {
    "./islands/ArchiveView.tsx": $ArchiveView,
    "./islands/ArchiveView2.tsx": $ArchiveView2,
    "./islands/Counter.tsx": $Counter,
    "./islands/CreateUserForm.tsx": $CreateUserForm,
    "./islands/ErrorHandler.tsx": $ErrorHandler,
    "./islands/Footer.tsx": $Footer,
    "./islands/Notification.tsx": $Notification,
    "./islands/QrCodeGenerator.tsx": $QrCodeGenerator,
    "./islands/Search.tsx": $Search,
    "./islands/TopBar.tsx": $TopBar,
    "./islands/UrlList.tsx": $UrlList,
    "./islands/UrlShortenerView.tsx": $UrlShortenerView,
    "./islands/qrcode.tsx": $qrcode,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
