import { redirect } from "next/navigation";

import { AccountForm } from "@/features/settings/components/account-form";
import { getCurrentUser } from "@/lib/users";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Account Settings",
  description: "Manage your account settings and preferences",
};

export default async function AccountSettingsPage() {
  const user = await getCurrentUser();
  const t = await getTranslations("page.settings.account");
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <AccountForm user={user} />
    </div>
  );
}
