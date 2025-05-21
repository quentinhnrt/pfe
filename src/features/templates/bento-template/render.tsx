import {UserFromApi} from "@/lib/users";
import {z} from "zod";
import {templateSchema} from "@/features/templates/bento-template/settings";
import {getCollectionsFromFieldValue} from "@/lib/collections";
import BentoCollectionGrid from "@/features/templates/bento-template/components/BentoCollectionGrid";

export default async function Render({data, user}: { user: UserFromApi, data: z.infer<typeof templateSchema> }) {

    if (!data.collections) {
        return;
    }

    const collections = await getCollectionsFromFieldValue(data.collections, user.id)

    return (
        <div className={"max-w-7xl mx-auto p-4"}>
            <div className={"space-y-8"}>
                {collections.map((collection) => (
                    <BentoCollectionGrid collection={collection} key={'collection-' + collection.id}/>
                ))}
            </div>

        </div>
    )
}