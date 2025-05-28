import { redirect } from "next/navigation";

import { AccountForm } from "@/features/settings/components/account-form";
import { getCurrentUser } from "@/lib/users";

export const metadata = {
  title: "Account Settings",
  description: "Manage your account settings and preferences",
};

export default async function AccountSettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      <AccountForm user={user} />
    </div>
  );
}
