import ArtworkForm from '@/components/forms/ArtworkForm'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
// @ts-expect-error it works
import { Artwork } from '@prisma/client'
import { ReactNode } from 'react'

type Props = {
  onSuccess?: (data: object) => void
  onFailure?: (data: object) => void
  children?: ReactNode
  artwork?: Artwork
}

export default function ArtworkFormDialog({
  onSuccess,
  onFailure,
  children,
  artwork,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button className={'hover:cursor-pointer'}>Créer une oeuvre</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle oeuvre</DialogTitle>
        </DialogHeader>
        <ArtworkForm
          onSuccess={onSuccess}
          onFailure={onFailure}
          artwork={artwork ?? null}
        />
      </DialogContent>
    </Dialog>
  )
}
