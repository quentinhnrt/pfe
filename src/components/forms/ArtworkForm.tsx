'use client'
import { ImageUploadField } from '@/components/fields/ImageUpload'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
// @ts-expect-error it works
import { Artwork } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type Props = {
  onSuccess?: (data: object) => void
  onFailure?: (data: object) => void
  artwork?: Artwork | null
}

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

function isImageCorrect(image: File) {
  const size = image.size <= MAX_FILE_SIZE
  const format = ACCEPTED_IMAGE_TYPES.includes(image.type)

  if (!size) {
    return {
      correct: false,
      message: 'Max image size is 5MB.',
    }
  }

  if (!format) {
    return {
      correct: false,
      message: 'Only .jpg, .jpeg, .png and .webp formats are supported.',
    }
  }

  return {
    correct: true,
    message: '',
  }
}

export default function ArtworkForm({ onSuccess, onFailure, artwork }: Props) {
  const formSchema = z
    .object({
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      isForSale: z.boolean(),
      price: z.string().optional(),
      image: z.any().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.isForSale && (data.price === undefined || data.price === null)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Le prix est requis lorsque l'œuvre est à vendre",
          path: ['price'],
        })
      }

      if (!artwork && !data.image) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "L'image est obligatoire",
          path: ['image'],
        })
      }

      if (!artwork && data.image) {
        const imageCorrect = isImageCorrect(data.image)

        if (!imageCorrect.correct) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: imageCorrect.message,
            path: ['image'],
          })
        }
      }
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: artwork?.title ?? '',
      description: artwork?.description ?? '',
      isForSale: artwork?.isForSale ?? false,
      image: null,
      price: artwork?.price?.toString() ?? undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()

    for (const key in values) {
      // @ts-expect-error it works
      const value = values[key]

      if (artwork && (value === null || value === undefined)) {
        continue
      }

      formData.append(key, value)
    }

    if (artwork) {
      formData.append('artworkId', artwork.id.toString())
    }

    const response = await fetch('/api/artwork', {
      method: artwork ? 'PUT' : 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      if (onFailure) {
        onFailure(data)
      }
      return
    }

    if (onSuccess) {
      onSuccess(data)
    }
  }

  const isForSale = form.watch('isForSale')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-8'}>
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormControl>
                <ImageUploadField
                  name={'image'}
                  label={'Image'}
                  existingImage={artwork?.thumbnail}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder={'Description'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isForSale"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Cette oeuvre est-elle à vendre ?</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isForSale && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix</FormLabel>
                <FormControl>
                  <Input type={'number'} placeholder={'Prix'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <DialogFooter className="pt-4">
          <DialogClose>Annuler</DialogClose>
          <Button type="submit">{artwork ? 'Modifier' : 'Créer'}</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
