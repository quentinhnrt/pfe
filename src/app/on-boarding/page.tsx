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
                className="hidden md:block md:w-1/3 relative bg-primary"
            >
                <div className="fixed left-8 top-0 h-full z-10 flex flex-col justify-center p-8 text-white">
                    <h1 className="text-7xl font-bold mb-6">Artilink</h1>
                    <p className="mb-4 text-4xl">
                        Façonnez votre identité,<br/>
                        illuminez votre art.
                    </p>
                </div>
            </div>

            <div className="w-full md:w-2/3 p-6 flex flex-col items-center justify-center">
                <OnBoardingForm user={session.user} />
            </div>
        </div>
    )
}
