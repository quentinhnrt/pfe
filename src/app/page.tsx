import SearchArtist from "@/components/SearchArtist";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import PostFeed from "@/components/PostFeed";

export default async function Home() {
  const t = await getTranslations("HomePage");
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <h1>{t("title")}</h1>
      <Button>Test</Button>
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <Image
          className="dark:invert"
          src="/logo.svg"
          alt="Artilink logo"
          width={180}
          height={38}
          priority
        />
        {!session && (
          <div>
            <Link
              href={"/sign-in"}
              className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:w-auto sm:px-5 sm:text-base md:w-[158px] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            >
              S&#39;inscrire / Se connecter
            </Link>
          </div>
        )}

        {session && session.user && (
            <div>
                <Link
                    href={"/user/" + session.user.id}
                    className={"flex flex-col items-center"}
                >
                    {session.user.image && (
                        <Image
                            src={session.user.image}
                            alt={session.user.firstname ?? ""}
                            width={200}
                            height={200}
                            className={"rounded-full"}
                        />
                    )}
                    <p className={"mt-4 text-center text-3xl font-semibold"}>
                        {session.user.firstname}
                    </p>
                </Link>

                <PostFeed />
            </div>

        )}

        <SearchArtist />
      </main>
    </div>
  );
}
