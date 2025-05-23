import {CollectionFromAPI} from "@/lib/collections";
import {getTextColor, HexPalette} from "@/lib/images";
import BentoArtworkCard from "@/features/templates/bento-template/components/BentoArtworkCard";
import styles from './styles.module.css';
import {Artwork} from "@prisma/client";

export default function FirstBento({collection, colorPalette}: { collection: CollectionFromAPI, colorPalette: HexPalette }) {
    const handledElements : number = 10;
    const elementsNumber = 2 + collection.artworks.length;
    const elementsRemaining = handledElements - elementsNumber;

    function BentoItem({artwork, index}: {artwork: Artwork, index: number, key: string}) {
        const realIndex = index + 1;
        return <BentoArtworkCard artwork={artwork} colorPalette={colorPalette} className={styles['__'+realIndex] ?? ""} />
    }

    function BentoFiller({index}: {index: number, key: string}) {
        const realIndex = index + 1;
        return <div className={( styles['__'+realIndex] ?? "" ) + " rounded-xl"} style={{backgroundColor: colorPalette.Muted}}/>
    }

    function BentoChooseElement() {
        // loop for 8 elements and choose randomly between the artworks and fillers
        let artworkLastIndex = 0;
        let placedFiller = 0;
        const elements = [];

        for (let i = 0; i < 8; i++) {
            if (placedFiller === elementsRemaining) {
                elements.push(<BentoItem artwork={collection.artworks[artworkLastIndex]} index={i} key={"collection-"+collection.id+"-artwork-"+collection.artworks[artworkLastIndex].id} />)
                artworkLastIndex++
                continue;
            }

            const random = Math.random()

            if (random < 0.5 && artworkLastIndex < collection.artworks.length) {
                elements.push(<BentoItem artwork={collection.artworks[artworkLastIndex]} index={i} key={"collection-"+collection.id+"-artwork-"+collection.artworks[artworkLastIndex].id}/>)
                artworkLastIndex++
                continue;
            } else {
                elements.push(<BentoFiller index={i} key={"collection-"+collection.id+"-filler-"+i} />)
                placedFiller++
                continue;
            }
        }

        return elements
    }

    const textColor = getTextColor(colorPalette.Vibrant ?? "#000000");

    return (
        <div className={styles.bento1}>
            <div style={{
                backgroundColor: colorPalette.Vibrant,
                color: textColor,
            }} className={styles.__0 + " overflow-hidden rounded-xl font-bold uppercase text-8xl p-8 min-h-[200px] h-full"}>
                {collection.title}
            </div>

            {BentoChooseElement()}

            <div className={styles.__9 + " overflow-hidden rounded-xl min-h-[200px] bg-gray-200 p-8"} style={{backgroundColor: colorPalette.LightMuted ?? "#cdcdcd"}}>
                <p className={"mt-auto text-4xl"}>{collection.description}</p>
            </div>

        </div>
    )

}