import ArtworkFormDialog from '@/components/dialogs/ArtworkFormDialog'
import PostForm from '@/components/forms/PostForm'
import { auth } from '@/lib/auth'
// @ts-expect-error it works
import { Artwork } from '@prisma/client'
import { Pen } from 'lucide-react'
import { headers } from 'next/headers'
import Image from 'next/image'
import { redirect } from 'next/navigation'

export default async function Forms() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || !session.user) {
    redirect('/')
  }

  const artworks: Artwork[] = []

  function ArtworkDialog() {
    return <ArtworkFormDialog />
  }

  return (
    <div className={'mx-auto mt-12 w-[1200px] space-y-8'}>
      <div>
        <ArtworkDialog />
      </div>

      <div className={'grid w-1/2 grid-cols-3 gap-8'}>
        {artworks.length &&
          artworks.map((artwork: Artwork) => (
            <div key={artwork.id} className={'relative'}>
              <Image
                src={artwork.thumbnail}
                alt={artwork.title}
                width={300}
                height={300}
                className={'aspect-square w-full object-cover'}
              />
              <div className={'absolute right-4 bottom-4'}>
                <ArtworkFormDialog artwork={artwork}>
                  <div
                    className={
                      'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white p-2'
                    }
                  >
                    <Pen />
                  </div>
                </ArtworkFormDialog>
              </div>
            </div>
          ))}
      </div>

      <div>
        <PostForm />
      </div>
    </div>
  )
}
