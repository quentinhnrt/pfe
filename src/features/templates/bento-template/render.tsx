import { UserFromApi } from "@/lib/users";
import { z } from "zod";
import { templateSchema } from "@/features/templates/bento-template/settings";
import { getCollectionsFromFieldValue } from "@/lib/collections";
import BentoCollectionGrid from "@/features/templates/bento-template/components/bento-collection-grid";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import LenisWrapper from "@/features/templates/bento-template/components/lenis-wrapper";
import ReactLenis from "lenis/react";
import { Button } from "@/components/ui/shadcn/button";

export default async function Render({
  data,
  user,
}: {
  user: UserFromApi;
  data: z.infer<typeof templateSchema>;
}) {
  if (!data.collections) {
    return;
  }

  const collections = await getCollectionsFromFieldValue(
    data.collections,
    user.id
  );

  return (
    <>
      <ReactLenis root options={{ smoothWheel: true, duration: 4 }} />
      <LenisWrapper>
        <div className={"w-full mx-auto p-4"}>
          <section className="flex items-center justify-center min-h-screen">
            <div className="container px-4 mx-auto">
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div className="flex flex-col space-y-6 order-2 md:order-1">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-9xl text-center lg:text-left">
                    {user.firstname}{" "}
                    <span className="text-primary">{user.lastname}</span>
                  </h1>

                  {data.description && (
                    <p className="max-w-[600px] text-muted-foreground text-lg md:text-2xl text-center lg:text-left">
                      {data.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                    {data.contactInfos.mail && (
                      <Button>
                        <Link
                          href={`mailto:${data.contactInfos.mail}`}
                          className="flex items-center gap-2 px-4 py-2 transition-colors rounded-full"
                        >
                          <Mail className="w-5 h-5" />
                          <span className="sr-only md:not-sr-only md:inline">
                            Email
                          </span>
                        </Link>
                      </Button>
                    )}

                    {data.contactInfos.instagram && (
                      <Button>
                        <Link
                          href={`https://instagram.com/${data.contactInfos.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 transition-colors rounded-full"
                        >
                          <Instagram className="w-5 h-5" />
                          <span className="sr-only md:not-sr-only md:inline">
                            Instagram
                          </span>
                        </Link>
                      </Button>
                    )}

                    {data.contactInfos.twitter && (
                      <Button>
                        <Link
                          href={`https://twitter.com/${data.contactInfos.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 transition-colors rounded-full "
                        >
                          <Twitter className="w-5 h-5" />
                          <span className="sr-only md:not-sr-only md:inline">
                            Twitter
                          </span>
                        </Link>
                      </Button>
                    )}

                    {data.contactInfos.facebook && (
                      <Button>
                        <Link
                          href={`https://facebook.com/${data.contactInfos.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 transition-colors rounded-full"
                        >
                          <Facebook className="w-5 h-5" />
                          <span className="sr-only md:not-sr-only md:inline">
                            Facebook
                          </span>
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex justify-center order-1 md:order-2">
                  <div className="relative w-64 h-64 overflow-hidden rounded-full sm:w-80 sm:h-80 md:w-96 md:h-96 ring-4 ring-primary/20">
                    <Image
                      src={user.image || "/placeholder.svg"}
                      alt={`${user.firstname} ${user.lastname}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <a href="#collections">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-primary animate-bounce"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20m0 0l-7-7m7 7l7-7" />
                </svg>
              </a>
            </div>
          </section>

          <section id={"collections"} className={"space-y-16 lg:space-y-32 "}>
            {collections.map((collection) => (
              <div key={"collection-" + collection.id} className="min-h-screen">
                <BentoCollectionGrid collection={collection} />
              </div>
            ))}
          </section>
        </div>
      </LenisWrapper>
    </>
  );
}
