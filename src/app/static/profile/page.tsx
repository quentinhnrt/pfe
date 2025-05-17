import { Navigation } from "@/components/static/layout/navigation";
import { ProfileHeader } from "@/components/static/profile/profile-header";
import { ProfileTabs } from "@/components/static/profile/profile-tabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | ArtConnect",
  description: "Manage your ArtConnect profile",
};

export const mockProfile = {
  id: "1",
  name: "Sophie Martin",
  username: "sophieart",
  avatar: "/female-artist-portrait.png",
  coverImage: "/abstract-art-studio.png",
  bio: "Abstract painter based in Paris, France. Exploring the intersection of color and emotion.",
  specialty: "Abstract Painting",
  location: "Paris, France",
  website: "https://sophiemartin.art",
  followers: 1245,
  following: 328,
  joined: "January 2023",
};

export default function ProfilePage() {
  const profile = mockProfile;

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <div className="container py-6 flex-1">
        <ProfileHeader profile={profile} />
        <ProfileTabs profile={profile} />
      </div>
    </div>
  );
}
