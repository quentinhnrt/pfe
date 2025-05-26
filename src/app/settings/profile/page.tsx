import { redirect } from "next/navigation";

import { ProfileForm } from "@/features/settings/profile-form";
import { getCurrentUser } from "@/lib/users";

export const metadata = {
  title: "Profile Settings",
  description: "Manage your profile settings and information",
};

export default async function ProfileSettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile information and how others see you
        </p>
      </div>
      {/* @ts-expect-error Server Component */}
      <ProfileForm user={user} />
    </div>
  );
}
