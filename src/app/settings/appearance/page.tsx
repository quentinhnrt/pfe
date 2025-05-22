import { redirect } from "next/navigation";

import { AppearanceForm } from "@/features/settings/appearance-form";
import { getCurrentUser } from "@/lib/users";

export const metadata = {
  title: "Appearance Settings",
  description: "Manage the appearance of the application",
};

export default async function AppearanceSettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Appearance</h1>
        <p className="text-muted-foreground">
          Customize how ArtiLink looks on your device
        </p>
      </div>
      <AppearanceForm user={user} />
    </div>
  );
}
