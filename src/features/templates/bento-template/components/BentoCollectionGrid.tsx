import {getPaletteFromCollection, getTextColor, pickBackgroundForTextCard} from "@/lib/images";
import {CollectionFromAPI} from "@/lib/collections";
import BentoArtworkCard from "@/features/templates/bento-template/components/BentoArtworkCard";
import {Artwork} from "@prisma/client";
import BentoGridContainer from "@/features/templates/bento-template/components/BentoGridContainer";

export default async function BentoCollectionGrid({collection}: {collection: CollectionFromAPI}) {
    const colorPalette = await getPaletteFromCollection(collection)
    const backgroundTitleColor = pickBackgroundForTextCard(colorPalette)
    const textTitleColor = getTextColor(backgroundTitleColor)
    const gridId = 'grid-' + collection.id

    return (
        <BentoGridContainer gridId={gridId}>
            <div data-bento="8x1" className={"w-full rounded-2xl p-8 h-full"} style={{backgroundColor: backgroundTitleColor, color: textTitleColor}}>
                <h2 className={"text-8xl font-bold mb-4"}>{collection.title}</h2>
                <p className={"text-xl"}>{collection.description}</p>
            </div>
            {collection.artworks.length && collection.artworks.map((artwork: Artwork) => (
                <BentoArtworkCard artwork={artwork} key={'artwork-'+artwork.id} colorPalette={colorPalette}/>
            ))}
            <div className={"bg-red-200 rounded-xl"}></div>
        </BentoGridContainer>
    )
}