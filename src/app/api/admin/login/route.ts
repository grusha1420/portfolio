import { NextResponse } from "next/server";
import { z } from "zod";

import { env } from "~/env";
import { createSession, safeComparePassword } from "~/server/auth";

const loginBodySchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = loginBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  if (!safeComparePassword(parsed.data.password, env.ADMIN_PASSWORD)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  await createSession();

  return NextResponse.json({ success: true });
}
