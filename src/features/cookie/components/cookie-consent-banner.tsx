"use client";

import { Button } from "@/components/ui/shadcn/button";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { CookieIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { useEffect, useRef, useState } from "react";

export function cookieConsentGiven() {
  if (!localStorage.getItem("cookie_consent")) {
    return "undecided";
  }
  return localStorage.getItem("cookie_consent");
}

export default function CookieConsentBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [consentGiven, setConsentGiven] = useState("");
  const posthog = usePostHog();

  const t = useTranslations("cookieConsentBanner");

  useEffect(() => {
    setConsentGiven(cookieConsentGiven() ?? "undecided");
  }, []);

  useEffect(() => {
    if (consentGiven !== "") {
      posthog.set_config({
        persistence: consentGiven === "yes" ? "localStorage+cookie" : "memory",
      });
    }
  }, [consentGiven, posthog]);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookie_consent", "yes");
    setConsentGiven("yes");
    gsap.to(bannerRef.current, {
      y: 200,
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    });
  };

  const handleDeclineCookies = () => {
    localStorage.setItem("cookie_consent", "no");
    setConsentGiven("no");
    gsap.to(bannerRef.current, {
      y: 200,
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    });
  };

  return (
    <AnimatePresence>
      {consentGiven === "undecided" && (
        <motion.div
          ref={bannerRef}
          initial={{ y: 0, opacity: 1 }}
          className="fixed right-0 bottom-0 left-0 z-[200] w-full sm:bottom-4 sm:left-4 sm:max-w-md"
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
        >
          <motion.div
            className="dark:bg-card bg-background border-border m-3 rounded-lg border"
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between p-3">
              <h1 id="cookie-consent-title" className="text-lg font-medium">
                {t("title")}
              </h1>
              <CookieIcon
                className="h-[1.2rem] w-[1.2rem]"
                aria-hidden="true"
              />
            </div>
            <div className="-mt-2 p-3">
              <p
                id="cookie-consent-description"
                className="text-muted-foreground text-left text-sm"
              >
                {t("description")}
                <br />
                <br />
                <span className="text-xs">
                  {t("byClickingAccept1")}
                  <span className="font-medium">&quot;{t("accept")}&quot;</span>
                  {t("byClickingAccept2")}
                </span>
                <br />
                <Link
                  href="#"
                  className="text-xs underline"
                  aria-label="Learn more about our cookie policy"
                >
                  {t("learnMore")}
                </Link>
              </p>
            </div>
            <div className="mt-2 flex items-center gap-2 border-t p-3">
              <Button
                onClick={handleAcceptCookies}
                className="h-9 flex-1"
                aria-label="Accept cookies"
              >
                {t("accept")}
              </Button>
              <Button
                onClick={handleDeclineCookies}
                className="h-9 flex-1"
                variant="outline"
                aria-label="Decline cookies"
              >
                {t("decline")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
