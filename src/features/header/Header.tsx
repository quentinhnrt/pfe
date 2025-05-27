'use client';

import Link from 'next/link';
import { Card } from "@/components/ui/shadcn/card";
import { Button } from '@/components/ui/shadcn/button';
import { useSession } from '@/hooks/useSession';
import UserHeader from "@/features/header/UserHeader";
import { Session } from "@/lib/auth";
import ActionButton from '@/components/ActionButton';

export default function Header() {
  const session = useSession();

  return (
      <Card className="sticky top-0 z-50 backdrop-blur-xl shadow-lg border-b rounded-none">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              ArtLink
            </Link>
            <div className="flex items-center gap-4">
              {!session?.user ? (
                  <Button asChild>
                    <Link href="/sign-in">
                      Se connecter / S’inscrire
                    </Link>
                  </Button>
              ) : (
                  <div className="flex items-center gap-4">
                    <ActionButton />
                    <UserHeader session={session as Session} />
                  </div>
              )}
            </div>
          </div>
        </div>
      </Card>
  );
}
