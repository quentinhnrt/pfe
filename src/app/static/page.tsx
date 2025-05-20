import type { Metadata } from "next";

// import { AnimatedLayout } from "@/components/layout/animated-layout";
// import { ProfileHeader } from "@/components/profile/profile-header";
// import { ProfileTabs } from "@/components/profile/profile-tabs";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your profile",
};

export default function ProfilePage() {
  // Mock data for the profile
  const profile = {
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

  return (
    // <AnimatedLayout>
    //   <ProfileHeader profile={profile} />
    //   <ProfileTabs profile={profile} />
    // </AnimatedLayout>
    <div>
      <h1>Static Page</h1>
    </div>
  );
}
