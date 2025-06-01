"use client";

import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { Session } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useTranslations} from "next-intl";

export default function UserHeader({ session }: { session: Session }) {
  const router = useRouter();
  const s = useTranslations("feature.social");

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="cursor-pointer hover:!bg-transparent focus-visible:ring-0"
        >
          <div className={"flex items-center gap-3"}>
            {session.user.image ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-gray-200">
                <Image
                  src={session.user.image}
                  alt={session.user.firstname || ""}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center font-semibold rounded-xl">
                {session.user.firstname?.charAt(0) || "U"}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium">
                {session.user.firstname || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {s("my-profile")}
              </p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href={`/user/${session.user.id}`} className="w-full">
            {s("my-profile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSignOut()}
          className="text-red-600"
        >
            {s("disconnect")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
