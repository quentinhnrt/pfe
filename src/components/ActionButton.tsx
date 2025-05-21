"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PostForm from "@/features/forms/PostForm";
import ArtworkForm from "@/features/forms/ArtworkForm";
import CollectionForm from "@/features/forms/CollectionForm";

export default function ActionButton() {
  const [open, setOpen] = useState(false);
  const actionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(evt: MouseEvent) {
      if (
        actionRef.current &&
        evt.target instanceof Node &&
        actionRef.current.contains(evt.target)
      ) {
        return;
      }
      setOpen(false);
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div ref={actionRef} className="relative">
      <Button
        onClick={() => setOpen(!open)}
        className="bg-white text-black px-4 py-2 rounded-full hover:bg-white/80 transition-colors"
      >
        Publier
      </Button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()} // <-- STOP PROPAGATION ICI
          className="absolute right-0 mt-2 w-48 flex flex-col gap-2 rounded border border-gray-700 bg-black p-3 shadow-lg z-50"
        >
          <ArtworkForm>
            <Button variant="ghost" className="w-full text-left">
              Créer une oeuvre
            </Button>
          </ArtworkForm>

          <PostForm>
            <Button variant="ghost" className="w-full text-left">
              Créer un post
            </Button>
          </PostForm>

          <CollectionForm>
            <Button variant="ghost" className="w-full text-left">
              Créer une collection
            </Button>
          </CollectionForm>
        </div>
      )}
    </div>
  );
}
