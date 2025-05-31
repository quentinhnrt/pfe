import { sendMagicLink } from "@/lib/auth/magic-link";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { generateRandomString } from "better-auth/crypto";
import { customSession, magicLink } from "better-auth/plugins";
import { getServerUrl } from "./server-url";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: getServerUrl(),
  trustedOrigins: [getServerUrl()],
  plugins: [
    magicLink({
      sendMagicLink: async (data: {
        email: string;
        token: string;
        url: string;
      }) => {
        return sendMagicLink(data);
      },
    }),
    customSession(async ({ user, session }) => {
      const prismaUser: User | null = await prisma.user.findFirst({
        where: { id: user.id },
      });
      return {
        user: prismaUser,
        session,
      };
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
      firstname: {
        type: "string",
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        async before(user) {
          user.name = "user_" + generateRandomString(10);
          return {
            data: user,
          };
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
