import { auth } from "@/lib/auth";
import { siteConfig } from "@/lib/seo/metadata";
import { ArrowLeftIcon } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthTabs } from "@/features/auth/components/auth-tabs";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getTranslations("commons.metadata");
  const title = m("sign-in");
  const description = "Sign in to your ArtiLink account to connect with artists and discover amazing artworks";

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      url: `${siteConfig.url}/sign-in`,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/sign-in`,
    },
  };
}

export default async function SignInPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  const t = await getTranslations("page.sign-in");
  const c = await getTranslations("commons");

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 flex">
        <div className="hidden md:flex md:w-1/2 bg-muted relative">
          <Image
            src={"/signin.jpg"}
            alt=""
            width={800}
            height={800}
            className={"absolute inset-0 w-full h-full object-cover"}
          />
          <div className="absolute inset-0 bg-black/10 flex flex-col justify-end p-8 text-white">
            <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
            <p className="text-sm">{t("description")}</p>
          </div>
        </div>

        <div className="relative w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <Link
            href="/"
            className="absolute top-4 left-3 flex items-center gap-2 z-50 text-sm leading-none font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {c("back-to-home")}
          </Link>
          <div className="w-full max-w-md">
            <AuthTabs />
          </div>
        </div>
      </div>
    </div>
  );
}
