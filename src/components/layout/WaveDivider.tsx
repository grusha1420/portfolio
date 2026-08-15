import { cn } from "~/lib/cn";

import {
  WAVE_BOTTOM_PATH,
  WAVE_MAIN_PATH,
  WAVE_SHADOW_PATH,
  WAVE_VIEWBOX_HEIGHT,
  WAVE_VIEWBOX_WIDTH,
} from "./wave-paths";

export type WaveDividerProps = {
  position: "top" | "bottom";
  /** CSS variable or hex — color of the segment this wave belongs to. */
  fillColor: string;
  /** Adjacent segment color for seamless blend (defaults to page background). */
  backgroundColor?: string;
  /** Gentle horizontal scroll like kenney.nl (default true). */
  animated?: boolean;
  /** When top position: overlap previous content by wave height. */
  overlap?: boolean;
  /** Extra overlap in px for subpixel gaps (top + overlap only). */
  overlapExtra?: number;
  className?: string;
};

const TILE_OFFSETS = [0, WAVE_VIEWBOX_WIDTH] as const;

function WaveTile({
  fillColor,
  backgroundColor,
  position,
  offset,
  overlap = false,
}: {
  fillColor: string;
  backgroundColor: string;
  position: "top" | "bottom";
  offset: number;
  overlap?: boolean;
}) {
  if (position === "top" && overlap) {
    return (
      <g transform={`translate(${offset}, 0)`}>
        <path d={WAVE_BOTTOM_PATH} fill={fillColor} />
      </g>
    );
  }

  if (position === "top") {
    return (
      <g transform={`translate(${offset}, 0)`}>
        <rect
          width={WAVE_VIEWBOX_WIDTH}
          height={WAVE_VIEWBOX_HEIGHT}
          fill={fillColor}
        />
        <path d={WAVE_MAIN_PATH} fill={backgroundColor} />
        <path d={WAVE_SHADOW_PATH} fill="#000" fillOpacity={0.08} />
      </g>
    );
  }

  return (
    <g transform={`translate(${offset}, 0)`}>
      <rect
        width={WAVE_VIEWBOX_WIDTH}
        height={WAVE_VIEWBOX_HEIGHT}
        fill={fillColor}
      />
      <path d={WAVE_BOTTOM_PATH} fill={backgroundColor} />
    </g>
  );
}

export function WaveDivider({
  position,
  fillColor,
  backgroundColor = "var(--background)",
  animated = true,
  overlap = false,
  overlapExtra = 0,
  className,
}: WaveDividerProps) {
  const isTop = position === "top";
  const useOverlapMargin = isTop && overlap;
  const useOverlapExtra = useOverlapMargin && overlapExtra > 0;

  return (
    <div
      className={cn(
        "pointer-events-none relative w-full overflow-hidden leading-none",
        "h-[var(--wave-divider-height)]",
        isTop &&
          (useOverlapMargin && !useOverlapExtra
            ? "-mt-[var(--wave-divider-height)]"
            : !useOverlapMargin && "-mt-px"),
        !isTop && "-mb-px",
        className,
      )}
      style={
        useOverlapExtra
          ? {
              marginTop: `calc(-1 * (var(--wave-divider-height) + ${overlapExtra}px))`,
            }
          : undefined
      }
      aria-hidden
    >
      <svg
        className="block h-full w-full"
        viewBox={`0 0 ${WAVE_VIEWBOX_WIDTH} ${WAVE_VIEWBOX_HEIGHT}`}
        preserveAspectRatio="none"
        overflow="hidden"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          className={cn(
            animated &&
              (isTop ? "wave-divider-animate" : "wave-divider-animate-reverse"),
          )}
        >
          {TILE_OFFSETS.map((offset) => (
            <WaveTile
              key={offset}
              offset={offset}
              position={position}
              fillColor={fillColor}
              backgroundColor={backgroundColor}
              overlap={isTop && overlap}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
