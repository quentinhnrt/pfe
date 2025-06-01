import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SettingsNav } from "@/features/settings/components/settings-nav";
import { siteConfig } from "@/lib/seo/metadata";
import { getCurrentUser } from "@/lib/users";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Settings",
    description: "Manage your account settings and preferences",
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: "Settings - ArtiLink",
      description: "Manage your account settings and preferences",
      type: "website",
      locale: "en_US",
      url: `${siteConfig.url}/settings`,
      siteName: siteConfig.name,
    },
    alternates: {
      canonical: `${siteConfig.url}/settings`,
    },
  };
}

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <SettingsNav />
        </aside>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
