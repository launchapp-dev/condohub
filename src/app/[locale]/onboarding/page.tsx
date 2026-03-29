import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { checkCanOnboard } from "@/actions/onboarding";
import OnboardingForm from "./onboarding-form";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  // Check if user can onboard (has no community)
  const canOnboard = await checkCanOnboard();

  // If user already has a community, redirect to dashboard
  if (!canOnboard) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center p-6">
      <OnboardingForm userName={user.name} />
    </main>
  );
}
