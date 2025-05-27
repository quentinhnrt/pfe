import { ArrowLeftIcon } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import OnBoardingForm from "@/features/on-boarding/on-boarding-form";
import { auth } from "@/lib/auth";
import {Metadata} from "next";

 export const metadata: Metadata = {
   title: "Complétez votre profil | Artilink",
   description:
     "Complétez votre profil pour profiter pleinement de l'expérience Artilink",
   openGraph: {
     title: "Complétez votre profil | Artilink",
     description:
       "Complétez votre profil pour profiter pleinement de l'expérience Artilink",
     images: [
       {
         url: "/signin.jpg",
         width: 1200,
         height: 630,
         alt: "Artilink - Complétez votre profil",
       },
     ],
   },
 };

export default async function OnBoardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user || session.user.onBoarded) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 flex">
        <div className="hidden md:flex md:w-2/6 bg-muted relative">
          <Image
            src="/signin.jpg"
            alt="Image décorative représentant l'art"
            width={800}
            height={800}
            className="absolute inset-0 w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/10 flex flex-col justify-end p-8 text-white">
            <h1 className="text-2xl font-bold mb-2">Artilink</h1>
            <p className="text-sm">Shape your identity, illuminate your art.</p>
          </div>
        </div>

        <div className="relative w-full md:w-4/5 flex items-center justify-center p-4 md:p-8">
          <Link
            href="/"
            className="absolute top-4 left-3 flex items-center gap-2 z-50 text-sm leading-none font-medium p-2 hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            <span>Retour à l&apos;accueil</span>
          </Link>

          <div
            className="w-full max-w-md"
            role="region"
            aria-label="Formulaire de configuration de profil"
          >
            <OnBoardingForm user={session.user} />
          </div>
        </div>
      </div>
    </main>
  );
}
