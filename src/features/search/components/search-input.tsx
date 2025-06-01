"use client";

import { Input } from "@/components/ui/shadcn/input";
import { Loader2, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
  placeholder?: string;
  maxWidth?: string;
};

export default function SearchInput({
  value,
  onChange,
  delay = 500,
  placeholder,
  maxWidth = "42rem",
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const s = useTranslations("feature.search");

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
    <div className="relative w-full flex justify-center">
      <div className="relative group w-full" style={{ maxWidth }}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          {isLoading ? (
            <Loader2 size={20} className="text-gray-500 animate-spin" />
          ) : (
            <Search
              size={20}
              className="text-gray-500 group-focus-within:text-gray-400 transition-colors duration-300"
            />
          )}
        </div>
        <Input
          type="text"
          name="query"
          placeholder={placeholder || s("placeholders.artists")}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const form = e.currentTarget.closest("form");
              if (form) form.requestSubmit();
            }
          }}
          className="
            w-full h-14 pl-12 pr-14
            backdrop-blur-md
            rounded-2xl
            transition-all duration-300
            shadow-md hover:shadow-lg focus:shadow-xl
            dark:shadow-black/20 shadow-gray-200/50
            font-medium
            border-gray-200 dark:border-gray-800
            focus:border-gray-300 dark:focus:border-gray-700
          "
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300"
            aria-label={s("aria.clear-search")}
          >
            <X size={16} className="text-gray-700 dark:text-gray-200" />
          </button>
        )}

        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none blur-sm"></div>
      </div>
    </div>
  );
}
