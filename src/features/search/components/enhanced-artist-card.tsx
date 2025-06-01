"use client";

import { Button } from "@/components/ui/shadcn/button";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface EnhancedArtistCardProps {
  artist: User;
  index?: number;
}

export default function EnhancedArtistCard({
  artist,
  index = 0,
}: EnhancedArtistCardProps) {
  const c = useTranslations("commons");
  const router = useRouter();

  const handleViewProfile = () => {
    router.push(`/user/${artist.id}`);
  };

  return (
    <div
      className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
      style={{
        animationDelay: `${index * 50}ms`,
        animationName: "fadeInUp",
        animationDuration: "0.5s",
        animationFillMode: "both",
      }}
    >
      {/* Bannière */}
      <div className="h-28 md:h-36 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        {artist.bannerImage ? (
          <Image
            src={artist.bannerImage}
            alt={`${artist.firstname || "Artist's banner"}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700"></div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start">
          {/* Avatar */}
          <div className="relative -mt-14 mr-3">
            {artist.image ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-950 bg-white dark:bg-gray-950 shadow-md">
                <Image
                  src={artist.image}
                  alt={artist.firstname ?? "Artist"}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xl font-bold rounded-full border-4 border-white dark:border-gray-950 shadow-md">
                {artist.firstname?.charAt(0) || "?"}
              </div>
            )}
          </div>
        </div>

        {/* Info artiste */}
        <div className="mt-4 flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {`${artist.firstname ?? ""} ${artist.lastname ?? ""}`.trim() ||
              "Artist"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {artist.name ? `@${artist.name}` : c("artist")}
          </p>

          {/* Bio courte si disponible */}
          {artist.bio && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {artist.bio}
            </p>
          )}
        </div>

        {/* Bouton - Toujours en bas */}
        <div className="mt-4">
          <Button onClick={handleViewProfile} className="w-full rounded-lg">
            Voir profil
          </Button>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
