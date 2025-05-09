import OnBoardingForm from "@/features/on-boarding/OnBoardingForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OnBoarding() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user || session.user.onBoarded) {
    redirect("/");
  }

  return (
    <div>
      <p>On boarding page</p>
      <div>
        Email : {session.user.email}
        <OnBoardingForm user={session.user} />
      </div>
    </div>
  );
}
