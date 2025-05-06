'use client'
import { ArtworkGallerySelector } from '@/components/fields/ArtworkGallerySelector'
import Repeater from '@/components/fields/Repeater'
import { TemplateContainer } from '@/components/template-container/TemplateContainer'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { z } from 'zod'

type ArtworkSection = {
  title: string
  subtitle: string
  artworks: number[]
}

export default function Settings() {
  const templateSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    artworkSections: z
      .object({
        title: z.string().optional(),
        subtitle: z.string().optional(),
        artworks: z.number().array(),
      })
      .array(),
  })

  async function onRequest(values: z.infer<typeof templateSchema>) {
    console.log(values)

    return values
  }

  return (
    <div>
      <h1>Template Exemple Settings</h1>
      <p>Settings for the Template Exemple component.</p>
      <TemplateContainer
        schema={templateSchema}
        onRequest={onRequest}
        templateId={1}
      >
        <FormField
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder={'Titre'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
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
          name="artworkSections"
          render={(field) => (
            <FormItem>
              <FormLabel>Artworks</FormLabel>
              <FormControl>
                <Repeater<ArtworkSection>
                  name={'artworkSections'}
                  // @ts-expect-error it works
                  initialValues={field.value}
                  renderFields={(item, index, handleChange) => (
                    <>
                      <Input
                        placeholder={'Title'}
                        type="text"
                        value={item?.title ?? ''}
                        onChange={(e) =>
                          handleChange(index, 'title', e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      <Input
                        placeholder={'Subtitle'}
                        type="text"
                        value={item?.subtitle ?? ''}
                        onChange={(e) =>
                          handleChange(index, 'subtitle', e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      <ArtworkGallerySelector
                        name={`artworkSections.${index}.artworks`}
                        onChange={(selectedIds) =>
                          handleChange(index, 'artworks', selectedIds)
                        }
                      />
                    </>
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TemplateContainer>
    </div>
  )
}
