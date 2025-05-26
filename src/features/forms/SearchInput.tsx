"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
};

export default function SearchInput({ value, onChange, delay = 500 }: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (inputValue !== value) {
      setIsLoading(true);
    }

    const handler = setTimeout(() => {
      if (inputValue !== value) {
        onChange(inputValue);
        setIsLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
      setIsLoading(false);
    };
  }, [inputValue, delay, onChange, value]);

  const handleClear = () => {
    setInputValue("");
    onChange("");
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          {isLoading ? (
            <Loader2 size={20} className="text-gray-500 animate-spin" />
          ) : (
            <Search size={20} className="text-gray-500 group-focus-within:text-gray-400 transition-colors duration-300" />
          )}
        </div>
        <Input
          type="text"
          placeholder="Rechercher des artistes, œuvres..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="
            w-full h-14 pl-12 pr-12 
            text-black placeholder:text-gray-500 
            backdrop-blur-md 
            border-2 border-gray-700/50 
            rounded-2xl 
            focus:border-gray-600/70 focus:ring-0 focus:ring-offset-0
            hover:border-gray-600/60
            transition-all duration-300
            shadow-xl shadow-black/20
            font-medium
          "
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/50 hover:bg-gray-600/70 transition-all duration-300 group/btn"
            aria-label="Effacer la recherche"
          >
            <X size={16} className="text-white group-hover/btn:text-white transition-colors duration-300" />
          </button>
        )}

        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none blur-sm"></div>
      </div>

      {isLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gray-600 to-gray-500 animate-pulse"></div>
        </div>
      )}

    </div>
  );
}