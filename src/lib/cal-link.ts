/**
 * Parses Cal.com booking URL or path into embed `calLink` (e.g. "username/30min").
 */
export function parseCalLink(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;

  const trimmed = raw.trim();

  try {
    if (trimmed.includes("://")) {
      const url = new URL(trimmed);
      const path = url.pathname.replace(/^\/+|\/+$/g, "");
      return path || null;
    }
  } catch {
    // Not a valid URL — treat as path below.
  }

  const path = trimmed.replace(/^\/+|\/+$/g, "");
  return path || null;
}

export function getPublicCalLink(): string | null {
  return parseCalLink(process.env.NEXT_PUBLIC_CAL_COM_URL);
}

export function getCalBookingUrl(calLink: string): string {
  return `https://cal.com/${calLink}`;
}
