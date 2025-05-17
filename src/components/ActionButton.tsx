"use client";

import { Button } from "@/components/ui/button";
import PostForm from "@/features/forms/PostForm";
import { authClient } from "@/lib/auth-client";
import { Palette, Plus, SquarePen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CollectionForm from "@/features/forms/CollectionForm";
import ArtworkForm from "@/features/forms/ArtworkForm";

export default function ActionButton() {
  const [open, setOpen] = useState(false);
  const actionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (evt: MouseEvent) => {
      if (
        actionRef.current &&
        evt.target instanceof Node &&
        actionRef.current.contains(evt.target)
      ) {
        return;
      }

      setOpen(false);
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const { data: session } = authClient.useSession();

  if (!session || !session.user || session.user.role !== "ARTIST") {
    return;
  }

  return (
    <div ref={actionRef} className={"fixed right-12 bottom-12"}>
      <Button
        onClick={() => setOpen(!open)}
        variant={"outline"}
        className={
          "flex aspect-square h-12 cursor-pointer items-center justify-center rounded-full border-black/50 bg-white"
        }
      >
        <Plus
          className={"w-5 text-black duration-500 " + (open ? "rotate-45" : "")}
        />
      </Button>

      <div
        className={
          "absolute -top-4 right-0 flex w-fit -translate-y-full flex-col items-end gap-4" +
          (open ? " block" : " hidden")
        }
      >
        <ArtworkForm>
          <div className={"flex size-max cursor-pointer items-center gap-4"}>
            <p>Créer une oeuvre</p>

            <Button
              variant={"outline"}
              className={
                "flex aspect-square h-12 cursor-pointer items-center justify-center rounded-full border-black/50 bg-white"
              }
            >
              <Palette />
            </Button>
          </div>
        </ArtworkForm>
        <PostForm>
          <div className={"flex size-max cursor-pointer items-center gap-4"}>
            <p>Créer un post</p>

            <Button
              variant={"outline"}
              className={
                "flex aspect-square h-12 cursor-pointer items-center justify-center rounded-full border-black/50 bg-white"
              }
            >
              <SquarePen />
            </Button>
          </div>
        </PostForm>
        <CollectionForm>
          <div className={"flex size-max cursor-pointer items-center gap-4"}>
            <p>Créer une collection</p>

            <Button
                variant={"outline"}
                className={
                  "flex aspect-square h-12 cursor-pointer items-center justify-center rounded-full border-black/50 bg-white"
                }
            >
              <SquarePen />
            </Button>
          </div>
        </CollectionForm>
      </div>
    </div>
  );
}
