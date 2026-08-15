export const SESSION_COOKIE_NAME = "resurexi_admin_session";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type AdminSession = {
  isAdmin: true;
  exp: number;
};

export const SESSION_TTL = SESSION_TTL_MS;

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  return Buffer.from(bytes).toString("base64url");
}

function fromBase64Url(str: string): Uint8Array<ArrayBuffer> {
  return new Uint8Array(Buffer.from(str, "base64url"));
}

export async function encodeSessionToken(
  session: AdminSession,
  secret: string,
): Promise<string> {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return `${payload}.${toBase64Url(signature)}`;
}

export async function decodeSessionToken(
  token: string,
  secret: string,
): Promise<AdminSession | null> {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const payload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  if (!payload || !signature) return null;

  const key = await getHmacKey(secret);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    fromBase64Url(signature),
    new TextEncoder().encode(payload),
  );

  if (!valid) return null;

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as AdminSession;

    if (session.isAdmin !== true) return null;
    if (typeof session.exp !== "number" || session.exp < Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function parseCookieHeader(
  cookieHeader: string | null,
  name: string,
): string | undefined {
  if (!cookieHeader) return undefined;

  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName?.trim() === name) {
      return rest.join("=").trim();
    }
  }

  return undefined;
}

export async function getSessionFromHeaders(
  headers: Headers,
  secret: string,
): Promise<AdminSession | null> {
  const token = parseCookieHeader(headers.get("cookie"), SESSION_COOKIE_NAME);
  if (!token) return null;
  return decodeSessionToken(token, secret);
}

export function createAdminSession(): AdminSession {
  return {
    isAdmin: true,
    exp: Date.now() + SESSION_TTL_MS,
  };
}
