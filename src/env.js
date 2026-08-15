import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    ADMIN_PASSWORD: z
      .string()
      .min(1, "ADMIN_PASSWORD is required for admin authentication"),
    SESSION_SECRET: z
      .string()
      .min(
        32,
        "SESSION_SECRET must be at least 32 characters for signed sessions",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    CAL_COM_URL: z.string().optional(),
    UPLOADTHING_SECRET: z
      .string()
      .min(1, "UPLOADTHING_SECRET is required for media uploads")
      .startsWith("sk_", "UPLOADTHING_SECRET must start with sk_"),
    UPLOADTHING_APP_ID: z
      .string()
      .min(1, "UPLOADTHING_APP_ID is required for media uploads"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CAL_COM_URL: z.string().optional(),
    NEXT_PUBLIC_SITE_URL: z
      .string()
      .url()
      .optional()
      .superRefine((val, ctx) => {
        if (process.env.NODE_ENV === "production" && !val) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "NEXT_PUBLIC_SITE_URL is required in production (use your Vercel URL or custom domain)",
          });
        }
      }),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    SESSION_SECRET: process.env.SESSION_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    CAL_COM_URL: process.env.CAL_COM_URL,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    NEXT_PUBLIC_CAL_COM_URL: process.env.NEXT_PUBLIC_CAL_COM_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
