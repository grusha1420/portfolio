"use client";

import { type ReactNode } from "react";

import { Button, type ButtonProps } from "~/components/ui/button";

import { useCalCom } from "./CalComModal";

export interface BookCallButtonProps extends ButtonProps {
  label?: string;
  children?: ReactNode;
}

export function BookCallButton({
  children,
  label = "Book a call",
  onClick,
  ...props
}: BookCallButtonProps) {
  const { open, isConfigured } = useCalCom();

  if (!isConfigured) return null;

  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          open();
        }
      }}
    >
      {children ?? label}
    </Button>
  );
}
