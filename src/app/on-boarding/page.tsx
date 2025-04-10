import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth";
import OnBoardingForm from "@/components/on-boarding/OnBoardingForm";

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
