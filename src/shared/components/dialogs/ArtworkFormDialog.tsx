import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import ArtworkForm from "@/shared/components/forms/artwork-form";
import {Button} from "@/components/ui/button";

type Props = {
    onSuccess: (data: object) => void,
    onFailure: (data: object) => void
}

export default function ArtworkFormDialog({onSuccess, onFailure}: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild><Button>Créer une oeuvre</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Créer une nouvelle oeuvre
                    </DialogTitle>
                </DialogHeader>
                <ArtworkForm onSuccess={onSuccess} onFailure={onFailure} />
            </DialogContent>
        </Dialog>
    )
}