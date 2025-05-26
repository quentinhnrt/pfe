import { ArrowLeft, Compass, Home, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { MotionDiv, MotionImg } from "@/components/motion";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";

export const metadata: Metadata = {
  title: "Page non trouvée",
  description: "La page que vous recherchez n'existe pas ou a été déplacée.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-12 flex flex-col items-center justify-center mx-auto">
        <div className="max-w-md w-full mx-auto text-center space-y-8">
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto"
          >
            <MotionImg
              src="/signin.jpg"
              alt="404 Illustration"
              width={300}
              height={300}
              className="mx-auto h-auto max-w-[200px]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-3xl font-bold tracking-tight">
              Page Not Found
            </h1>
            <p className="text-muted-foreground">
              Oops! The page you&apos;re looking for seems to have disappeared
              into our virtual gallery.
            </p>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <form action="/search" className="relative">
              <Input
                type="search"
                name="q"
                placeholder="Search..."
                className="pl-10 pr-4 py-2"
                aria-label="Search"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              Or explore these popular sections:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="default">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/explore">
                  <Compass className="mr-2 h-4 w-4" />
                  Explore
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/community">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Community
                </Link>
              </Button>
            </div>
          </MotionDiv>
        </div>
      </main>
    </div>
  );
}
