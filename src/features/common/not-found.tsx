"use client";

import { Button } from "@/components/ui/shadcn/button";
import { ArrowLeft, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NotFoundProps {
  title?: string;
  description?: string;
  searchQuery?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export default function NotFound({
  title,
  description,
  searchQuery,
  showBackButton = true,
  showHomeButton = true,
}: NotFoundProps) {
  const c = useTranslations("commons");
  const router = useRouter();

  const defaultTitle = searchQuery
    ? c("not-found.search-title-no-query")
    : c("not-found.title");

  const defaultDescription = searchQuery
    ? c("not-found.search-description")
    : c("not-found.description");

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-16 px-4 text-center">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
        <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold mb-3">
        {title || defaultTitle}
      </h1>

      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        {description || defaultDescription}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {showBackButton && (
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            {c("buttons.go-back")}
          </Button>
        )}

        {showHomeButton && (
          <Button asChild>
            <Link href="/">{c("buttons.go-home")}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
