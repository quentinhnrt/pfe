"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

import { ArtistCard } from "@/components/artist/artist-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for search results
  const artists = [
    {
      id: "1",
      name: "Sophie Martin",
      avatar: "/female-artist-portrait.png",
      specialty: "Abstract Painting",
      location: "Paris, France",
      followers: 1245,
    },
    {
      id: "2",
      name: "Jean Dupont",
      avatar: "/male-artist-portrait.png",
      specialty: "Urban Photography",
      location: "Lyon, France",
      followers: 876,
    },
    {
      id: "3",
      name: "Marie Leclerc",
      avatar: "/placeholder.svg?height=100&width=100&query=portrait of female sculptor",
      specialty: "Contemporary Sculpture",
      location: "Marseille, France",
      followers: 2341,
    },
  ]

  const artworks = [
    {
      id: "1",
      title: "Blue Abstraction",
      image: "/abstract-blue-painting.png",
      artist: "Sophie Martin",
      medium: "Acrylic on canvas",
      year: "2023",
    },
    {
      id: "2",
      title: "City at Night",
      image: "/placeholder.svg?height=200&width=200&query=urban night photography",
      artist: "Jean Dupont",
      medium: "Photography",
      year: "2022",
    },
    {
      id: "3",
      title: "Fragments",
      image: "/placeholder.svg?height=200&width=200&query=contemporary sculpture",
      artist: "Marie Leclerc",
      medium: "Sculpture",
      year: "2021",
    },
  ]

  useEffect(() => {
    // Simulate loading
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [query])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Results for "{query || "all artists"}"</h2>
        <p className="text-muted-foreground">{artists.length + artworks.length} results found</p>
      </div>

      <Tabs defaultValue="artists">
        <TabsList className="mb-6">
          <TabsTrigger value="artists">Artists</TabsTrigger>
          <TabsTrigger value="artworks">Artworks</TabsTrigger>
        </TabsList>
        <TabsContent value="artists">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="artworks">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <div key={artwork.id} className="border rounded-lg overflow-hidden">
                <img
                  src={artwork.image || "/placeholder.svg"}
                  alt={artwork.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{artwork.title}</h3>
                  <p className="text-sm text-muted-foreground">{artwork.artist}</p>
                  <p className="text-sm">
                    {artwork.medium}, {artwork.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
