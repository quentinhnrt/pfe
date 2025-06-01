"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent, CardTitle } from "@/components/ui/shadcn/card";
import ArtworkCard from "@/features/artwork/components/artwork-card";
import ArtworkDetailsDialog from "@/features/artwork/components/artwork-details-dialog";
import { Artwork, User } from "@prisma/client";
import { ArrowLeft, ArrowRight, CompassIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import required modules
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";

type ArtworkWithUser = Artwork & {
  user: User;
};

type ArtworksFeedProps = {
  isAuthenticated?: boolean;
};

export default function ArtworksFeed({
  isAuthenticated = false,
}: ArtworksFeedProps) {
  const [artworks, setArtworks] = useState<ArtworkWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedArtwork, setSelectedArtwork] =
    useState<ArtworkWithUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Références pour les boutons de navigation personnalisés
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const a = useTranslations("feature.artwork.feed");
  const c = useTranslations("commons.buttons");

  const fetchArtworks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/artworks?limit=12&page=1");
      if (!res.ok) throw new Error("Failed to fetch artworks");
      const data = await res.json();
      setArtworks(data);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  const handleArtworkClick = (artwork: ArtworkWithUser) => {
    setSelectedArtwork(artwork);
    setDialogOpen(true);
  };

  return (
    <Card className="rounded-lg mb-8 border-0 shadow-none bg-transparent">
      <CardTitle className="p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{a("title")}</h2>
          <p className="text-muted-foreground">
            {isAuthenticated ? a("description-auth") : a("description-guest")}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/explore">
            <Button variant="outline" className="gap-2">
              <CompassIcon size={16} />
              <span>{c("explore")}</span>
            </Button>
          </Link>
        </div>
      </CardTitle>

      <CardContent className="pb-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">{a("no-artworks")}</p>
          </div>
        ) : (
          <div className="relative swiper-container px-2">
            {/* Boutons de navigation personnalisés */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
              <Button
                ref={prevRef}
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white dark:bg-black/80 dark:hover:bg-black p-3 h-auto w-auto"
                aria-label="Previous"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <Button
                ref={nextRef}
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white dark:bg-black/80 dark:hover:bg-black p-3 h-auto w-auto"
                aria-label="Next"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            <Swiper
              grabCursor={true}
              centeredSlides={false}
              spaceBetween={16}
              slidesPerView="auto"
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onInit={(swiper) => {
                // @ts-expect-error - Nécessaire pour accéder aux paramètres de navigation
                swiper.params.navigation.prevEl = prevRef.current;
                // @ts-expect-error - Nécessaire pour accéder aux paramètres de navigation
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1.15,
                  spaceBetween: 8,
                },
                480: {
                  slidesPerView: 1.3,
                  spaceBetween: 10,
                },
                640: {
                  slidesPerView: 2.1,
                  spaceBetween: 12,
                },
                768: {
                  slidesPerView: 2.2,
                  spaceBetween: 16,
                },
                1024: {
                  slidesPerView: 3.2,
                  spaceBetween: 16,
                },
                1280: {
                  slidesPerView: 4.2,
                  spaceBetween: 16,
                },
              }}
              modules={[Pagination, Navigation, Autoplay, EffectCoverflow]}
              className="artwork-swiper px-8"
            >
              {artworks.map((artwork) => (
                <SwiperSlide key={artwork.id} className="h-auto py-2">
                  <ArtworkCard
                    artwork={artwork}
                    onClick={handleArtworkClick}
                    className="h-full w-full shadow-sm"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </CardContent>

      <ArtworkDetailsDialog
        artwork={selectedArtwork}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .artwork-card-container {
          transition: transform 0.3s ease;
        }

        .artwork-card-container:hover {
          transform: translateY(-5px);
        }

        .artwork-swiper {
          padding: 16px 0 40px 0;
        }

        .swiper-slide {
          width: auto;
          height: auto;
          transition: all 0.3s ease;
          opacity: 1;
          display: flex;
          align-items: stretch;
          height: auto !important;
        }

        /* Masquer les boutons de navigation par défaut de Swiper */
        .swiper-button-next,
        .swiper-button-prev {
          display: none;
        }

        /* Styles pour les pagination bullets */
        .swiper-pagination {
          position: absolute;
          bottom: 0px !important;
        }

        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(100, 100, 100, 0.5);
          transition: all 0.3s ease;
          opacity: 0.5;
        }

        .swiper-pagination-bullet-active {
          background: #333;
          transform: scale(1.2);
          width: 10px;
          height: 10px;
          opacity: 1;
        }

        /* Correction pour les couleurs d'indicateur */
        .swiper-pagination-bullet {
          background-color: rgba(100, 100, 100, 0.5) !important;
        }

        .swiper-pagination-bullet-active {
          background-color: #333 !important;
        }

        /* Dark mode adjustments */
        .dark .swiper-pagination-bullet {
          background-color: rgba(200, 200, 200, 0.5) !important;
        }

        .dark .swiper-pagination-bullet-active {
          background-color: #fff !important;
        }

        /* Responsive adjustments pour les cartes */
        @media (max-width: 640px) {
          .artwork-card-container {
            padding: 8px;
          }
        }
      `}</style>
    </Card>
  );
}
