import {templateSchema} from "@/features/templates/test-template/settings";
import {z} from "zod";
import {getCollectionsFromFieldValue} from "@/lib/collections";
import Image from "next/image";
import {UserFromApi} from "@/lib/users";

export default async function Render({
                                         user,
                                         data,
                                     }: {
    user: UserFromApi;
    data: z.infer<typeof templateSchema>;
}) {

    const collections = data.collections ? await getCollectionsFromFieldValue(data.collections, user.id) : [];

    return (
        <div>
            <h1>{user.firstname}</h1>
            <p>{JSON.stringify(data)}</p>
            <div>
                <h1>Collections :</h1>
                <ul>
                    {collections.map((collection) => (
                        <li key={collection.id}>
                            <h2 className={"font-bold text-4xl"}>{collection.title}</h2>
                            <p>{collection.description}</p>
                            {collection.artworks.length > 0 ? (
                                <ul className={"flex items-center gap-3 flex-wrap"}>
                                    {collection.artworks.map((artwork) => (
                                        <li key={artwork.id}>
                                            <Image src={artwork.thumbnail} alt={artwork.title} width={200} height={200}/>
                                            <h3 className={"font-bold text-2xl"}>{artwork.title}</h3>
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
