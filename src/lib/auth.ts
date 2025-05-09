import { sendMagicLink } from "@/lib/auth/magiclink";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession, magicLink } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
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
    },
  },
});
