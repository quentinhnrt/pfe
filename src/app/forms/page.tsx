'use client'
import ArtworkFormDialog from "@/shared/components/dialogs/ArtworkFormDialog";

export default function Forms() {
    return (
        <div className={"w-[1200px] mx-auto space-y-8 mt-12"}>
            <div>
                <ArtworkFormDialog onFailure={() => alert('Artwork creation failed')} onSuccess={() => alert('Artwork creation succeeded')} />
            </div>

        </div>
    )
}