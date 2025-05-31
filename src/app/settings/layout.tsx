import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SettingsNav } from "@/features/settings/components/settings-nav";
import { getCurrentUser } from "@/lib/users";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences",
};

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
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
