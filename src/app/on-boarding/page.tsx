import OnBoardingForm from "@/features/on-boarding/OnBoardingForm"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function OnBoarding() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || !session.user || session.user.onBoarded) {
        redirect("/")
    }

    return (
        <div className="flex min-h-screen">
            <div
                className="hidden md:block md:w-1/3 relative"
                style={{
                    backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >

                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                <div className="relative h-full z-10 flex flex-col justify-center p-8 text-white">
                    <h1 className="text-7xl font-bold mb-6">Artilink</h1>
                    <p className="mb-4 text-4xl">
                        Façonnez votre identité,<br/>
                        illuminez votre art.
                    </p>
                </div>
            </div>

            <div className="w-full md:w-2/3 p-6 flex flex-col items-center justify-center">
                <div className="w-full max-w-2xl mb-6">
                    <h2 className="text-lg font-medium text-muted-foreground">Bienvenue, {session.user.email}</h2>
                </div>
                <OnBoardingForm user={session.user} />
            </div>
        </div>
    )
}
