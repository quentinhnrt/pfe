"use client";

import { Toaster } from "@/components/ui/sonner";
import TailwindIndicator from "@/components/utils/tailwind-indicator";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { cookieConsentGiven } from "./cookie-consent-banner";

const queryClient = new QueryClient({});

export const Providers = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
      persistence:
        cookieConsentGiven() === "yes" ? "localStorage+cookie" : "memory",
    });
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <PHProvider client={posthog}>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-right" />
          {children}
          <TailwindIndicator />
        </QueryClientProvider>
      </PHProvider>
    </ThemeProvider>
  );
};
