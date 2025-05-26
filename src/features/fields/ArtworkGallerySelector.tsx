"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

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

  // Debounce
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

      const params = {
        perPage: "20",
        page: page.toString(),
        artworks: initialSelectedIds.join(),
        title: debouncedSearchTerm,
      };

      const searchParams = new URLSearchParams(params);
      const response = await fetch(
        "/api/me/artworks?" + searchParams.toString()
      );
      const data = await response.json();

      const newArtworks = [...data.initialArtworks, ...data.artworks];

      // Remove duplicates by ID
      const uniqueMap = new Map<number, Artwork>();
      const allArtworks = [...(page === 0 ? [] : artworks), ...newArtworks];
      allArtworks.forEach((art) => uniqueMap.set(art.id, art));

      // Move selected artworks to the top
      const sorted = Array.from(uniqueMap.values()).sort((a, b) => {
        const aSelected = selectedIds.includes(a.id) ? 0 : 1;
        const bSelected = selectedIds.includes(b.id) ? 0 : 1;
        return aSelected - bSelected;
      });

      setArtworks(sorted);
      setHasMore(data.artworks.length > 0);
      setLoading(false);
    };

    fetchArtworks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, page]);

  // @ts-expect-error TODO: fix param e type
  const loadMore = (e) => {
    e.preventDefault();
    setPage((prev) => prev + 1);
  };

  const toggleSelection = (id: number) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setValue(name, updated);

    if (onChange) {
      onChange(updated);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <FormItem>
          <FormLabel className="flex items-center justify-between">
            {label}
            <Input
              type="search"
              className="w-64"
              placeholder="Chercher par titre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormLabel>
          <FormControl>
            <div className="mt-4 rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]" />
                    <TableHead className="w-[60px]">Preview</TableHead>
                    <TableHead>Title</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {artworks.map((artwork) => (
                    <TableRow key={artwork.id}>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedIds.includes(artwork.id)}
                          onCheckedChange={() => toggleSelection(artwork.id)}
                          aria-label={`Select ${artwork.title}`}
                        />
                      </TableCell>
                      <TableCell>
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
          <p>{loading && "loading"}</p>
        </FormItem>
      )}
    />
  );
}
