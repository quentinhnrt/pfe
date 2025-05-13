import {sendMagicLink} from "@/lib/auth/magiclink";
import prisma from "@/lib/prisma";
import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {customSession, magicLink} from "better-auth/plugins";
import {getServerUrl} from "./server-url";
import {generateRandomString} from "better-auth/crypto";
import {User} from "@prisma/client";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: getServerUrl(),
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
        customSession(async ({user, session}) => {
            const prismaUser: User | null = await prisma.user.findFirst({
                where: {id: user.id},
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
            }
        },
    },
    databaseHooks: {
        user: {
            create: {
                // @ts-expect-error it works
                async before(user) {
                    user.name = 'user_' + generateRandomString(10);
                    return user
                }
            }
        }
    }
});

export type Session = typeof auth.$Infer.Session