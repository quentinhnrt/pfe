import { Button } from "@/components/ui/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import ArtworkForm from "@/features/artwork/components/artwork-form";
import { authClient } from "@/lib/auth-client";
import { Artwork } from "@prisma/client";
import { useTranslations } from "next-intl";
import Image from "next/image";

type Props = {
  artwork: Artwork | null;
  isDialogOpen: boolean;
  handleCloseDialog: () => void;
  handleArtworkEdited: (data: Artwork) => void;
  handleDeleteArtwork: (artworkId: number) => void;
};

export default function ArtworkDialog({
  artwork,
  isDialogOpen,
  handleCloseDialog,
  handleArtworkEdited,
  handleDeleteArtwork,
}: Props) {
  const { data: session } = authClient.useSession();
  const c = useTranslations("commons");
  const a = useTranslations("feature.artwork");

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => !open && handleCloseDialog()}
    >
      <DialogContent className="max-w-2xl w-full p-6 rounded-2xl shadow-lg space-y-4">
        {artwork && (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                {artwork.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                {c("created-on")}{" "}
                {new Date(artwork.createdAt).toLocaleDateString("en-US")}
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
                <span className="font-semibold">
                  {a("labels.description")}:
                </span>{" "}
                {artwork.description}
              </p>

              <p>
                <span className="font-semibold">
                  {a("labels.is-for-sale")}:
                </span>{" "}
                {artwork.isForSale ? c("yes") : c("no")}
              </p>

              {artwork.isForSale && (
                <p>
                  <span className="font-semibold">{a("labels.price")}:</span>{" "}
                  {artwork.price} €
                </p>
              )}

              <p>
                <span className="font-semibold">{a("labels.sold")}:</span>{" "}
                {artwork.sold ? c("yes") : c("no")}
              </p>
            </div>

            {session?.user && artwork.userId === session.user.id && (
              <div className={"flex items-center gap-4"}>
                <ArtworkForm artwork={artwork} onSuccess={handleArtworkEdited}>
                  <Button variant={"default"} className={"cursor-pointer"}>
                    {c("forms.modify")}
                  </Button>
                </ArtworkForm>

                <Button
                  onClick={() => handleDeleteArtwork(artwork.id)}
                  variant={"destructive"}
                  className={"cursor-pointer"}
                >
                  {c("delete")}
                </Button>
              </div>
            )}

            <DialogClose asChild>
              <Button className="w-full">{c("close")}</Button>
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
