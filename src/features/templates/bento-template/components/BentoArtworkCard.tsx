import {getImageFormat, getTextColor, HexPalette} from "@/lib/images";
import {Artwork} from "@prisma/client";
import Image from "next/image";

export default async function BentoArtworkCard({artwork, colorPalette}: {
    artwork: Artwork,
    colorPalette: HexPalette
}) {
    const format = await getImageFormat(artwork.thumbnail, 0.2);
    const bentoRatio = format === "portrait" ? "2x2" : format === "landscape" ? "2x1" : "1x1";

    const randomColor = Object.values(colorPalette)[Math.floor(Math.random() * Object.values(colorPalette).length)];
    const textColor = getTextColor(randomColor);

    return (
        <div data-bento={bentoRatio} className={"rounded-xl overflow-hidden h-fit "} style={{backgroundColor: randomColor, color: textColor}}>
            <Image
                src={artwork.thumbnail}
                alt={artwork.title}
                width={800}
                height={800}
                className="object-cover transition-transform duration-500 group-hover:scale-105 w-full h-auto"
                priority
            />
            <div className={"p-4"}>
                <p className={"text-xl font-bold"}>{artwork.title}</p>
            </div>
        </div>
    );
}
