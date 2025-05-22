"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { memo, useState } from "react";

interface Artwork {
  id: number;
  userId: string;
  title: string;
  description: string;
  isForSale: boolean;
  price: number | null;
  sold: boolean;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

interface Post {
  id: string | number;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  artworks: Artwork[];
  question: string | null;
}

interface ProfileTabsProps {
  profile: {
    id: string;
    name: string;
    username: string;
  };
  posts: Post[];
}

// Memoized artwork component for better render performance
const ArtworkCard = memo(function ArtworkCard({
  artwork,
}: {
  artwork: Artwork;
}) {
  return (
    <div key={artwork.id} className="rounded-lg border p-4">
      <div className="aspect-square relative mb-4">
        <Image
          src={artwork.thumbnail}
          alt={artwork.title}
          fill
          className="object-cover rounded-md"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
      </div>
      <h3 className="font-semibold">{artwork.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {artwork.description}
      </p>
      {artwork.price && <p className="mt-2 font-medium">{artwork.price}€</p>}
    </div>
  );
});

// Memoized post component for better render performance
const PostCard = memo(function PostCard({ post }: { post: Post }) {
  return (
    <div key={post.id} className="rounded-lg border p-4">
      <p className="mb-2">{post.content}</p>
      {post.artworks.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {post.artworks.map((artwork) => (
            <div key={artwork.id} className="aspect-square relative">
              <Image
                src={artwork.thumbnail}
                alt={artwork.title}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 640px) 50vw, 25vw"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export const ProfileTabs = memo(function ProfileTabs({
  posts,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("portfolio");

  const postsOnSale = posts.filter((post) =>
    post.artworks.some((artwork) => artwork.isForSale)
  );

  const allArtworks = posts.flatMap((post) => post.artworks);

  // Memoize the sale artworks to avoid recalculation
  const artworksOnSale = postsOnSale.flatMap((post) =>
    post.artworks.filter((artwork) => artwork.isForSale)
  );

  if (!posts.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No content available</p>
      </div>
    );
  }

  return (
    <Tabs
      defaultValue="portfolio"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="w-full justify-start">
        <TabsTrigger value="portfolio">Oeuvres</TabsTrigger>
        <TabsTrigger value="posts">Publications</TabsTrigger>
        <TabsTrigger value="for-sale">Œuvres à vendre</TabsTrigger>
      </TabsList>

      <TabsContent value="for-sale" className="mt-6">
        {artworksOnSale.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {artworksOnSale.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No artworks for sale</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="posts" className="mt-6">
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No posts available</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="portfolio" className="mt-6">
        {allArtworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No artworks available</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
});
