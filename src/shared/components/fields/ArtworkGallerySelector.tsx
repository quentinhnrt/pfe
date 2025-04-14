"use client"

import { useEffect, useState } from "react"
import { useFormContext, Controller } from "react-hook-form"
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import clsx from "clsx"

interface Artwork {
    id: number
    title: string
    thumbnail: string
}

interface ArtworkGallerySelectorProps {
    name: string
    label?: string
    initialSelectedIds?: number[] // <- utile pour les valeurs initiales quand on édite
}

export function ArtworkGallerySelector({
                                                name,
                                                label = "Select Artworks",
                                                initialSelectedIds = []
                                            }: ArtworkGallerySelectorProps) {
    const { control, setValue, watch } = useFormContext()
    const selectedIds: number[] = watch(name, initialSelectedIds) || []

    const [artworks, setArtworks] = useState<Artwork[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [initialArtworks, setInitialArtworks] = useState<Artwork[]>([])

    function ArtworkCard({artwork, isSelected}:{artwork: Artwork, isSelected: boolean}) {
        return (
            <Card
                key={artwork.id}
                onClick={() => toggleSelection(artwork.id)}
                className={clsx(
                    "cursor-pointer border-2 rounded-2xl overflow-hidden transition-all",
                    isSelected ? "border-primary ring-2 ring-primary/50" : "border-muted"
                )}
            >
                <Image
                    src={artwork.thumbnail}
                    alt={artwork.title}
                    width={200}
                    height={200}
                    className="object-cover w-full h-48"
                />
                <div className="p-2 text-sm text-center">{artwork.title}</div>
            </Card>
        )
    }

    useEffect(() => {
        const loadArtworks = async () => {
            const initalialSelectedIdsParamValue = initialSelectedIds.join()
            const params = {
                perPage: "10",
                page: page.toString(),
                artworks: initalialSelectedIdsParamValue
            } as Record<string, string>

            const searchParams = new URLSearchParams(params)
            const response = await fetch('/api/me/artworks?'+searchParams.toString())

            const data = await response.json()

            setArtworks(data.artworks)
            setInitialArtworks(data.selectedArtworks)
            setLoading(false)
        }

        loadArtworks()

    }, [])

    const toggleSelection = (id: number) => {
        const isSelected = selectedIds.includes(id)
        const updated = isSelected
            ? selectedIds.filter((i) => i !== id)
            : [...selectedIds, id]

        setValue(name, updated)
    }

    if (loading) return <p className="text-muted">Chargement de la galerie...</p>

    return (
        <Controller
            name={name}
            control={control}
            render={() => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                            {initialArtworks?.length && initialArtworks.map((artwork) => {
                                return (
                                    <ArtworkCard artwork={artwork} isSelected={true} key={artwork.id} />
                                )
                            })}
                            {artworks?.length && artworks.map((artwork) => {
                                const isSelected = selectedIds.includes(artwork.id)

                                return (
                                    <ArtworkCard artwork={artwork} isSelected={isSelected} key={artwork.id} />
                                )
                            })}
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
