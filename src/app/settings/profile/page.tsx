import { redirect } from "next/navigation";

import { ProfileForm } from "@/features/settings/components/profile-form";
import { getCurrentUser } from "@/lib/users";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Profile Settings",
  description: "Manage your profile settings and information",
};

export default async function ProfileSettingsPage() {
  const user = await getCurrentUser();
  const t = await getTranslations("page.settings.profile");

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
      <ProfileForm user={user} />
    </div>
  );
}
