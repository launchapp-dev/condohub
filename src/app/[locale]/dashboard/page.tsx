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

  // If user has no community, redirect to onboarding
  if (!user.communityId) {
    redirect("/onboarding");
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
