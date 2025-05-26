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
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface Collection {
  id: number;
  title: string;
}

interface CollectionSelectorProps {
  name: string;
  label?: string;
  initialSelectedIds?: number[];
  onChange?: (selectedIds: number[]) => void;
}

export function CollectionSelector({
  name,
  label = "Sélectionner des collections",
  initialSelectedIds = [],
  onChange,
}: CollectionSelectorProps) {
  const { control, setValue, watch } = useFormContext();
  const selectedIds: number[] = watch(name, initialSelectedIds) || [];

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Debounce la recherche
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(0);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);

      const params = {
        perPage: "20",
        page: page.toString(),
        collections: initialSelectedIds.join(),
        title: debouncedSearchTerm,
      };

      const searchParams = new URLSearchParams(params);
      const response = await fetch(
        "/api/me/collections?" + searchParams.toString()
      );
      const data = await response.json();

      const newCollections = [...data.initialCollections, ...data.collections];

      // Supprimer les doublons
      const uniqueMap = new Map<number, Collection>();
      const all = [...(page === 0 ? [] : collections), ...newCollections];
      all.forEach((col) => uniqueMap.set(col.id, col));

      const sorted = Array.from(uniqueMap.values()).sort((a, b) => {
        const aSelected = selectedIds.includes(a.id) ? 0 : 1;
        const bSelected = selectedIds.includes(b.id) ? 0 : 1;
        return aSelected - bSelected;
      });

      setCollections(sorted);
      setHasMore(data.collections.length > 0);
      setLoading(false);
    };

    fetchCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, page]);

  const toggleSelection = (id: number) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setValue(name, updated);

    if (onChange) {
      onChange(updated);
    }
  };

  const loadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    setPage((prev) => prev + 1);
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
                    <TableHead>Titre</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedIds.includes(collection.id)}
                          onCheckedChange={() => toggleSelection(collection.id)}
                          aria-label={`Select ${collection.title}`}
                        />
                      </TableCell>
                      <TableCell>{collection.title}</TableCell>
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
          {loading && <p className="text-muted-foreground">Chargement…</p>}
        </FormItem>
      )}
    />
  );
}
