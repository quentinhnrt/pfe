import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = {},
  locale = "en-US"
): string {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "";
    return dateObj.toLocaleDateString(locale, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

/**
 * Safely truncates a string to a specified length
 */
export function truncateString(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str;
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
  if (!text) return "";
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  );
}
