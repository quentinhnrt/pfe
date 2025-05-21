import SearchArtist from '@/components/SearchArtist';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import PostFeed from '@/components/PostFeed';

import ActionButton from '../components/ActionButton';
import ArtworkFeed from '@/components/ArtworkFeed';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm shadow-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">ArtLink</Link>

          <div className="flex items-center gap-3">
            {!session?.user ? (
              <Link
                href="/sign-in"
                className="flex h-10 items-center justify-center rounded-full border border-white/20 px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-white/10"
              >
                S&apos;inscrire / Se connecter
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <ActionButton />
                <Link href={`/user/${session.user.id}`} className="flex flex-col items-center">
                  {session.user.image ? (
                    <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                      <Image
                        src={session.user.image}
                        alt={session.user.firstname || ''}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-700 text-white rounded-full">
                      {session.user.firstname?.charAt(0) || 'U'}
                    </div>
                  )}
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="bg-black py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-white text-3xl font-bold mb-6">
            Explorez l&apos;art du monde entier
          </h1>
          <SearchArtist />
        </div>
      </div>
      <main className="container mx-auto px-4 py-6">
        <ArtworkFeed />
        {session?.user && (
          <>
            <PostFeed />
          </>
        )}
      </main>
    </div>
  );
}
