'use client';

import {useEffect, useRef, useState, useCallback} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";
import {Card, CardContent, CardTitle} from "@/components/ui/shadcn/card";

type Artwork = {
    id: number;
    title: string;
    thumbnail: string;
    user: {
        id: string;
        firstname?: string;
        lastname?: string;
        image?: string;
        createdAt: string;
    };
};

interface ArtworksFeedProps {
    isAuthenticated?: boolean;
}

export default function ArtworksFeed({isAuthenticated = false}: ArtworksFeedProps) {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const fetchArtworks = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const res = await fetch('/api/artworks?limit=10&page=1');

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data: Artwork[] = await res.json();
            setArtworks(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erreur inconnue');
            setArtworks([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchArtworks();
    }, [fetchArtworks]);

    const updateScrollButtons = useCallback(() => {
        if (scrollRef.current) {
            const {scrollLeft, scrollWidth, clientWidth} = scrollRef.current;
            const tolerance = 1;

            setCanScrollLeft(scrollLeft > tolerance);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - tolerance);
        }
    }, []);

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', updateScrollButtons);
            setTimeout(updateScrollButtons, 100);
            return () => scrollElement.removeEventListener('scroll', updateScrollButtons);
        }
    }, [updateScrollButtons, artworks.length]);

    const scrollBy = (distance: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: distance,
                behavior: 'smooth',
            });
        }
    };

    const LoadingSkeleton = () => (
        <div
            className={`${isAuthenticated ? 'flex gap-4 px-6' : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6'}`}>
            {[...Array(isAuthenticated ? 6 : 8)].map((_, i) => (
                <div key={i} className={`${isAuthenticated ? 'flex-shrink-0 w-56' : ''} animate-pulse`}>
                    <div className="bg-gray-200 rounded-xl h-48 mb-3"></div>
                    <div className="space-y-2">
                        <div className="bg-gray-200 h-3 rounded-full"></div>
                        <div className="bg-gray-200 h-3 rounded-full w-2/3"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (isLoading) {
        return (
            <section className="py-8 bg-white">
                <div className="px-6 mb-6">
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">
                        Œuvres à découvrir
                    </h2>
                    <p className="text-gray-600">
                        {isAuthenticated ? 'Naviguez dans notre sélection d\'œuvres' : 'Explorez notre galerie d\'art'}
                    </p>
                </div>
                <LoadingSkeleton/>
            </section>
        );
    }

    if (artworks.length === 0) {
        return (
            <section className="py-8 bg-white">
                <div className="px-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">
                        Œuvres à découvrir
                    </h2>
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Aucune œuvre disponible pour le moment</p>
                        <button
                            onClick={fetchArtworks}
                            className="px-6 py-3 bg-black text-white hover:bg-gray-800 rounded-xl transition-colors duration-300 font-medium"
                        >
                            Actualiser
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <Card className="overflow-hidden bg-transparent border-0 shadow-none">
            <CardTitle>
                <div className="px-6 mb-6">

                    <h2 className="text-2xl font-bold mb-2">
                        Œuvres à découvrir
                    </h2>
                    <p className={"font-normal"}>
                        {isAuthenticated ? 'Naviguez dans notre sélection d\'œuvres' : 'Explorez notre galerie d\'art'}
                    </p>
                </div>
            </CardTitle>

            <CardContent>
                {isAuthenticated ? (

                    <div className="relative group">
                        {canScrollLeft && (
                            <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110"
                                onClick={() => scrollBy(-240)}
                                aria-label="Précédent"
                            >
                                <ChevronLeft size={20} strokeWidth={2.5}/>
                            </button>
                        )}

                        {canScrollRight && (
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110"
                                onClick={() => scrollBy(240)}
                                aria-label="Suivant"
                            >
                                <ChevronRight size={20} strokeWidth={2.5}/>
                            </button>
                        )}
                        <div
                            className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white dark:from-black to-transparent z-20 pointer-events-none"></div>
                        <div
                            className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white dark:from-black to-transparent z-20 pointer-events-none"></div>
                        <div
                            ref={scrollRef}
                            className="flex gap-4 px-6 overflow-x-auto scrollbar-hide scroll-smooth"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                            }}
                        >
                            {artworks.map((artwork, index) => (
                                <Link
                                    href={"/user/" + artwork.user.id}
                                    key={artwork.id}
                                    className="flex-shrink-0 w-56 cursor-pointer group/card"
                                    style={{animationDelay: `${index * 50}ms`}}
                                >
                                    <div
                                        className="relative overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                        <div className="relative h-48 overflow-hidden">
                                            {artwork.thumbnail && artwork.thumbnail.trim() !== "" ? (
                                                <Image
                                                    src={artwork.thumbnail}
                                                    alt={artwork.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                                                />
                                            ) : (
                                                <div className="bg-gray-200 w-full h-full"/>
                                            )}
                                            <div
                                                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transform translate-y-full group-hover/card:translate-y-0 transition-transform duration-400 ease-out">
                                                <div className="p-4 text-center">
                                                    <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">
                                                        {artwork.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6">
                        {artworks.map((artwork, index) => (
                            <div
                                key={artwork.id}
                                className="border border-gray-100 rounded-xl overflow-hidden cursor-pointer group/card hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                                style={{animationDelay: `${index * 50}ms`}}
                            >
                                <div className="relative h-40 overflow-hidden">
                                    {artwork.thumbnail && artwork.thumbnail.trim() !== "" ? (
                                        <Image
                                            src={artwork.thumbnail}
                                            alt={artwork.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                                        />
                                    ) : (
                                        <div className="bg-gray-200 w-full h-full"/>
                                    )}
                                    <div
                                        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transform translate-y-full group-hover/card:translate-y-0 transition-transform duration-400 ease-out">
                                        <div className="p-3 text-center">
                                            <h3 className="font-medium text-white text-xs line-clamp-1">
                                                {artwork.title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    background: transparent;
                }

                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </Card>
    );
}
