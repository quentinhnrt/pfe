import {HexPalette} from "@/lib/images";
import {Artwork} from "@prisma/client";
import Image from "next/image";

export default async function BentoArtworkCard({artwork, className}: {
    artwork: Artwork,
    colorPalette: HexPalette,
    className?: string
}) {
    return (
        <div className={className + " overflow-hidden rounded-xl w-full h-full"}>
            <Image src={artwork.thumbnail} alt={artwork.title} width={800} height={800} className={"w-full h-full object-cover"} />
        </div>
    )
}
