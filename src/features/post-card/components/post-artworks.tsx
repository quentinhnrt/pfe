import { Artwork } from "@prisma/client";
import Image from "next/image";

type Props = {
  artworks: Artwork[];
};

export default function PostArtworks({ artworks }: Props) {
  if (!artworks || artworks.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full mx-auto">
      {artworks.slice(0, 4).map((artwork) => (
        <div
          key={`artwork-${artwork.id}`}
          className="aspect-square relative overflow-hidden rounded-lg shadow-md"
        >
          <Image
            src={artwork.thumbnail}
            alt={artwork.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
