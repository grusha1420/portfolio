import { type CSSProperties, type ReactNode } from "react";

import { cn } from "~/lib/cn";

import { WaveDivider } from "./WaveDivider";

export type SegmentVariant = "a" | "b" | "default";

export type ColoredSegmentProps = {
  variant: SegmentVariant;
  children: ReactNode;
  /** Which wave dividers to render (default both). */
  waves?: "both" | "top" | "bottom" | "none";
  /** Pull top wave up to overlap previous section (hide background gaps). */
  waveOverlap?: "top" | "none";
  /** Override color shown in wave cutout (defaults to tokens.adjacent). */
  waveAdjacentColor?: string;
  animated?: boolean;
  className?: string;
  id?: string;
};

const SEGMENT_TOKENS: Record<
  SegmentVariant,
  { bg: string; fg: string; adjacent: string }
> = {
  a: {
    bg: "var(--segment-accent-a-bg)",
    fg: "var(--segment-accent-a-fg)",
    adjacent: "var(--segment-default-bg)",
  },
  b: {
    bg: "var(--segment-accent-b-bg)",
    fg: "var(--segment-accent-b-fg)",
    adjacent: "var(--segment-default-bg)",
  },
  default: {
    bg: "var(--segment-default-bg)",
    fg: "var(--foreground)",
    adjacent: "var(--background)",
  },
};

export function ColoredSegment({
  variant,
  children,
  waves = "both",
  waveOverlap = "none",
  waveAdjacentColor,
  animated = true,
  className,
  id,
}: ColoredSegmentProps) {
  const tokens = SEGMENT_TOKENS[variant];
  const showTop = waves === "both" || waves === "top";
  const showBottom = waves === "both" || waves === "bottom";
  const hasTopOverlap = waveOverlap === "top";
  const topAdjacentColor = waveAdjacentColor ?? tokens.adjacent;

  return (
    <section
      id={id}
      className={cn(
        "relative text-[var(--segment-fg)]",
        hasTopOverlap && "z-10",
        className,
      )}
      style={
        {
          "--segment-fg": tokens.fg,
          ...(hasTopOverlap ? {} : { backgroundColor: tokens.bg }),
        } as CSSProperties
      }
    >
      {showTop && (
        <WaveDivider
          position="top"
          fillColor={tokens.bg}
          backgroundColor={topAdjacentColor}
          overlap={hasTopOverlap}
          animated={animated}
        />
      )}
      <div
        className="relative"
        style={hasTopOverlap ? { backgroundColor: tokens.bg } : undefined}
      >
        {children}
      </div>
      {showBottom && (
        <WaveDivider
          position="bottom"
          fillColor={tokens.bg}
          backgroundColor={tokens.adjacent}
          animated={animated}
        />
      )}
    </section>
  );
}
