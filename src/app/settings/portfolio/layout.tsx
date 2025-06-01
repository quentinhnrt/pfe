import { Metadata } from "next";
import { siteConfig } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Portfolio Settings",
    description: "Manage your portfolio template and customization settings", 
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${siteConfig.url}/settings/portfolio`,
    },
  };
}

export default function PortfolioSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}