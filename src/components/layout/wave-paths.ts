/**
 * Organic wave paths inspired by kenney.nl frontpage waves.
 * Quadratic beziers — flat edge on one side, organic curve on the other.
 */

/** Main wave — flat top, organic bottom edge (used for top position, flipped for bottom). */
export const WAVE_MAIN_PATH =
  "M 1280 95.1 L 1280 0 0 0 0 95.1 Q 151.95 128.1 304.55 54.25 457.05 -19.6 623.65 63.35 790.2 146.25 924.65 93.4 1059.05 40.55 1194.35 73.95 L 1280 95.1 Z";

/** Subtle shadow layer beneath the main wave crest. */
export const WAVE_SHADOW_PATH =
  "M 1280 97.75 L 1280 18 0 18 0 97.75 Q 151.95 122.65 304.55 66.95 457.05 11.2 623.65 73.8 790.2 136.35 924.65 96.45 1059.05 56.6 1194.35 81.8 L 1280 97.75 Z";

/** Bottom wave — organic top edge, flat bottom (Kenney bottom variant). */
export const WAVE_BOTTOM_PATH =
  "M 1280 56.8 Q 1271.86 60.56 1263.65 64.65 1097.05 147.6 944.55 73.75 791.95 -0.1 640 32.9 L 554.35 54.05 Q 419.05 87.45 284.65 34.6 156.83 -15.64 0 56.8 L 0 128 1280 128 1280 56.8 Z";

export const WAVE_VIEWBOX_WIDTH = 1280;
export const WAVE_VIEWBOX_HEIGHT = 128;
