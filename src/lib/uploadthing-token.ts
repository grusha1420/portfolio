/**
 * Uploadthing v7 expects a base64-encoded JSON token.
 * We derive it from UPLOADTHING_SECRET + UPLOADTHING_APP_ID (v6-style env vars).
 */
export function buildUploadthingToken(
  apiKey: string,
  appId: string,
  region = "sea1",
): string {
  const payload = {
    apiKey,
    appId,
    regions: [region],
  };

  return Buffer.from(JSON.stringify(payload)).toString("base64");
}
