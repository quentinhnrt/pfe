"use client";

import {Cog, ImageIcon, PaletteIcon, User} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const settingsLinks = [
  {
    href: "/settings/profile",
    label: "Profile",
    icon: User,
  },
  {
    href: "/settings/appearance",
    label: "Appearance",
    icon: ImageIcon,
  },
  {
    href: "/settings/account",
    label: "Account",
    icon: Cog,
  },
  {
    href: "/settings/portfolio",
    label: "Portfolio",
    icon: PaletteIcon
  }
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1">
      {settingsLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md",
            pathname === link.href
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          <link.icon className="h-4 w-4 mr-2" />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
