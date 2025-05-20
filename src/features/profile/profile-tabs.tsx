"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export function ProfileTabs({ profile, posts }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("for-sale");

  const postsOnSale = posts.filter((post) =>
    post.artworks.some((artwork) => artwork.isForSale)
  );

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
        <TabsContent value="for-sale"></TabsContent>
        <TabsContent value="posts"></TabsContent>
        <TabsContent value="portfolio"></TabsContent>
      </Tabs>
    </>
  );
}
