import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { env } from "~/env";

export {
  SESSION_COOKIE_NAME,
  type AdminSession,
  decodeSessionToken,
  encodeSessionToken,
  getSessionFromHeaders,
  parseCookieHeader,
} from "~/server/auth/session";

import {
  createAdminSession,
  encodeSessionToken,
  getSessionFromHeaders,
  SESSION_COOKIE_NAME,
  type AdminSession,
} from "~/server/auth/session";

export async function getSession(
  headers: Headers,
): Promise<AdminSession | null> {
  return getSessionFromHeaders(headers, env.SESSION_SECRET);
}

export async function createSession(): Promise<void> {
  const session = createAdminSession();
  const token = await encodeSessionToken(session, env.SESSION_SECRET);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function safeComparePassword(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) {
    return false;
  }

  return timingSafeEqual(bufA, bufB);
}
