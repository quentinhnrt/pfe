"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Search, Loader2 } from "lucide-react";  // <--- Loader2 ajouté ici

interface Artwork {
  id: number;
  title: string;
  thumbnail: string;
}

interface ArtworkGallerySelectorProps {
  name: string;
  label?: string;
  initialSelectedIds?: number[];
  onChange?: (selectedIds: number[]) => void;
}

export function ArtworkGallerySelector({
  name,
  label = "Select Artworks",
  initialSelectedIds = [],
  onChange,
}: ArtworkGallerySelectorProps) {
  const { control, setValue, watch } = useFormContext();
  const selectedIds: number[] = watch(name, initialSelectedIds) || [];

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(0);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        perPage: "5",
        page: page.toString(),
        title: debouncedSearchTerm,
      });

      const response = await fetch("/api/me/artworks?" + params.toString());
      const data = await response.json();

      const fetchedArtworks = data.artworks as Artwork[];

      if (page === 0) {
        setArtworks(fetchedArtworks);
      } else {
        setArtworks((prev) => [...prev, ...fetchedArtworks]);
      }

      setHasMore(fetchedArtworks.length === 5);
      setLoading(false);
    };

    fetchArtworks();
  }, [debouncedSearchTerm, page]);

  const loadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    setPage((prev) => prev + 1);
  };

  const toggleSelection = (id: number) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setValue(name, updated);
    onChange?.(updated);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <FormItem>
          <FormLabel className="flex items-center justify-between">
            {label}
            <div className="relative w-64">
              <input
                type="search"
                placeholder="Chercher par titre"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded border border-gray-300 pl-10 pr-3 py-2 text-black placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                aria-label="Chercher par titre"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
          </FormLabel>
          <FormControl>
            <div className="mt-4 rounded-md border">
              <Table>
                <TableBody>
                  {artworks.map((artwork) => (
                    <TableRow key={artwork.id}>
                      <TableCell className="w-[40px] text-center">
                        <Checkbox
                          checked={selectedIds.includes(artwork.id)}
                          onCheckedChange={() => toggleSelection(artwork.id)}
                          aria-label={`Select ${artwork.title}`}
                        />
                      </TableCell>
                      <TableCell className="w-[60px]">
                        <Image
                          src={artwork.thumbnail}
                          alt={artwork.title}
                          width={48}
                          height={48}
                          className="aspect-square rounded object-cover"
                        />
                      </TableCell>
                      <TableCell>{artwork.title}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {loading && (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                </div>
              )}

              {hasMore && (
                <div className="p-4 text-center">
                  <Button onClick={loadMore} variant="outline">
                    Charger plus
                  </Button>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
