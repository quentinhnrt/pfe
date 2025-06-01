import { redirect } from "next/navigation";
import { Metadata } from "next";

import { AppearanceForm } from "@/features/settings/components/appearance-form";
import { siteConfig } from "@/lib/seo/metadata";
import { getCurrentUser } from "@/lib/users";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("page.settings.appearance");
  
  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${siteConfig.url}/settings/appearance`,
    },
  };
}

export default async function AppearanceSettingsPage() {
  const user = await getCurrentUser();
  const t = await getTranslations("page.settings.appearance");
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* @ts-expect-error Server Component */}
      <AppearanceForm user={user} />
    </div>
  );
}
