'use client'
import {useEffect, useRef, useState} from "react";
import {Palette, Plus, SquarePen} from "lucide-react";
import {Button} from "@/components/ui/button";
import ArtworkFormDialog from "@/shared/components/dialogs/ArtworkFormDialog";
import {authClient} from "@/shared/lib/auth-client";
import PostForm from "@/shared/components/forms/PostForm";

export default function ActionButton() {
    const [open, setOpen] = useState(false)
    const actionRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleClick = (evt: MouseEvent) => {
            if (actionRef.current && evt.target instanceof Node && actionRef.current.contains(evt.target)) {
                return;
            }

            setOpen(false);
        };

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);

    const { data: session } = authClient.useSession()

    // @ts-expect-error Il y a un override de la session pour retourner l'utilisateur entier
    if (!session || !session.user || session.user.role !== "ARTIST") {
        return;
    }

    return (
        <div ref={actionRef} className={"fixed bottom-12 right-12"}>
            <Button onClick={() => setOpen(!open)} variant={"outline"} className={"h-12 bg-white aspect-square rounded-full flex items-center justify-center cursor-pointer border-black/50"}>
                <Plus className={"w-5 text-black duration-500 " + (open ? 'rotate-45' : '')} />
            </Button>

            <div className={"absolute -top-4 right-0 -translate-y-full w-fit flex flex-col items-end gap-4" + (open ? ' block' : ' hidden')}>
                <ArtworkFormDialog>
                    <div className={"flex items-center gap-4 size-max cursor-pointer"}>
                        <p>Créer une oeuvre</p>

                        <Button variant={"outline"} className={"h-12 bg-white aspect-square rounded-full flex items-center justify-center cursor-pointer border-black/50"}>
                            <Palette />
                        </Button>
                    </div>
                </ArtworkFormDialog>
                <PostForm>
                    <div className={"flex items-center gap-4 size-max cursor-pointer"}>
                        <p>Créer un post</p>

                        <Button variant={"outline"}
                                className={"h-12 bg-white aspect-square rounded-full flex items-center justify-center cursor-pointer border-black/50"}>
                            <SquarePen />
                        </Button>
                    </div>
                </PostForm>
            </div>
        </div>
    )
}