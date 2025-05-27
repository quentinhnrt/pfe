/* eslint-disable jsx-a11y/alt-text */
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/shadcn/button";
import PostForm from "@/features/forms/PostForm";
import ArtworkForm from "@/features/forms/ArtworkForm";
import CollectionForm from "@/features/forms/CollectionForm";
import { Plus, Image, FileText, FolderPlus } from "lucide-react";


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
        className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <Plus 
          size={18} 
          className={`transition-transform duration-300 ${open ? 'rotate-45' : 'rotate-0'}`}
        />
        <span>Publier</span>
      </Button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-3 w-64 rounded-2xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200"
        >
          <div className="py-3 px-2">
            <ArtworkForm>
              <Button 
                variant="ghost" 
                className="w-full justify-start px-4 py-3 mb-1 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-xl group-hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 flex-shrink-0">
                    <Image size={20} className="text-gray-700" />
                  </div>
                  <span className="text-gray-900 font-medium">Créer une œuvre</span>
                </div>
              </Button>
            </ArtworkForm>
            <PostForm>
              <Button 
                variant="ghost" 
                className="w-full justify-start px-4 py-3 mb-1 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-xl group-hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 flex-shrink-0">
                    <FileText size={20} className="text-gray-700" />
                  </div>
                  <span className="text-gray-900 font-medium">Créer un post</span>
                </div>
              </Button>
            </PostForm>
            <CollectionForm>
              <Button 
                variant="ghost" 
                className="w-full justify-start px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-xl group-hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 flex-shrink-0">
                    <FolderPlus size={20} className="text-gray-700" />
                  </div>
                  <span className="text-gray-900 font-medium">Créer une collection</span>
                </div>
              </Button>
            </CollectionForm>
          </div>
        </div>
      )}
    </div>
  );
}