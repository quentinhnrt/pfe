import { Artwork } from "@prisma/client";
import { Pen } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import ArtworkForm from "@/features/forms/ArtworkForm";
import PostForm from "@/features/forms/PostForm";
import { auth } from "@/lib/auth";

// export const metadata: Metadata = {
//     title:
//     description:
//     openGraph: {
//       title:
//       description:
//       images:
//     },
//   }

export default async function FormsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/");
  }

  const artworks: Artwork[] = [];

  return (
    <div className={"w-[1200px] mx-auto space-y-8 mt-12"}>
      <div>
        <ArtworkForm />
      </div>

      <div className={"grid grid-cols-3 gap-8 w-1/2"}>
        {artworks.length &&
          artworks.map((artwork: Artwork) => (
            <div key={artwork.id} className={"relative"}>
              <Image
                src={artwork.thumbnail}
                alt={artwork.title}
                width={300}
                height={300}
                className={"aspect-square w-full object-cover"}
              />
              <div className={"absolute bottom-4 right-4"}>
                <ArtworkForm artwork={artwork}>
                  <div
                    className={
                      "bg-white rounded-full w-12 h-12 p-2 flex items-center justify-center cursor-pointer"
                    }
                  >
                    <Pen />
                  </div>
                </ArtworkForm>
              </div>
            </div>
          ))}
      </div>

      <div>
        <PostForm />
      </div>
    </div>
  );
}
