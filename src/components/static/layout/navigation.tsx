"use client";

import {
  Bell,
  Briefcase,
  Home,
  LogIn,
  Menu,
  MessageSquare,
  Search,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { SearchBar } from "@/components/static/search/search-bar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";

export function Navigation() {
  const pathname = usePathname();
  const isMobile = useMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock authentication for demo purposes
  useEffect(() => {
    // Check if the user is on a protected page
    const protectedPages = ["/profile", "/portfolio"];
    if (protectedPages.some((page) => pathname.startsWith(page))) {
      setIsAuthenticated(true);
    }
  }, [pathname]);

  // Handle scroll effect for floating menu
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { href: "/search", label: "Search", icon: <Search className="h-5 w-5" /> },
  ];

  const authNavItems = [
    ...navItems,
    { href: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    {
      href: "/portfolio",
      label: "Portfolio",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      href: "/messages",
      label: "Messages",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      href: "/notifications",
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const displayItems = isAuthenticated ? authNavItems : navItems;

  return (
    <>
      {/* Top navigation for desktop */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-sm shadow-sm"
            : "bg-background"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="text-xl font-bold">ArtConnect</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {displayItems.slice(0, 3).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden md:flex md:w-1/3 lg:w-1/4">
            <SearchBar />
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <nav className="grid gap-6 text-lg font-medium">
                      <Link
                        href="/"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <Home className="h-5 w-5" />
                        <span>Home</span>
                      </Link>
                      <Link
                        href="/search"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <Search className="h-5 w-5" />
                        <span>Search</span>
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/portfolio"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <Briefcase className="h-5 w-5" />
                        <span>Portfolio</span>
                      </Link>
                      <Link
                        href="/messages"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <MessageSquare className="h-5 w-5" />
                        <span>Messages</span>
                      </Link>
                      <Link
                        href="/notifications"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <Bell className="h-5 w-5" />
                        <span>Notifications</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                      </Link>
                    </nav>
                  </SheetContent>
                </Sheet>
                <span className="relative hidden md:flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <img
                    className="aspect-square h-full w-full"
                    src="/placeholder.svg?height=40&width=40&query=portrait of artist"
                    alt="Avatar"
                  />
                </span>
              </>
            ) : (
              <>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <nav className="grid gap-6 text-lg font-medium">
                      <Link
                        href="/"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <Home className="h-5 w-5" />
                        <span>Home</span>
                      </Link>
                      <Link
                        href="/search"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <Search className="h-5 w-5" />
                        <span>Search</span>
                      </Link>
                      <Link
                        href="/login"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <LogIn className="h-5 w-5" />
                        <span>Login</span>
                      </Link>
                    </nav>
                  </SheetContent>
                </Sheet>
                <Link href="/login" className="hidden md:block">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="hidden md:block">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Bottom navigation for mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/80 backdrop-blur-sm">
          <div className="grid h-16 grid-cols-5 items-center">
            {displayItems.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
