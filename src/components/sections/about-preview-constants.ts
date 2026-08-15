export const ABOUT_PREVIEW_PLACEHOLDERS = {
  title: "Designing worlds in three dimensions",
  text: "I'm Anastasia Maidannikova — a 3D designer crafting product renders, spatial visuals, and cinematic stills for brands that want their ideas to feel tangible. From concept sketches to polished frames, I blend technical precision with a storyteller's eye.",
} as const;

export type AboutPreviewContent = {
  title: string;
  text: string;
  imageUrl: string | null;
};
