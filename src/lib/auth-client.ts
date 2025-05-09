import { createAuthClient } from "better-auth/client";
import {
  inferAdditionalFields,
  magicLinkClient,
} from "better-auth/client/plugins";
import { auth } from "./auth";
export const authClient = createAuthClient({
  plugins: [magicLinkClient(), inferAdditionalFields<typeof auth>()],
});
