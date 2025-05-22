import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserFromApi } from "./users";

/**
 * Combines class names with Tailwind CSS utility classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string or Date object to a localized date string
 */
export function formatDateToLocale(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {},
  locale = "en-US"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, options);
}

/**
 * Safely truncates a string to a specified length
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + "...";
}

/**
 * Returns a user's display name based on available information
 */
export function getUserDisplayName(
  firstName?: string | null,
  lastName?: string | null,
  username?: string | null
): string {
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  return fullName || username || "Anonymous User";
}

/**
 * Detects and converts URLs in text to clickable links
 */
export function makeLinksClickable(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  );
}

export interface FormattedPost {
  id: string | number;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  artworks: FormattedArtwork[];
  question: string | null;
}

export interface FormattedArtwork {
  id: number;
  userId: string;
  title: string;
  description: string;
  isForSale: boolean;
  price: number | null;
  sold: boolean;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

export function formatUserPosts(posts: UserFromApi["posts"]): FormattedPost[] {
  if (!posts || !Array.isArray(posts)) return [];

  return posts.map((post) => ({
    id: post.id,
    userId: post.userId,
    content: post.content || "",
    createdAt:
      post.createdAt instanceof Date
        ? post.createdAt.toISOString()
        : String(post.createdAt),
    updatedAt:
      post.updatedAt instanceof Date
        ? post.updatedAt.toISOString()
        : String(post.updatedAt),
    question: post.question ? post.question.question : null,
    artworks: post.artworks.map((artwork) => ({
      id: artwork.id,
      userId: artwork.userId,
      title: artwork.title || "",
      description: artwork.description || "",
      isForSale: artwork.isForSale || false,
      price: artwork.price || null,
      sold: artwork.sold || false,
      thumbnail: artwork.thumbnail || "/artwork-placeholder.jpg",
      createdAt:
        artwork.createdAt instanceof Date
          ? artwork.createdAt.toISOString()
          : String(artwork.createdAt),
      updatedAt:
        artwork.updatedAt instanceof Date
          ? artwork.updatedAt.toISOString()
          : String(artwork.updatedAt),
    })),
  }));
}
