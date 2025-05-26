"use client";

import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/shadcn/alert";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<undefined | string>();
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = authClient.useSession();

  if (session) {
    redirect("/");
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
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
    } catch (err) {
      setError("An unexpected error occurred : " + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      {!error && !success && (
        <form onSubmit={sendMagicLink}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "..." : "Sign in / Register"}
            </Button>
          </div>
        </form>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircleIcon className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Check your email for the magic link. You can close this page.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircleIcon className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {!error && !success && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" disabled={isLoading}>
              Google
            </Button>
            <Button variant="outline" disabled={isLoading}>
              Facebook
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
