"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useState } from "react";

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
  id: string;
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

export function ProfileTabs({ posts }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("for-sale");

  const postsOnSale = posts.filter((post) =>
    post.artworks.some((artwork) => artwork.isForSale)
  );

  const allArtworks = posts.flatMap((post) => post.artworks);

  return (
    <>
      <Tabs
        defaultValue="for-sale"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {postsOnSale.map((post) =>
              post.artworks
                .filter((artwork) => artwork.isForSale)
                .map((artwork) => (
                  <div key={artwork.id} className="rounded-lg border p-4">
                    <div className="aspect-square relative mb-4">
                      <Image
                        src={artwork.thumbnail}
                        alt={artwork.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <h3 className="font-semibold">{artwork.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {artwork.description}
                    </p>
                    {artwork.price && (
                      <p className="mt-2 font-medium">{artwork.price}€</p>
                    )}
                  </div>
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="posts" className="mt-6">
          <div className="space-y-4">
            {posts.map((post) => (
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
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allArtworks.map((artwork) => (
              <div key={artwork.id} className="rounded-lg border p-4">
                <div className="aspect-square relative mb-4">
                  <Image
                    src={artwork.thumbnail}
                    alt={artwork.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <h3 className="font-semibold">{artwork.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {artwork.description}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
