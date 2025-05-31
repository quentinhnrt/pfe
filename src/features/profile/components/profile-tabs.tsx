"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import { useState } from "react";
import ArtworksTab from "./tabs/artworks-tab";
import ArtworksToSell from "./tabs/artworks-to-sell-tab";
import PostsTab from "./tabs/posts-tab";

export default function ProfileTabs({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState("artworks");

  return (
    <div className="w-full mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="artworks">Artworks</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="artworks-to-sell">Artworks to sell</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <div className={activeTab === "artworks" ? "block" : "hidden"}>
            <ArtworksTab userId={userId} isActive={activeTab === "artworks"} />
          </div>

          <div className={activeTab === "posts" ? "block" : "hidden"}>
            <PostsTab userId={userId} isActive={activeTab === "posts"} />
          </div>

          <div
            className={activeTab === "artworks-to-sell" ? "block" : "hidden"}
          >
            <ArtworksToSell
              userId={userId}
              isActive={activeTab === "artworks-to-sell"}
            />
          </div>
        </div>
      </Tabs>
    </div>
  );
}
