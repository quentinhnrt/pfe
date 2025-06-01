"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface OptimizedImageProps extends Omit<ImageProps, "alt"> {
  alt: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  aspectRatio?: number;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  loading = "lazy",
  aspectRatio,
  objectFit = "cover",
  className,
  sizes,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Calculer les dimensions si aspectRatio est fourni
  const calculatedHeight = aspectRatio && width ? Number(width) / aspectRatio : height;

  // Tailles responsive par défaut optimisées pour le SEO
  const defaultSizes = sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-800 ${className}`}
        style={{ 
          width: width || "100%", 
          height: calculatedHeight || height || "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        role="img"
        aria-label={alt}
      >
        <span className="text-gray-500 dark:text-gray-400">Image non disponible</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: aspectRatio }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={calculatedHeight || height}
        priority={priority}
        loading={priority ? "eager" : loading}
        sizes={defaultSizes}
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        className={`${isLoading ? "animate-pulse bg-gray-200" : ""} ${objectFit === "contain" ? "object-contain" : "object-cover"}`}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        {...props}
      />
    </div>
  );
}