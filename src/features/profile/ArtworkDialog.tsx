import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/shadcn/dialog";
import Image from "next/image";
import ArtworkForm from "@/features/forms/ArtworkForm";
import {Button} from "@/components/ui/shadcn/button";
import {Artwork} from "@prisma/client";
import {authClient} from "@/lib/auth-client";

type Props = {
    artwork: Artwork | null;
    isDialogOpen: boolean;
    handleCloseDialog: () => void;
    handleArtworkEdited: (data: Artwork) => void;
    handleDeleteArtwork: (artworkId: number) => void;
}

export default function ArtworkDialog({
                                          artwork,
                                          isDialogOpen,
                                          handleCloseDialog,
                                          handleArtworkEdited,
                                          handleDeleteArtwork
                                      }: Props) {
    const {data: session} = authClient.useSession()

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
            <DialogContent className="max-w-2xl w-full p-6 rounded-2xl shadow-lg space-y-4">
                {artwork && (
                    <div className="space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold">
                                {artwork.title}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-500">
                                Created on {new Date(artwork.createdAt).toLocaleDateString()}
                            </DialogDescription>
                        </DialogHeader>

                        <Image
                            src={artwork.thumbnail}
                            alt={artwork.title}
                            width={800}
                            height={500}
                            className="rounded-lg object-cover h-96 w-auto"
                        />

                        <div className="space-y-2 text-sm ">
                            <p>
                                <span className="font-semibold">Description:</span>{" "}
                                {artwork.description}
                            </p>

                            <p>
                                <span className="font-semibold">For Sale:</span>{" "}
                                {artwork.isForSale ? "Yes" : "No"}
                            </p>

                            {artwork.isForSale && (
                                <p>
                                    <span className="font-semibold">Price:</span>{" "}
                                    {artwork.price} €
                                </p>
                            )}

                            <p>
                                <span className="font-semibold">Sold:</span>{" "}
                                {artwork.sold ? "Yes" : "No"}
                            </p>
                        </div>

                        {session?.user && artwork.userId === session.user.id && (
                            <div className={"flex items-center gap-4"}>
                                <ArtworkForm artwork={artwork} onSuccess={handleArtworkEdited}>
                                    <Button variant={"default"} className={"cursor-pointer"}
                                    >
                                        Edit
                                    </Button>
                                </ArtworkForm>


                                <Button
                                    onClick={() => handleDeleteArtwork(artwork.id)}
                                    variant={"destructive"}
                                    className={"cursor-pointer"}
                                >
                                    Delete
                                </Button>
                            </div>
                        )}

                        <DialogClose asChild>
                            <Button className="w-full">Close</Button>
                        </DialogClose>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}