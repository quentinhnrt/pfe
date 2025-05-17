"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

interface Artwork {
  id: string;
  title: string;
  image: string;
  medium: string;
  dimensions?: string;
  year: string;
  price?: number;
  currency?: string;
  forSale: boolean;
}

export function ArtworksForSale() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const artworksForSale: Artwork[] = [
    {
      id: "1",
      title: "Blue Abstraction",
      image: "/abstract-blue-painting.png",
      medium: "Acrylic on canvas",
      dimensions: "80 x 100 cm",
      year: "2023",
      price: 1200,
      currency: "USD",
      forSale: true,
    },
    {
      id: "2",
      title: "Composition #12",
      image: "/abstract-geometric-painting.png",
      medium: "Oil on canvas",
      dimensions: "60 x 80 cm",
      year: "2023",
      price: 950,
      currency: "USD",
      forSale: true,
    },
    {
      id: "3",
      title: "Fragments",
      image: "/mixed-media-abstract.png",
      medium: "Mixed media",
      dimensions: "100 x 120 cm",
      year: "2022",
      price: 1500,
      currency: "USD",
      forSale: true,
    },
    {
      id: "4",
      title: "Reflections",
      image: "/reflective-abstract.png",
      medium: "Acrylic on canvas",
      dimensions: "90 x 90 cm",
      year: "2022",
      price: 1100,
      currency: "USD",
      forSale: true,
    },
  ];

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Œuvres à vendre</h2>
        <p className="text-muted-foreground">
          Découvrez les œuvres disponibles à l&apos;achat
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworksForSale.map((artwork) => (
          <Card key={artwork.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={artwork.image || "/placeholder.svg"}
                  alt={artwork.title}
                  className="w-full h-64 object-cover"
                />
                <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                  {formatPrice(artwork.price!, artwork.currency!)}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{artwork.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {artwork.medium}, {artwork.year}
                </p>
                {artwork.dimensions && (
                  <p className="text-sm text-muted-foreground">
                    {artwork.dimensions}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0">
              <Button
                variant="outline"
                className="w-full mr-2"
                onClick={() => setSelectedArtwork(artwork)}
              >
                Détails
              </Button>
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Acheter
              </Button>
            </CardFooter>
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
              <div className="relative">
                <img
                  src={selectedArtwork.image || "/placeholder.svg"}
                  alt={selectedArtwork.title}
                  className="w-full h-auto rounded-lg"
                />
                <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                  {formatPrice(
                    selectedArtwork.price!,
                    selectedArtwork.currency!
                  )}
                </Badge>
              </div>
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
                <div>
                  <p className="font-semibold">Price</p>
                  <p>
                    {formatPrice(
                      selectedArtwork.price!,
                      selectedArtwork.currency!
                    )}
                  </p>
                </div>
              </div>
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Acheter cette œuvre
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
