import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { env } from "~/env";
import { getSessionFromHeaders } from "~/server/auth/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const session = await getSessionFromHeaders(
    request.headers,
    env.SESSION_SECRET,
  );

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
