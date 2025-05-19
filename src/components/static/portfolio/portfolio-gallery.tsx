"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface Artwork {
  id: string;
  title: string;
  image: string;
  medium: string;
  dimensions?: string;
  year: string;
}

interface PortfolioGalleryProps {
  artworks: Artwork[];
}

export function PortfolioGallery({ artworks }: PortfolioGalleryProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <Card
            key={artwork.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedArtwork(artwork)}
          >
            <CardContent className="p-0">
              <img
                src={artwork.image || "/placeholder.svg"}
                alt={artwork.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{artwork.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {artwork.medium}, {artwork.year}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!selectedArtwork}
        onOpenChange={(open) => !open && setSelectedArtwork(null)}
      >
        {selectedArtwork && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedArtwork.title}</DialogTitle>
              <DialogDescription>
                {selectedArtwork.medium}, {selectedArtwork.year}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <img
                src={selectedArtwork.image || "/placeholder.svg"}
                alt={selectedArtwork.title}
                className="w-full h-auto rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedArtwork.dimensions && (
                  <div>
                    <p className="font-semibold">Dimensions</p>
                    <p>{selectedArtwork.dimensions}</p>
                  </div>
                )}
                <div>
                  <p className="font-semibold">Year</p>
                  <p>{selectedArtwork.year}</p>
                </div>
                <div>
                  <p className="font-semibold">Medium</p>
                  <p>{selectedArtwork.medium}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
