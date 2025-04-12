import ArtworkFormDialog from "@/shared/components/dialogs/ArtworkFormDialog";
import prisma from "@/shared/lib/prisma";
import {auth} from "@/shared/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {Artwork} from "@prisma/client";
import Image from "next/image";
import {Pen} from "lucide-react";

export default async function Forms() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        redirect("/");
    }

    const artworks = await prisma.artwork.findMany({
        where: {
            userId: session.user.id
        },
        orderBy: [
            {updatedAt: "desc"}
        ]
    })

    function ArtworkDialog() {

        return (
            <ArtworkFormDialog />
        )
    }

    return (
        <div className={"w-[1200px] mx-auto space-y-8 mt-12"}>
            <div>
                <ArtworkDialog />
            </div>

            <div className={"grid grid-cols-3 gap-8"}>
                {artworks.length && artworks.map((artwork: Artwork) => (
                    <div key={artwork.id} className={"relative"}>
                        <Image src={artwork.thumbnail} alt={artwork.title} width={300} height={300} className={"aspect-square w-full object-cover"} />
                        <div className={"absolute bottom-4 right-4"}>
                            <ArtworkFormDialog artwork={artwork}>
                                <div className={"bg-white rounded-full w-12 h-12 p-2 flex items-center justify-center cursor-pointer"}>
                                    <Pen />
                                </div>
                            </ArtworkFormDialog>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}