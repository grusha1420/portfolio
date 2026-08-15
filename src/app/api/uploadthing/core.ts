import "server-only";

import type { NextRequest } from "next/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { getSession } from "~/server/auth";

const f = createUploadthing();

async function requireAdminSession({ req }: { req: NextRequest }) {
  const session = await getSession(req.headers);

  if (!session) {
    // UploadThingError is the expected control-flow type for uploadthing middleware.
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new UploadThingError({
      code: "FORBIDDEN",
      message: "Unauthorized",
    });
  }

  return { isAdmin: true as const };
}

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 20,
    },
  })
    .middleware(requireAdminSession)
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl, name: file.name };
    }),

  heroImageUploader: f({
    image: {
      maxFileSize: "32MB",
      maxFileCount: 1,
    },
  })
    .middleware(requireAdminSession)
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl, name: file.name };
    }),

  wireframeImageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(requireAdminSession)
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
