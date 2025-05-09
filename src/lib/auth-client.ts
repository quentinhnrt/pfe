import { auth } from "@/lib/auth";
import { getServerUrl } from "@/lib/server-url";
import {
  inferAdditionalFields,
  magicLinkClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: getServerUrl(),
  plugins: [magicLinkClient(), inferAdditionalFields<typeof auth>()],
});
