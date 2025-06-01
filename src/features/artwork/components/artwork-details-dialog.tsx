"use client";

import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { Artwork, User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { CalendarIcon, HeartIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

type ArtworkWithUser = Artwork & {
  user: User;
};

interface ArtworkDetailsDialogProps {
  artwork: ArtworkWithUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ArtworkDetailsDialog({
  artwork,
  open,
  onOpenChange,
}: ArtworkDetailsDialogProps) {
  const c = useTranslations("commons");
  const a = useTranslations("feature.artwork");

  if (!artwork) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0 gap-0 overflow-y-scroll max-h-[95vh] md:max-h-[85vh] border-0 sm:border">
        {/* Croix de fermeture personnalisée et plus visible */}
        <DialogClose className="absolute right-2 top-2 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-md hover:bg-white dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200">
          <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="grid grid-cols-1 md:grid-cols-2 h-full max-h-full">
          {/* Image côté gauche */}
          <div className="relative aspect-square sm:aspect-[4/3] md:aspect-auto md:h-full bg-gray-100 dark:bg-gray-900">
            {artwork.thumbnail ? (
              <Image
                src={artwork.thumbnail}
                alt={artwork.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 95vw, 450px"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400">{c("artwork.no-image")}</span>
              </div>
            )}
          </div>

          {/* Détails côté droit */}
          <div className="p-5 sm:p-6 flex flex-col h-full overflow-y-auto">
            <DialogHeader className="mb-4">
              <div className="flex justify-between items-start">
                <DialogTitle className="text-xl sm:text-2xl font-bold">
                  {artwork.title}
                </DialogTitle>
                {artwork.isForSale && (
                  <Badge className="bg-white text-black dark:bg-black dark:text-white text-sm sm:text-base font-bold py-1 px-2 sm:px-3 rounded-full shrink-0 ml-2">
                    {artwork.price} €
                  </Badge>
                )}
              </div>
              <div className="flex items-center mt-2 text-gray-500 space-x-3">
                <CalendarIcon className="h-4 w-4 shrink-0" />
                <DialogDescription>
                  {formatDistanceToNow(new Date(artwork.createdAt), {
                    addSuffix: true,
                    locale: enUS,
                  })}
                </DialogDescription>
              </div>
            </DialogHeader>

            {/* Section Artiste */}
            <div className="mt-2 mb-4 sm:mb-6">
              <Link
                href={`/user/${artwork.user.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="relative h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0">
                  {artwork.user.image ? (
                    <Image
                      src={artwork.user.image}
                      alt={artwork.user.firstname || c("artist")}
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg sm:text-xl font-bold">
                      {artwork.user.firstname?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-sm sm:text-base">
                    {`${artwork.user.firstname || ""} ${
                      artwork.user.lastname || ""
                    }`.trim() || c("artist")}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {artwork.user.name ? `@${artwork.user.name}` : c("artist")}
                  </p>
                </div>
              </Link>
            </div>

            {/* Description - Utilise flex-1 pour qu'il prenne l'espace disponible mais pas plus */}
            {artwork.description && (
              <div className="flex-1 min-h-0 mb-4 sm:mb-6 overflow-y-auto">
                <h3 className="font-medium mb-2 text-base">
                  {a("labels.description")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line text-sm">
                  {artwork.description}
                </p>
              </div>
            )}

            {/* Statut de vente - en bas fixe */}
            <div className="mt-auto pt-2">
              {artwork.isForSale ? (
                artwork.sold ? (
                  <Badge variant="secondary" className="mb-3">
                    {c("artwork.sold")}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mb-3">
                    {c("artwork.for-sale")}
                  </Badge>
                )
              ) : null}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="flex-1 h-11 text-sm sm:text-base font-medium"
                  asChild
                >
                  <Link href={`/user/${artwork.user.id}`}>
                    {c("buttons.view-artist")}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 flex items-center justify-center"
                >
                  <HeartIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
