import {UserFromApi} from "@/lib/users";
import {z} from "zod";
import {templateSchema} from "@/features/templates/bento-template/settings";
import {getCollectionsFromFieldValue} from "@/lib/collections";
import BentoCollectionGrid from "@/features/templates/bento-template/components/BentoCollectionGrid";
import Image from "next/image";

export default async function Render({data, user}: { user: UserFromApi, data: z.infer<typeof templateSchema> }) {

    if (!data.collections) {
        return;
    }

    const collections = await getCollectionsFromFieldValue(data.collections, user.id)

    return (
        <div className={"w-full mx-auto p-4"}>
            <div className={"flex w-full h-screen items-center"}>
                <div className={"w-2/3 flex flex-col justify-center items-start space-y-12 h-full"}>
                    <h1 className={"text-9xl font-bold"}>{user.firstname} {user.lastname}</h1>
                    <p className={"text-3xl"}>{data.description}</p>
                </div>
                <div className={"w-1/3 h-full"}>
                    <Image src={user.image ?? ""} alt={user.firstname + " " + user.lastname} width={400} height={400} className={"rounded-full w-full h-auto object-cover aspect-square"}/>
                </div>
            </div>
            <div className={"space-y-32 "}>
                {collections.map((collection) => (
                    <div key={'collection-' + collection.id} className="min-h-screen">
                        <BentoCollectionGrid collection={collection}/>
                    </div>
                ))}
            </div>

        </div>
    )
}