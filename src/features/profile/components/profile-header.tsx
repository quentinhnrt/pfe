import { Calendar, Globe, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import { Button } from "@/components/ui/shadcn/button";
import FollowButton from "@/features/social/components/follow-button";
import { UserFromApi } from "@/lib/users";
import { User } from "@prisma/client";

interface ProfileHeaderProps {
  profile: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    coverImage: string;
    bio: string;
    location: string;
    website?: string;
    followers: number;
    following: number;
    joined: string;
    isFollowing?: boolean;
  };
  isOwnProfile?: boolean;
  user: UserFromApi;
  currentUser?: User | null;
}

export const ProfileHeader = memo(function ProfileHeader({
  profile,
  isOwnProfile = false,
  user,
  currentUser,
}: ProfileHeaderProps) {
  return (
    <div className="mb-8">
      <div className="relative">
        <div className="h-[250px] w-full overflow-hidden rounded-sm aspect-[8/4] md:aspect-[10/4]">
          <Image
            src={profile.coverImage}
            alt="Cover"
            width={1000}
            height={400}
            priority
            className="h-full w-full object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute bottom-4 left-12 transform translate-y-1/2">
          <Avatar className="h-[150px] w-[150px] border-4 border-background">
            <AvatarImage
              src={profile.avatar}
              alt={profile.name}
              width={150}
              height={150}
            />
            <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="absolute bottom-2 right-4">
          {isOwnProfile ? (
            <Button asChild>
              <Link href={`/settings/profile`}>Edit Profile</Link>
            </Button>
          ) : (
            <FollowButton user={user} currentUser={currentUser || undefined} />
          )}
        </div>
      </div>

      <div className="mt-16 px-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-muted-foreground">@{profile.username}</p>
        </div>

        {profile.bio && <p className="mb-4">{profile.bio}</p>}

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          {profile.location && (
            <div className="flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              {profile.location}
            </div>
          )}
          {profile.website && (
            <div className="flex items-center">
              <Globe className="mr-1 h-4 w-4" />
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {profile.website.replace(/(^\w+:|^)\/\//, "")}
              </a>
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            Joined {profile.joined}
          </div>
        </div>

        <div className="flex gap-4 text-sm">
          <div>
            <span className="font-semibold">{profile.following}</span> following
          </div>
          <div>
            <span className="font-semibold">{profile.followers}</span> followers
          </div>
        </div>
      </div>
    </div>
  );
});
