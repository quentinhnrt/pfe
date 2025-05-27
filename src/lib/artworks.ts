
export async function deleteArtwork(artworkId: number) {
    const response = await fetch(`/api/artworks/${artworkId}`, {
        method: "DELETE"
    })

    if (!response.ok) {
        throw new Error("Failed to delete artwork");
    }

    return await response.json();
}