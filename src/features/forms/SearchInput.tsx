"use client";

import { Input } from "@/components/ui/shadcn/input";
import { useEffect, useState } from "react";

type SearchInputProps = {
  onSearch: (query: string) => void;
  delay?: number;
  onDebounceChange?: (value: boolean) => void;
};

export default function SearchInput({
  onSearch,
  delay = 500,
  onDebounceChange,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    if (onDebounceChange) {
      onDebounceChange(false);
    }
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
      if (onDebounceChange) {
        onDebounceChange(true);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [inputValue, delay, onDebounceChange]);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className="w-full w-40">
      <Input
        type="text"
        placeholder="Rechercher..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full h-12 rounded-full border border-white-300 bg-gray-300 p-2"
      />
    </div>
  );
}
