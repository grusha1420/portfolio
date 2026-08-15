import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { env } from "~/env";
import {
  decodeSessionToken,
  SESSION_COOKIE_NAME,
} from "~/server/auth/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token
    ? await decodeSessionToken(token, env.SESSION_SECRET)
    : null;

  if (!session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
