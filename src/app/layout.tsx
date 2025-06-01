import CookieConsentBanner from "@/features/cookie-banner/components/cookie-consent-banner";
import ConditionalHeader from "@/features/header/components/conditional-header";
import { SessionProvider } from "@/hooks/use-session";
import { auth } from "@/lib/auth";
import { generateBaseMetadata } from "@/lib/seo/metadata";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Encode_Sans } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";

const fontSans = Encode_Sans({
  variable: "--encode-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const fontSerif = Encode_Sans({
  variable: "--encode-serif",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const fontMono = Encode_Sans({
  variable: "--encode-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  return generateBaseMetadata();
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

type RawUser = {
  id: string;
  firstname: string | null;
  image: string | null;
};

type RawSession = {
  user: RawUser | null;
} | null;

type SafeUser = {
  id: string;
  firstname?: string;
  image?: string;
};

type SafeSession = {
  user: SafeUser | null;
} | null;

function cleanSession(rawSession: RawSession): SafeSession {
  if (!rawSession) return null;
  const user = rawSession.user;

  return {
    user: user
      ? {
          id: user.id,
          firstname: user.firstname ?? undefined,
          image: user.image ?? undefined,
        }
      : null,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const rawSession = await auth.api.getSession({
    headers: await headers(),
  });

  const session = cleanSession(rawSession);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider>
          <SessionProvider initialSession={session}>
            <Providers>
              <CookieConsentBanner />
              <ConditionalHeader />
              {children}
            </Providers>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}