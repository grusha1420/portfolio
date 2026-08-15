import { createRouteHandler } from "uploadthing/next";

import { env } from "~/env";
import { buildUploadthingToken } from "~/lib/uploadthing-token";

import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: buildUploadthingToken(
      env.UPLOADTHING_SECRET,
      env.UPLOADTHING_APP_ID,
    ),
  },
});
