import {Artwork} from "@prisma/client";
import Image from "next/image";

type Props = {
    artworks: Artwork[]
}
export default function PostArtworks({artworks}: Props) {
    if (!artworks || artworks.length === 0) {
        return null
    }

    return (
        <div className={"grid grid-cols-3"}>
            {artworks.map(artwork => (
                <Image src={artwork.thumbnail} alt={artwork.title} width={100} height={100}
                     key={"artwork-" + artwork.id}/>
            ))}
        </div>
    )
}