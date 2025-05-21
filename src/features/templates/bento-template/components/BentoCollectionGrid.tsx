import {getPaletteFromCollection} from "@/lib/images";
import {CollectionFromAPI} from "@/lib/collections";
import FirstBento from "@/features/templates/bento-template/components/bentos/FirstBento";

export default async function BentoCollectionGrid({collection}: {collection: CollectionFromAPI}) {
    const colorPalette = await getPaletteFromCollection(collection)

    return (
        <div className={"w-full rounded-xl top-4 h-fit"}>
            <FirstBento collection={collection} colorPalette={colorPalette}/>
        </div>
    )
}