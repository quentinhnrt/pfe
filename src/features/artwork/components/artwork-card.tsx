"use client";

import { Badge } from "@/components/ui/shadcn/badge";
import { Card } from "@/components/ui/shadcn/card";
import { Artwork, User } from "@prisma/client";
import { useTranslations } from "next-intl";
import Image from "next/image";

type ArtworkWithUser = Artwork & {
  user: User;
};

type Props = {
  artwork: ArtworkWithUser;
  onClick?: (artwork: ArtworkWithUser) => void;
  className?: string;
};

export default function ArtworkCard({
  artwork,
  onClick,
  className = "",
}: Props) {
  const c = useTranslations("commons");

  return (
    <Card
      className={`relative h-full cursor-pointer overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 hover-trigger ${className}`}
      onClick={() => onClick && onClick(artwork)}
    >
      {/* Image de l'œuvre */}
      <div className="absolute inset-0">
        {artwork.thumbnail && artwork.thumbnail.trim() !== "" ? (
          <Image
            src={artwork.thumbnail}
            alt={artwork.title}
            fill
            sizes="(max-width: 640px) 85vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
            className="object-cover z-0 transition-transform duration-500 hover-target-scale"
            priority={true}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800" />
        )}
      </div>

      {/* Overlay toujours visible en bas de la carte */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent h-1/3 z-10"></div>

      {/* Overlay au survol (pour informations supplémentaires) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 hover-target-fade transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
        <div className="flex items-end gap-3">
          {/* Avatar de l'artiste */}
          <div className="flex-shrink-0">
            {artwork.user?.image ? (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src={artwork.user.image}
                  alt={artwork.user.firstname || c("artist")}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-800 text-white text-sm font-medium rounded-full border-2 border-white">
                {artwork.user?.firstname?.charAt(0) || "?"}
              </div>
            )}
          </div>

          {/* Informations textuelles */}
          <div className="flex-1 overflow-hidden">
            <h3 className="font-bold text-white text-sm sm:text-base leading-tight truncate">
              {artwork.title}
            </h3>
            <p className="text-xs text-gray-300 truncate">
              {`${artwork.user?.firstname || ""} ${artwork.user?.lastname || ""}`.trim() ||
                c("artist")}
            </p>
          </div>
        </div>
      </div>

      {/* Badge de prix (toujours visible) */}
      {artwork.isForSale && (
        <Badge className="absolute top-2 right-2 bg-white text-black dark:bg-black dark:text-white font-semibold text-xs z-20">
          {artwork.price} €
        </Badge>
      )}

      <style jsx>{`
        /* Styles pour le survol individuel */
        :global(.hover-trigger:hover .hover-target-fade) {
          opacity: 1;
        }

        :global(.hover-trigger:hover .hover-target-scale) {
          transform: scale(1.05);
        }

        /* Aspect ratio maintenu pour tous les écrans */
        :global(.hover-trigger) {
          aspect-ratio: 4/3;
        }

        /* Media queries pour les petits écrans */
        @media (max-width: 640px) {
          :global(.hover-trigger:hover .hover-target-fade) {
            opacity: 1;
          }
        }
      `}</style>
    </Card>
  );
}
