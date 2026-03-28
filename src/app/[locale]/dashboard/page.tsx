import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  getResidentDashboardData,
  getAdminDashboardData,
  getSecurityDashboardData,
} from "@/actions/dashboard";
import {
  ResidentDashboard,
  AdminDashboard,
  SecurityDashboard,
  ResidentDashboardSkeleton,
  AdminDashboardSkeleton,
  SecurityDashboardSkeleton,
} from "@/components/dashboard";

async function DashboardContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // If user has no community, show onboarding
  if (!user.communityId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <h1 className="text-2xl font-semibold">Welcome to CondoHub</h1>
        <p className="text-muted-foreground text-center max-w-md">
          You are not yet a member of any community. Please contact your community
          administrator to be added, or create a new community.
        </p>
      </div>
    );
  }

  // Render appropriate dashboard based on role
  const role = user.role || "resident";

  if (role === "security") {
    const data = await getSecurityDashboardData();
    if (!data) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <p>Error loading dashboard data</p>
        </div>
      );
    }
    return <SecurityDashboard data={data} />;
  }

  if (role === "admin" || role === "board_member") {
    const data = await getAdminDashboardData();
    if (!data) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <p>Error loading dashboard data</p>
        </div>
      );
    }
    return <AdminDashboard data={data} />;
  }

  // Default: resident dashboard
  const data = await getResidentDashboardData();
  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p>Error loading dashboard data</p>
      </div>
    );
  }
  return <ResidentDashboard data={data} />;
}

function DashboardSkeleton() {
  // We need to know the role to show the right skeleton
  // For now, default to resident skeleton during loading
  return <ResidentDashboardSkeleton />;
}

export default function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
