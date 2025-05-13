"use client";

import { Button } from "@/components/ui/button";
import { UserFromApi } from "@/lib/users";
import { User } from "@prisma/client";
import { useTransition, useState } from "react";
import { toast } from "sonner";

type Props = {
    user: UserFromApi;
    currentUser: User | undefined;
};

export default function FollowButton({ user, currentUser }: Props) {
    const [isPending, startTransition] = useTransition();

    const [isFollowing, setIsFollowing] = useState(() =>
        user.followers.some((f) => f.followerId === currentUser?.id)
    );

    const isSelf = user.id === currentUser?.id;
    const targetIsArtist = user.role === "ARTIST";
    const canFollow = !isSelf && targetIsArtist && currentUser;

    if (!targetIsArtist || isSelf) return;

    const handleClick = () => {
        if (!currentUser) {
            toast.error("Connecte-toi pour suivre quelqu’un.");
            return;
        }

        if (!canFollow) return;

        startTransition(async () => {
            const res = await fetch(`/api/user/${user.id}/follow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ followerId: currentUser.id }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                toast.error(error || "Une erreur est survenue.");
                return;
            }

            const data = await res.json();
            setIsFollowing(data.followed);
        });
    };

    const label = isFollowing
                ? "Ne plus suivre"
                : "Suivre";

    return (
        <Button
            variant={isFollowing ? "secondary" : "default"}
            disabled={!canFollow || isPending}
            onClick={handleClick}
        >
            {isPending ? "..." : label}
        </Button>
    );
}
