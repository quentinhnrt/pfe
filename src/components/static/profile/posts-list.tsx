"use client";

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  images?: string[];
  createdAt: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export function PostsList() {
  // Mock data for posts
  const initialPosts: Post[] = [
    {
      id: "1",
      author: {
        name: "Sophie Martin",
        username: "sophieart",
        avatar: "/female-artist-portrait.png",
      },
      content:
        "Je suis ravie de vous annoncer que ma nouvelle série d'œuvres abstraites sera exposée à la Galerie Moderne à partir du mois prochain ! Voici un aperçu de quelques pièces.",
      images: [
        "/abstract-blue-painting.png",
        "/abstract-geometric-painting.png",
      ],
      createdAt: new Date(2023, 4, 15),
      likes: 124,
      comments: 18,
      isLiked: false,
    },
    {
      id: "2",
      author: {
        name: "Sophie Martin",
        username: "sophieart",
        avatar: "/female-artist-portrait.png",
      },
      content:
        "Aujourd'hui dans l'atelier, je travaille sur une nouvelle technique de peinture acrylique. J'adore expérimenter avec les textures et les couleurs !",
      images: ["/artist-studio-paintings.png"],
      createdAt: new Date(2023, 4, 10),
      likes: 87,
      comments: 9,
      isLiked: true,
    },
    {
      id: "3",
      author: {
        name: "Sophie Martin",
        username: "sophieart",
        avatar: "/female-artist-portrait.png",
      },
      content:
        "Merci à tous ceux qui sont venus à mon vernissage hier soir ! C'était une soirée incroyable et j'ai été touchée par vos retours positifs sur mon travail.",
      createdAt: new Date(2023, 4, 5),
      likes: 215,
      comments: 32,
      isLiked: false,
    },
  ];

  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked,
          };
        }
        return post;
      })
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Publications</h2>

      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader className="flex flex-row items-center gap-4 p-4">
            <Avatar>
              <AvatarImage
                src={post.author.avatar || "/placeholder.svg"}
                alt={post.author.name}
              />
              <AvatarFallback>
                {post.author.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">
                    @{post.author.username}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-muted-foreground mr-2">
                    {formatDistanceToNow(post.createdAt, {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Enregistrer</DropdownMenuItem>
                      <DropdownMenuItem>Signaler</DropdownMenuItem>
                      <DropdownMenuItem>Masquer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="mb-4">{post.content}</p>
            {post.images && post.images.length > 0 && (
              <div
                className={`grid gap-2 ${post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
              >
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`Post image ${index + 1}`}
                    className="rounded-lg w-full h-auto object-cover"
                    style={{ maxHeight: "300px" }}
                  />
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${post.isLiked ? "text-red-500" : ""}`}
              onClick={() => handleLike(post.id)}
            >
              <Heart
                className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`}
              />
              {post.likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
            >
              <MessageCircle className="h-4 w-4" />
              {post.comments}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
