"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";

import {
  getCalBookingUrl,
  getPublicCalLink,
} from "~/lib/cal-link";
import { cn } from "~/lib/cn";

const Cal = dynamic(() => import("@calcom/embed-react"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[24rem] items-center justify-center text-sm text-muted">
      Loading calendar…
    </div>
  ),
});

interface CalComContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
  isConfigured: boolean;
}

const CalComContext = createContext<CalComContextValue | null>(null);

export function useCalCom(): CalComContextValue {
  const context = useContext(CalComContext);
  if (!context) {
    throw new Error("useCalCom must be used within CalComProvider");
  }
  return context;
}

interface CalComModalPanelProps {
  calLink: string;
  isOpen: boolean;
  onClose: () => void;
  shouldLoadEmbed: boolean;
}

function CalComModalPanel({
  calLink,
  isOpen,
  onClose,
  shouldLoadEmbed,
}: CalComModalPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const bookingUrl = getCalBookingUrl(calLink);

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false);
      return;
    }

    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6",
        "transition-opacity duration-200 ease-out",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Book a call"
    >
      <button
        type="button"
        aria-label="Close booking modal"
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 flex w-full max-w-[900px] flex-col overflow-hidden rounded-2xl bg-card shadow-2xl",
          "transition-transform duration-200 ease-out",
          isVisible ? "scale-100" : "scale-[0.98]",
          "min-h-[min(600px,90vh)] max-h-[90vh]",
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
          <p className="text-sm font-medium text-foreground">Book a call</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          {shouldLoadEmbed ? (
            <div className="cal-embed min-h-[min(540px,75vh)] flex-1 overflow-auto">
              <Cal
                calLink={calLink}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "540px",
                  overflow: "scroll",
                }}
              />
            </div>
          ) : (
            <div className="flex min-h-[24rem] flex-1 items-center justify-center text-sm text-muted">
              Loading calendar…
            </div>
          )}

          <p className="border-t border-border px-4 py-3 text-center text-xs text-muted sm:px-6">
            Calendar not loading?{" "}
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent underline-offset-2 hover:underline"
            >
              Open booking page in a new tab
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export function CalComProvider({ children }: { children: ReactNode }) {
  const calLink = useMemo(() => getPublicCalLink(), []);
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const open = useCallback(() => {
    if (!calLink) return;
    setHasOpened(true);
    setIsOpen(true);
  }, [calLink]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const value = useMemo<CalComContextValue>(
    () => ({
      open,
      close,
      isOpen,
      isConfigured: Boolean(calLink),
    }),
    [open, close, isOpen, calLink],
  );

  return (
    <CalComContext.Provider value={value}>
      {children}
      {calLink ? (
        <CalComModalPanel
          calLink={calLink}
          isOpen={isOpen}
          onClose={close}
          shouldLoadEmbed={hasOpened}
        />
      ) : null}
    </CalComContext.Provider>
  );
}
