import type { ReactNode } from "react";

import { Sidebar } from "@/components/static/layout/sidebar";
import { SearchBar } from "@/components/static/search/search-bar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-10 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <h1 className="text-xl font-bold">ArtConnect</h1>
            <SearchBar />
            <div className="flex items-center gap-4">
              <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <img
                  className="aspect-square h-full w-full"
                  src="/placeholder.svg?height=40&width=40"
                  alt="Avatar"
                />
              </span>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
