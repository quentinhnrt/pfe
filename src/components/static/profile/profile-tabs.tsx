"use client";
import { PortfolioGallery } from "@/components/static/portfolio/portfolio-gallery";
import { ArtworksForSale } from "@/components/static/profile/artworks-for-sale";
import { PostsList } from "@/components/static/profile/posts-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileTabsProps {
  profile: {
    id: string;
    name: string;
    username: string;
  };
}

export function ProfileTabs({ profile }: ProfileTabsProps) {
  // Mock data for artworks
  const artworks = [
    {
      id: "1",
      title: "Blue Abstraction",
      image: "/abstract-blue-painting.png",
      medium: "Acrylic on canvas",
      dimensions: "80 x 100 cm",
      year: "2023",
    },
    {
      id: "2",
      title: "Composition #12",
      image: "/abstract-geometric-painting.png",
      medium: "Oil on canvas",
      dimensions: "60 x 80 cm",
      year: "2023",
    },
    {
      id: "3",
      title: "Fragments",
      image: "/mixed-media-abstract.png",
      medium: "Mixed media",
      dimensions: "100 x 120 cm",
      year: "2022",
    },
    {
      id: "4",
      title: "Reflections",
      image: "/reflective-abstract.png",
      medium: "Acrylic on canvas",
      dimensions: "90 x 90 cm",
      year: "2022",
    },
  ];

  return (
    <Tabs defaultValue="for-sale" className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none px-6">
        <TabsTrigger value="for-sale">Œuvres à vendre</TabsTrigger>
        <TabsTrigger value="posts">Publications</TabsTrigger>
        <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
      </TabsList>
      <TabsContent value="for-sale" className="px-6 py-4">
        <ArtworksForSale />
      </TabsContent>
      <TabsContent value="posts" className="px-6 py-4">
        <PostsList />
      </TabsContent>
      <TabsContent value="portfolio" className="px-6 py-4">
        <PortfolioGallery artworks={artworks} />
      </TabsContent>
      <TabsContent value="about" className="px-6 py-4">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">About {profile.name}</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget
            aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies
            lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet
            nisl.
          </p>
          <h3 className="text-lg font-semibold mt-6">Education</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>School of Fine Arts, Paris, 2015-2018</li>
            <li>Academy of Arts, Lyon, 2012-2015</li>
          </ul>
          <h3 className="text-lg font-semibold mt-6">Skills</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="bg-muted px-3 py-1 rounded-full text-sm">
              Oil Painting
            </div>
            <div className="bg-muted px-3 py-1 rounded-full text-sm">
              Acrylic
            </div>
            <div className="bg-muted px-3 py-1 rounded-full text-sm">
              Drawing
            </div>
            <div className="bg-muted px-3 py-1 rounded-full text-sm">
              Digital Art
            </div>
            <div className="bg-muted px-3 py-1 rounded-full text-sm">
              Sculpture
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
