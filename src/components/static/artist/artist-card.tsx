import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Users } from "lucide-react"

interface ArtistCardProps {
  artist: {
    id: string
    name: string
    avatar: string
    specialty: string
    location: string
    followers: number
  }
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={artist.avatar || "/placeholder.svg"} alt={artist.name} />
            <AvatarFallback>{artist.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg">{artist.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{artist.specialty}</p>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <MapPin className="h-3 w-3 mr-1" />
            {artist.location}
          </div>
          <div className="flex items-center text-sm">
            <Users className="h-3 w-3 mr-1" />
            {artist.followers} followers
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/user/${artist.name.toLowerCase().replace(/\s+/g, "-")}`} className="w-full mr-2">
          <Button variant="outline" className="w-full">
            View Profile
          </Button>
        </Link>
        <Button className="w-full">Follow</Button>
      </CardFooter>
    </Card>
  )
}
