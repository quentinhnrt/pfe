"use client";

import Header from "@/features/header/components/header";
import { usePathname } from "next/navigation";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const authRoutes = ["/sign-in", "/portfolio", "/on-boarding"];
  const shouldHideHeader = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (shouldHideHeader) {
    return null;
  }

  return <Header />;
}
