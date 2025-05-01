import {inferAdditionalFields, magicLinkClient} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import {auth} from "@/shared/lib/auth";
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [magicLinkClient(), inferAdditionalFields<typeof auth>()],
});
