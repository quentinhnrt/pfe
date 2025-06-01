import { siteConfig } from "./metadata";

export type JsonLdType = "Organization" | "WebSite" | "Person" | "ImageGallery" | "BreadcrumbList" | "ProfilePage";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.svg`,
    sameAs: [
      "https://twitter.com/artilink",
      "https://www.instagram.com/artilink",
      "https://www.facebook.com/artilink"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["French", "English"]
    }
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export function generatePersonSchema(user: {
  id: string;
  firstname: string;
  lastname: string;
  username?: string;
  bio?: string;
  image?: string;
  accountType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": user.accountType === "ARTIST" ? "Artist" : "Person",
    "@id": `${siteConfig.url}/user/${user.id}`,
    name: `${user.firstname} ${user.lastname}`,
    url: user.username ? `${siteConfig.url}/portfolio/${user.username}` : `${siteConfig.url}/user/${user.id}`,
    image: user.image || `${siteConfig.url}/default-avatar.jpg`,
    description: user.bio,
    sameAs: user.username ? [`${siteConfig.url}/portfolio/${user.username}`] : []
  };
}

export function generateImageGallerySchema(artworks: Array<{
  id: string;
  title: string;
  description?: string;
  image: string;
  createdAt: Date;
  user: {
    firstname: string;
    lastname: string;
  };
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Galerie d'œuvres",
    description: "Collection d'œuvres d'art sur ArtiLink",
    url: siteConfig.url,
    image: artworks.map(artwork => ({
      "@type": "ImageObject",
      name: artwork.title,
      description: artwork.description,
      contentUrl: artwork.image,
      dateCreated: artwork.createdAt.toISOString(),
      creator: {
        "@type": "Person",
        name: `${artwork.user.firstname} ${artwork.user.lastname}`
      }
    }))
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function generateProfilePageSchema(user: {
  id: string;
  firstname: string;
  lastname: string;
  username?: string;
  bio?: string;
  image?: string;
  accountType?: string;
  artworksCount?: number;
  followersCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": user.accountType === "ARTIST" ? "Artist" : "Person",
      name: `${user.firstname} ${user.lastname}`,
      url: user.username ? `${siteConfig.url}/portfolio/${user.username}` : `${siteConfig.url}/user/${user.id}`,
      image: user.image,
      description: user.bio,
      interactionStatistic: [
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/FollowAction",
          userInteractionCount: user.followersCount || 0
        },
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/CreateAction",
          userInteractionCount: user.artworksCount || 0
        }
      ]
    }
  };
}