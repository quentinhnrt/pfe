import SearchArtist from '@/components/SearchArtist';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import PostFeed from '@/components/PostFeed';
import ArtworkFeed from '@/components/ArtworkFeed';
import {Separator} from "@/components/ui/shadcn/separator";
import {Badge} from "@/components/ui/shadcn/badge";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Page d\'accueil | ArtiLink',
    description: 'Découvrez des œuvres d\'art exceptionnelles et connectez-vous avec des artistes talentueux',
}

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen">
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Explorez l&apos;art du monde entier
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Découvrez des œuvres d&apos;art exceptionnelles et connectez-vous avec des artistes talentueux
          </p>
          <SearchArtist />
        </div>
      </div>
      <main className="container mx-auto px-4">
        <ArtworkFeed isAuthenticated={!!session?.user} />
        {session?.user && (
          <div className="relative py-10">
            <Separator className={"dark:bg-white bg-gray-200"} />
            <Badge className={"absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full font-semibold px-6 py-2  dark:text-white text-gray-600 border-1 dark:border-white border-gray-200 dark:bg-black bg-white text-sm"}>
                Derniers posts
            </Badge>
          </div>
        )}
        {session?.user && (
          <PostFeed
            session={{
              user: {
                id: session.user.id,
                firstname: session.user.firstname || "Utilisateur",
                image: session.user.image ?? undefined,
              },
            }}
          />
        )}
      </main>
    </div>
  );
}