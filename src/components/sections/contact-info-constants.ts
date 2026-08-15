export const CONTACT_INFO_PLACEHOLDERS = {
  contactEmail: "hello@resurexi.com",
  responseTimeText: "I respond within 24 hours.",
  basedInText: "Working worldwide.",
} as const;

export type ContactInfoContent = {
  contactEmail: string;
  responseTimeText: string;
  basedInText: string;
};
