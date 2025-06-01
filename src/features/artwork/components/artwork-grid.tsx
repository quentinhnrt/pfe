"use client";

import { Artwork, User } from "@prisma/client";
import { useState } from "react";
import ArtworkCard from "./artwork-card";
import ArtworkDetailsDialog from "./artwork-details-dialog";

type ArtworkWithUser = Artwork & {
  user: User;
};

interface ArtworkGridProps {
  artworks: ArtworkWithUser[];
  columns?: number;
  gap?: number;
  className?: string;
}

export default function ArtworkGrid({
  artworks,
  columns = 3,
  gap = 16,
  className = "",
}: ArtworkGridProps) {
  const [selectedArtwork, setSelectedArtwork] =
    useState<ArtworkWithUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Déterminer le nombre de colonnes en fonction de la taille de l'écran
  const getResponsiveColumns = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) return 1;
      if (width < 768) return 2;
      if (width < 1024) return Math.min(3, columns);
      return columns;
    }
    return columns;
  };

  const handleArtworkClick = (artwork: ArtworkWithUser) => {
    setSelectedArtwork(artwork);
    setDialogOpen(true);
  };

  // Organiser les œuvres en colonnes (style masonry)
  const columnGroups: ArtworkWithUser[][] = Array.from(
    { length: getResponsiveColumns() },
    () => []
  );

  artworks.forEach((artwork, index) => {
    const columnIndex = index % columnGroups.length;
    columnGroups[columnIndex].push(artwork);
  });

  return (
    <div className={`w-full ${className}`}>
      <div className="flex gap-4" style={{ gap: `${gap}px` }}>
        {columnGroups.map((column, columnIndex) => (
          <div
            key={`column-${columnIndex}`}
            className="flex-1 flex flex-col gap-4"
            style={{ gap: `${gap}px` }}
          >
            {column.map((artwork, index) => (
              <div
                key={artwork.id}
                style={{
                  animationDelay: `${(index + columnIndex) * 50}ms`,
                  animationName: "fadeInUp",
                  animationDuration: "0.5s",
                  animationFillMode: "both",
                }}
              >
                <ArtworkCard artwork={artwork} onClick={handleArtworkClick} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <ArtworkDetailsDialog
        artwork={selectedArtwork}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <style jsx>{`
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
