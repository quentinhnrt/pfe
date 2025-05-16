"use client"

import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MailIcon, AlertCircleIcon, CheckCircleIcon, ArrowRightIcon } from "lucide-react"
import Image from "next/image";

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<undefined | string>()
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { data: session } = authClient.useSession()

  if (session) {
    redirect("/")
  }

  async function sendMagicLink() {
    setIsLoading(true)

    try {
      const { data, error } = await authClient.signIn.magicLink({
        email,
        callbackURL: "/",
      })

      if (error) {
        setError(error.message)
      } else if (data) {
        setSuccess(true)
        setError(undefined)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="flex min-h-screen">
        {/* Form section (1/3 width) */}
        <div className="w-full md:w-1/3 p-6 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Accédez à votre espace créatif</CardTitle>
            </CardHeader>

            <CardContent>
              {!error && !success && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
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
            </CardContent>

            <CardFooter className="flex justify-between">
              {error && (
                  <Button variant="outline" onClick={() => setError(undefined)}>
                    Try again
                  </Button>
              )}

              {!success && !error && (
                  <Button className="w-full" onClick={() => sendMagicLink()} disabled={!email || isLoading}>
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </span>
                    ) : (
                        <span className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4" />
                    Envoyer le lien de connexion
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </span>
                    )}
                  </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="hidden md:block md:w-2/3 bg-purple-600 text-white relative">
          <Image src={"/signin.jpg"} alt={"test"} width={1920} height={1080} className={"absolute top-0 left-0 w-full h-full z-0 object-cover"} />
          <div className="h-full flex flex-col justify-center w-full z-10 relative bg-primary/10 p-12">
            <h1 className="text-7xl font-bold mb-6">Artilink</h1>
            <p className="text-4xl mb-4">
              L'art ne vit que lorsqu'il est partagé.
            </p>
            <p className="text-4xl">
              Entrez, créez, inspirez.
            </p>
          </div>
        </div>
      </div>
  )
}
