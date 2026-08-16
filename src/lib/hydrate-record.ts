export function shouldHydrateLoadedRecord(
  recordId: string | undefined,
  hydratedId: string | null,
): boolean {
  return Boolean(recordId && recordId !== hydratedId);
}
