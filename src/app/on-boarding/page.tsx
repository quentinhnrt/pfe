import { ArrowLeftIcon } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import OnBoardingForm from "@/features/on-boarding/components/on-boarding-form";
import { auth } from "@/lib/auth";
import { siteConfig } from "@/lib/seo/metadata";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("page.on-boarding");
  const title = t("title");
  const description = t("meta-description");

  return {
    title,
    description,
    keywords: ["onboarding", "profile setup", "account setup", "artist registration"],
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      url: `${siteConfig.url}/on-boarding`,
      siteName: siteConfig.name,
      images: [
        {
          url: "/signin.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/signin.jpg"],
    },
    alternates: {
      canonical: `${siteConfig.url}/on-boarding`,
    },
  };
}

export default async function OnBoardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const t = await getTranslations("page.on-boarding");
  const c = await getTranslations("commons");
  const a = await getTranslations("app");
  const aria = await getTranslations("commons.aria");

  if (!session || !session.user || session.user.onBoarded) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 flex">
        <div className="hidden md:flex md:w-2/6 bg-muted relative">
          <Image
            src="/signin.jpg"
            alt={aria("decorative-art-image")}
            width={800}
            height={800}
            className="absolute inset-0 w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/10 flex flex-col justify-end p-8 text-white">
            <h1 className="text-2xl font-bold mb-2">{a("title")}</h1>
            <p className="text-sm">{t("description")}</p>
          </div>
        </div>

        <div className="relative w-full md:w-4/5 flex items-center justify-center p-4 md:p-8">
          <Link
            href="/"
            className="absolute top-4 left-3 flex items-center gap-2 z-50 text-sm leading-none font-medium p-2 hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            aria-label={aria("back-to-home")}
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            <span>{c("back-to-home")}</span>
          </Link>

          <div
            className="w-full max-w-md"
            role="region"
            aria-label={aria("profile-form")}
          >
            <OnBoardingForm user={session.user} />
          </div>
        </div>
      </div>
    </main>
  );
}
