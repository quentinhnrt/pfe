"use client"

import {useState, useEffect} from "react"
import {Artwork} from "@prisma/client"
import {Button} from "@/components/ui/shadcn/button"
import ArtworkCard from "@/features/profile/ArtworkCard";
import {deleteArtwork} from "@/lib/artworks";
import ArtworkDialog from "@/features/profile/ArtworkDialog";

export default function ArtworksToSellTab({userId, isActive}: { userId: string, isActive: boolean }) {
    const [artworks, setArtworks] = useState<Artwork[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [hasFetched, setHasFetched] = useState(false)
    const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const limit = 10

    async function fetchArtworks() {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/artworks?userId=${userId}&page=${page}&limit=${limit}&isForSale=true`, {
                cache: "force-cache",
            })

            if (!response.ok) {
                throw new Error("Failed to fetch artworks")
            }

            const result: Artwork[] = await response.json()

            if (page === 1) {
                setArtworks(result)
            } else {
                setArtworks((prev) => [...prev, ...result])
            }

            setHasMore(result.length !== 0)
            if (!hasFetched) {
                setHasFetched(true)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!hasFetched || !isActive) return
        fetchArtworks()
    }, [page, limit])

    useEffect(() => {
        if (!isActive || hasFetched) return
        fetchArtworks()
    }, [isActive, userId])

    const handleOpenDialog = (artwork: Artwork) => {
        setSelectedArtwork(artwork)
        setIsDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false)
        setSelectedArtwork(null)
    }

    async function handleDeleteArtwork(artworkId: number) {
        const response = await deleteArtwork(artworkId)

        if (response) {
            setArtworks((prev) => prev.filter((artwork) => artwork.id !== artworkId))
            if (selectedArtwork?.id === artworkId) {
                handleCloseDialog()
            }
        } else {
            setError("Failed to delete artwork")
        }
    }

    async function handleArtworkEdited(updatedArtwork: Artwork) {
        setArtworks((prev) =>
            prev.map((artwork) => (artwork.id === updatedArtwork.id ? updatedArtwork : artwork))
        )
        setSelectedArtwork(updatedArtwork)
    }

    if (error) {
        return (
            <div className="p-4">
                <h2 className="text-2xl font-semibold mb-4">Artworks</h2>
                <div className="text-red-500">Erreur lors du chargement des artworks: {error}</div>
            </div>
        )
    }

    return (
        <div className="p-4">
            {isLoading && page === 1 ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"/>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
                        {artworks.map((artwork) => (
                            <ArtworkCard key={artwork.id} artwork={artwork} onClick={handleOpenDialog} />
                        ))}
                    </div>


                    {artworks.length === 0 && <p className="text-gray-500">Aucun artwork trouvé</p>}

                    {hasMore && (
                        <Button
                            onClick={() => setPage((prev) => prev + 1)}
                            disabled={isLoading}
                            className="cursor-pointer mx-auto block mt-4"
                        >
                            {isLoading ? "Chargement..." : "Charger plus"}
                        </Button>
                    )}
                </div>
            )}

            <ArtworkDialog artwork={selectedArtwork} isDialogOpen={isDialogOpen} handleCloseDialog={handleCloseDialog} handleArtworkEdited={handleArtworkEdited} handleDeleteArtwork={handleDeleteArtwork} />
        </div>
    )
}
