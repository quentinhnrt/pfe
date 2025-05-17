import { Calendar, Globe, MapPin } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  profile: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    coverImage: string;
    bio: string;
    specialty: string;
    location: string;
    website?: string;
    followers: number;
    following: number;
    joined: string;
  };
  isOwnProfile?: boolean;
}

export function ProfileHeader({
  profile,
  isOwnProfile = true,
}: ProfileHeaderProps) {
  return (
    <div className="mb-8">
      <div className="relative">
        <div className="h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={profile.coverImage || "/placeholder.svg"}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-6 transform translate-y-1/2">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage
              src={profile.avatar || "/placeholder.svg"}
              alt={profile.name}
            />
            <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="absolute bottom-4 right-6">
          {isOwnProfile ? (
            <Button>Edit Profile</Button>
          ) : (
            <Button>Follow</Button>
          )}
        </div>
      </div>

      <div className="mt-16 px-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-muted-foreground">@{profile.username}</p>
        </div>

        <p className="mb-4">{profile.bio}</p>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <MapPin className="mr-1 h-4 w-4" />
            {profile.location}
          </div>
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
          <Link href="#" className="hover:underline">
            <span className="font-semibold">{profile.following}</span> following
          </Link>
          <Link href="#" className="hover:underline">
            <span className="font-semibold">{profile.followers}</span> followers
          </Link>
        </div>
      </div>
    </div>
  );
}
