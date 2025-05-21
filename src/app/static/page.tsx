import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your profile",
};

export default function ProfilePage() {
  return (
    <div>
      <h1>Static Page</h1>
    </div>
  );
}
