import {Artwork} from "@prisma/client";
import Image from "next/image";
import {Card, CardContent} from "@/components/ui/shadcn/card";
import {Badge} from "@/components/ui/shadcn/badge";

type Props = {
    artwork: Artwork;
    onClick?: (artwork: Artwork) => void;
}

export default function ArtworkCard({artwork, onClick}: Props) {

    return (
        <Card className={"relative aspect-video cursor-pointer group"} key={artwork.id} onClick={() => onClick && onClick(artwork)}>
            <Image
                src={artwork.thumbnail}
                alt={artwork.title}
                fill
                className="rounded-lg object-cover z-0"
            />

            <div className={"absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"}>
                <CardContent className="text-white text-center">
                    <h3 className="text-lg font-semibold">{artwork.title}</h3>
                </CardContent>
            </div>

            {artwork.isForSale && (
                <Badge className={"absolute bottom-2 right-2 "}>
                    {artwork.price} €
                </Badge>
            )}
        </Card>
    )
}