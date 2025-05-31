"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Card } from "@/components/ui/shadcn/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/shadcn/sheet";
import UserHeader from "@/features/header/components/user-header";
import ActionButton from "@/features/social/components/action-button";
import { Session } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { Home, LogOut, Menu, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const { data: session } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  }

  return (
    <Card className="sticky top-0 z-50 backdrop-blur-xl shadow-lg border-b rounded-none">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            ArtiLink
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {!session?.user ? (
              <Button asChild>
                <Link href="/sign-in">Se connecter / S&apos;inscrire</Link>
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                {session.user.role === "ARTIST" && (
                  <>
                    <Button variant={"link"}>
                      <Link href={"/settings/portfolio"}>
                        Configurer mon portfolio
                      </Link>
                    </Button>
                    <ActionButton />
                  </>
                )}
                <UserHeader session={session as Session} />
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            {session?.user && session.user.role === "ARTIST" && (
              <div className="mr-2">
                <ActionButton />
              </div>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px] px-3">
                <SheetHeader className="border-b pb-4 mb-2">
                  <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 py-4 px-1">
                  {!session?.user ? (
                    <>
                      <Button
                        asChild
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Link href="/" className="flex items-center gap-3">
                          <Home size={18} />
                          <span>Accueil</span>
                        </Link>
                      </Button>
                      <Button asChild className="w-full justify-start mt-2">
                        <Link
                          href="/sign-in"
                          className="flex items-center gap-3"
                        >
                          <LogOut size={18} />
                          <span>Se connecter / S&apos;inscrire</span>
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 px-4 py-3 mb-3 border rounded-lg">
                        {session.user.image ? (
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200">
                            <Image
                              src={session.user.image}
                              alt={session.user.firstname || ""}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center font-semibold bg-gray-100 rounded-xl">
                            {session.user.firstname?.charAt(0) || "U"}
                          </div>
                        )}
                        <div className="text-left">
                          <p className="text-sm font-medium">
                            {session.user.firstname || "Utilisateur"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session.user.email || ""}
                          </p>
                        </div>
                      </div>

                      <Button
                        asChild
                        className="w-full justify-start px-4"
                        variant="outline"
                      >
                        <Link href="/" className="flex items-center gap-3">
                          <Home size={18} />
                          <span>Accueil</span>
                        </Link>
                      </Button>

                      <Button
                        asChild
                        className="w-full justify-start px-4"
                        variant="outline"
                      >
                        <Link
                          href={`/user/${session.user.id}`}
                          className="flex items-center gap-3"
                        >
                          <User size={18} />
                          <span>Mon profil</span>
                        </Link>
                      </Button>

                      {session.user.role === "ARTIST" && (
                        <Button
                          asChild
                          className="w-full justify-start px-4"
                          variant="outline"
                        >
                          <Link
                            href="/settings/portfolio"
                            className="flex items-center gap-3"
                          >
                            <Settings size={18} />
                            <span>Configurer mon portfolio</span>
                          </Link>
                        </Button>
                      )}

                      <Button
                        onClick={handleSignOut}
                        className="w-full justify-start mt-3 text-red-600 px-4"
                        variant="outline"
                      >
                        <div className="flex items-center gap-3">
                          <LogOut size={18} />
                          <span>Se déconnecter</span>
                        </div>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default Header;
