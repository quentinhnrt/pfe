"use client";

import { User } from "@prisma/client";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface ArtistSuggestionCardProps {
  artist: User;
  index?: number;
}

export default function ArtistSuggestionCard({
  artist,
  index = 0,
}: ArtistSuggestionCardProps) {
  const c = useTranslations("commons");

  return (
    <Link
      href={`/user/${artist.id}`}
      className="group flex items-center justify-between p-4 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm transition-all duration-300"
      style={{
        animationDelay: `${index * 50}ms`,
        animationName: "fadeInUp",
        animationDuration: "0.5s",
        animationFillMode: "both",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {artist.image ? (
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800">
              <Image
                src={artist.image}
                alt={artist.firstname ?? "Artist"}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300 text-base font-bold rounded-full border border-gray-100 dark:border-gray-800">
              {artist.firstname?.charAt(0) || "?"}
            </div>
          )}
        </div>

        {/* Name and username */}
        <div className="flex-1 min-w-0 text-left">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {`${artist.firstname ?? ""} ${artist.lastname ?? ""}`.trim() ||
              "Artist"}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {artist.name ? `@${artist.name}` : c("artist")}
          </p>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight
        size={16}
        className="text-gray-400 group-hover:text-gray-600 transition-all duration-300 transform group-hover:translate-x-0.5"
      />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Link>
  );
}
