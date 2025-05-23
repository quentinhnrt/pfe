'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

type Artwork = {
  id: number;
  title: string;
  thumbnail: string;
};

export default function ArtworksFeed() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchArtworks = useCallback(async () => {
    try {
      const res = await fetch('/api/artworks');
      const data: Artwork[] = await res.json();
      setArtworks(data);
    } catch (error) {
      console.error('Erreur lors du chargement des artworks:', error);
    }
  }, []);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  const scrollBy = (distance: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: distance,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <style>{`
        .artwork-scroller-wrapper {
          position: relative;
          background-color: #000;
          padding: 1rem 2rem;
        }

        .artwork-scroller {
          display: flex;
          overflow-x: auto;
          gap: 1rem;
          scroll-snap-type: x mandatory;
          scrollbar-width: thin;
          scroll-behavior: smooth;
        }

        .artwork-item {
          scroll-snap-align: start;
          width: 220px;
          height: 180px;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s ease;
          background-color: #1a1a1a;
          box-shadow: 0 4px 6px -1px rgba(255, 255, 255, 0.05), 0 2px 4px -1px rgba(255, 255, 255, 0.04);
          color: white;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          flex-shrink: 0;
        }

        .artwork-item:hover {
          transform: translateY(-5px);
        }

        .artwork-item img {
          width: 100%;
          height: 140px;
          object-fit: cover;
          background-color: #333;
        }

        .artwork-item .title {
          padding: 8px 12px;
          flex-grow: 1;
          display: flex;
          align-items: center;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .carousel-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
          z-index: 10;
        }

        .carousel-button:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }

        .carousel-button.left {
          left: 8px;
        }

        .carousel-button.right {
          right: 8px;
        }
      `}</style>

      <section className="py-6 px-4 bg-black text-white">
        <h2 className="text-xl font-bold mb-4">Artworks à découvrir</h2>

        <div className="artwork-scroller-wrapper">
          <button
            className="carousel-button left"
            onClick={() => scrollBy(-240)}
            aria-label="Scroll Left"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="artwork-scroller" ref={scrollRef}>
            {artworks.map((artwork) => (
              <div key={artwork.id} className="artwork-item">
                {artwork.thumbnail ? (
                  <Image
                    src={artwork.thumbnail}
                    alt={artwork.title}
                    width={220}
                    height={140}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '140px',
                      backgroundColor: '#444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#aaa',
                      fontSize: '0.8rem',
                    }}
                  >
                    Pas d&apos;image
                  </div>
                )}
                <div className="title">{artwork.title}</div>
              </div>
            ))}
          </div>

          <button
            className="carousel-button right"
            onClick={() => scrollBy(240)}
            aria-label="Scroll Right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>
    </>
  );
}
