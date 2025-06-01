import { Metadata } from "next";

export const siteConfig = {
  name: "ArtiLink",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://artilink.com",
  description: "Art sharing and selling platform - Connect artists and collectors",
  keywords: ["art", "artist", "artwork", "gallery", "art sale", "artistic portfolio", "collectors", "digital art"],
  creator: "@artilink",
  images: {
    default: "/og-image.jpg",
    twitter: "/twitter-image.jpg"
  }
};

export async function generateBaseMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: siteConfig.description,
      images: [{
        url: siteConfig.images.default,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      creator: siteConfig.creator,
      images: [siteConfig.images.twitter],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: siteConfig.url,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
    },
  };
}