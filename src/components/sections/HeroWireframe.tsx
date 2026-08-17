"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import { cn } from "~/lib/cn";

interface HeroWireframeProps {
  wireframeUrl: string;
  wireframeColorUrl: string;
  heroRef: RefObject<HTMLElement | null>;
  className?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    setIsTouch(coarsePointer || noHover);
  }, []);

  return isTouch;
}

export function HeroWireframe({
  wireframeUrl,
  wireframeColorUrl,
  heroRef,
  className,
}: HeroWireframeProps) {
  const [colorOpacity, setColorOpacity] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isTouchDevice = useIsTouchDevice();

  const updateFromCursor = useCallback(
    (clientY: number) => {
      const hero = heroRef.current;
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      if (rect.height <= 0) return;

      const relativeY = clientY - rect.top;
      const progress = clamp(relativeY / rect.height, 0, 1);
      setColorOpacity(progress);
    },
    [heroRef],
  );

  const updateFromScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const viewportHeight = window.innerHeight;
    if (viewportHeight <= 0) return;

    const { top } = el.getBoundingClientRect();
    // Element at the bottom of the viewport → 0; at the top edge → 1
    const progress = 1 - clamp(top / viewportHeight, 0, 1);
    setColorOpacity(progress);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setColorOpacity(0.5);
      return;
    }

    if (isTouchDevice) {
      updateFromScroll();

      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        rafRef.current = window.requestAnimationFrame(() => {
          updateFromScroll();
          ticking = false;
        });
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (rafRef.current !== null) {
          window.cancelAnimationFrame(rafRef.current);
        }
      };
    }

    const hero = heroRef.current;
    if (!hero) return;

    const onMouseMove = (event: MouseEvent) => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = window.requestAnimationFrame(() => {
        updateFromCursor(event.clientY);
      });
    };

    hero.addEventListener("mousemove", onMouseMove);
    return () => {
      hero.removeEventListener("mousemove", onMouseMove);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [
    heroRef,
    isTouchDevice,
    prefersReducedMotion,
    updateFromCursor,
    updateFromScroll,
  ]);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative aspect-[2/1] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={wireframeUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={wireframeColorUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-75"
          style={{ opacity: colorOpacity }}
          draggable={false}
        />
      </div>
    </div>
  );
}
