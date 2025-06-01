import prisma from "@/lib/prisma";
import { siteConfig } from "@/lib/seo/metadata";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Pages statiques avec leurs priorités
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sign-in`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    // Récupérer tous les utilisateurs actifs avec portfolios
    const users = await prisma.user.findMany({
      where: {
        onBoarded: true,
        name: { not: null },
      },
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
    });

    // Pages portfolio dynamiques
    const portfolioPages: MetadataRoute.Sitemap = users
      .filter((user) => user.name)
      .map((user) => ({
        url: `${baseUrl}/portfolio/${user.name}`,
        lastModified: user.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    // Pages utilisateurs dynamiques
    const userPages: MetadataRoute.Sitemap = users.map((user) => ({
      url: `${baseUrl}/user/${user.id}`,
      lastModified: user.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Récupérer les œuvres publiques (œuvres non vendues)
    const artworks = await prisma.artwork.findMany({
      where: {
        sold: false,
      },
      select: {
        id: true,
        updatedAt: true,
      },
      take: 1000, // Limiter pour éviter un sitemap trop gros
    });

    // Pages œuvres dynamiques (optionnel selon votre architecture)
    const artworkPages: MetadataRoute.Sitemap = artworks.map((artwork) => ({
      url: `${baseUrl}/artwork/${artwork.id}`,
      lastModified: artwork.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...portfolioPages, ...userPages, ...artworkPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Retourner au moins les pages statiques en cas d'erreur
    return staticPages;
  }
}
