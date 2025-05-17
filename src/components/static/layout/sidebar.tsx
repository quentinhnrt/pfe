import {
  Bell,
  Briefcase,
  Compass,
  Home,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl font-bold">ArtConnect</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link href="/" passHref>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Home className="h-4 w-4" />
              Accueil
            </Button>
          </Link>
          <Link href="/search" passHref>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Search className="h-4 w-4" />
              Recherche
            </Button>
          </Link>
          <Link href="/explore" passHref>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Compass className="h-4 w-4" />
              Explorer
            </Button>
          </Link>
          <Link href="/profile" passHref>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <User className="h-4 w-4" />
              Profil
            </Button>
          </Link>
          <Link href="/portfolio" passHref>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Briefcase className="h-4 w-4" />
              Portfolio
            </Button>
          </Link>
          <Link href="/messages" passHref>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <MessageSquare className="h-4 w-4" />
              Messages
            </Button>
          </Link>
          <Link href="/notifications" passHref>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Bell className="h-4 w-4" />
              Notifications
            </Button>
          </Link>
          <Link href="/settings" passHref>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Settings className="h-4 w-4" />
              Paramètres
            </Button>
          </Link>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button variant="outline" className="w-full justify-start gap-3">
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
