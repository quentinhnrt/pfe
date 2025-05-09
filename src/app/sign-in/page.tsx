"use client";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<undefined | string>();
  const [success, setSuccess] = useState(false);

  const { data: session } = authClient.useSession();

  if (session) {
    redirect("/");
  }

  async function sendMagicLink() {
    const { data, error } = await authClient.signIn.magicLink({
      email,
      callbackURL: "/",
    });

    if (error) {
      setError(error.message);
    } else if (data) {
      setSuccess(true);
      setError(undefined);
    }
  }

  return (
    <div>
      {!error && !success && (
        <div>
          <input
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={() => sendMagicLink()}>Envoyer le magic link</button>
        </div>
      )}
      {success && (
        <div>
          <p>Check your email for the magic link.</p>
        </div>
      )}

      {error && (
        <div>
          <p>Error: {error}</p>
          <button onClick={() => setError(undefined)}>Try again</button>
        </div>
      )}
    </div>
  );
}
