import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { CalComProvider } from "~/components/CalComModal";
import { Header } from "~/components/layout/Header";
import { ThemeProvider } from "~/components/providers/theme-provider";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_SITE_DESCRIPTION,
  getSiteUrl,
  SITE_NAME,
} from "~/lib/seo";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "resurexi — 3D Designer",
    template: "%s | resurexi",
  },
  description: DEFAULT_SITE_DESCRIPTION,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <CalComProvider>
            <TRPCReactProvider>
              <Header />
              {children}
            </TRPCReactProvider>
          </CalComProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
