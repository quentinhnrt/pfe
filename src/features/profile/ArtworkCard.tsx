import {Artwork} from "@prisma/client";
import Image from "next/image";
import {Card} from "@/components/ui/shadcn/card";
import {Badge} from "@/components/ui/shadcn/badge";

type Props = {
    artwork: Artwork;
    onClick?: (artwork: Artwork) => void;
}

export default function ArtworkCard({artwork, onClick}: Props) {

    return (
        <Card className={"relative aspect-video cursor-pointer group overflow-hidden"} key={artwork.id}
              onClick={() => onClick && onClick(artwork)}>
            <Image
                src={artwork.thumbnail}
                alt={artwork.title}
                fill
                sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                className="rounded-lg object-cover z-0 group-hover:scale-105 duration-400"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
                <div className="p-4 text-center">
                    <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">
                        {artwork.title}
                    </h3>
                </div>
            </div>

            {artwork.isForSale && (
                <Badge className={"absolute bottom-2 right-2 "}>
                    {artwork.price} €
                </Badge>
            )}
        </Card>
    )
}