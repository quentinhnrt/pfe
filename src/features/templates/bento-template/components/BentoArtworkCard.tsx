import {getImageFormat, getTextColor, HexPalette} from "@/lib/images";
import {Artwork} from "@prisma/client";
import Image from "next/image";

export default async function BentoArtworkCard({artwork, colorPalette, className}: {
    artwork: Artwork,
    colorPalette: HexPalette,
    className?: string
}) {
    const format = await getImageFormat(artwork.thumbnail, 0.2);

    const randomColor = Object.values(colorPalette)[Math.floor(Math.random() * Object.values(colorPalette).length)];
    const textColor = getTextColor(randomColor);

    return (
        <div className={className + " overflow-hidden rounded-xl w-full h-full"}>
            <Image src={artwork.thumbnail} alt={artwork.title} width={800} height={800} className={"w-full h-full object-cover"} />
        </div>
    )
}
