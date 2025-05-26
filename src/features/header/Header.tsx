'use client';

import Link from 'next/link';
import Image from 'next/image';
import ActionButton from '@/components/ActionButton';
import { useSession } from '@/hooks/useSession';

export default function Header() {
  const session = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            ArtLink
          </Link>
          <div className="flex items-center gap-4">
            {!session?.user ? (
              <Link
                href="/sign-in"
                className="px-6 py-2.5 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors duration-300"
              >
                Se connecter / S’inscrire
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <ActionButton />
                <Link
                  href={`/user/${session.user.id}`}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  {session.user.image ? (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-gray-200">
                      <Image
                        src={session.user.image}
                        alt={session.user.firstname || ''}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-700 font-semibold rounded-xl border-2 border-gray-200">
                      {session.user.firstname?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {session.user.firstname || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-500">Mon profil</p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
