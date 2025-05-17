import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import {Prisma} from "@prisma/client";

export type UserFromApi = Prisma.UserGetPayload<{
    include: {
        posts: {
            include: { artworks: true; question: { include: { answers: true } } };
        };
        followers: true;
        following: true;
        user_template: {
            include: { template: true };
        };
    };
}>;

export async function getCurrentUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return null;
    }

    return session.user
}

export async function getUserById(id: string): Promise<UserFromApi> {
    const userResponse = await fetch(
        process.env.BETTER_AUTH_URL + "/api/user/" + id
    );

    return await userResponse.json();
}

export async function getUserByUsername(username: string): Promise<UserFromApi> {
    const userResponse = await fetch(
        process.env.BETTER_AUTH_URL + "/api/user/username/" + username
    );

    return await userResponse.json();
}