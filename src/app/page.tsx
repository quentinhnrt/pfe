import SearchArtist from '@/components/SearchArtist';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import PostFeed from '@/components/PostFeed';
import ArtworkFeed from '@/components/ArtworkFeed';


export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-black text-4xl font-bold mb-4 text-gray-900">
            Explorez l&apos;art du monde entier
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Découvrez des œuvres d&apos;art exceptionnelles et connectez-vous avec des artistes talentueux
          </p>
          <SearchArtist />
        </div>
      </div>
      <main className="container mx-auto px-4">
        <ArtworkFeed isAuthenticated={!!session?.user} />
        {session?.user && (
          <div className="relative py-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-6 py-2 text-sm font-semibold text-gray-600 rounded-full border border-gray-200">
                Derniers posts
              </span>
            </div>
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