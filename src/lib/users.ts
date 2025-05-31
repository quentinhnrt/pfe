"use server";

import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { getServerUrl } from "./server-url";

export type UserFromApi = Prisma.UserGetPayload<{
  include: {
    posts: {
      include: {
        artworks: true;
        question: { include: { answers: true } };
        user: true;
      };
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
  });

  if (!session) {
    return null;
  }

  return session.user;
}

export async function getUserById(id: string): Promise<UserFromApi> {
  const userResponse = await fetch(getServerUrl() + "/api/user/" + id);

  return await userResponse.json();
}

export async function getUserByUsername(
  username: string
): Promise<UserFromApi> {
  const userResponse = await fetch(
    getServerUrl() + "/api/user/username/" + username
  );

  return await userResponse.json();
}
