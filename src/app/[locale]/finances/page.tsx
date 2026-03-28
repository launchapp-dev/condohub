import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getFinancialOverview,
  getFeeTracking,
  getPaymentHistory,
  getMonthlySummary,
  getUnitsForFilter,
  getResidentUnitInfo,
} from "@/actions/finances";
import {
  FinancesPageClient,
  FinancesSkeleton,
} from "@/components/finances";

async function FinancesContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.communityId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <h1 className="text-2xl font-semibold">Finances</h1>
        <p className="text-muted-foreground text-center max-w-md">
          You are not yet a member of any community.
        </p>
      </div>
    );
  }

  const isAdmin =
    user.role === "admin" || user.role === "board_member";

  // Fetch data based on role
  const [
    overview,
    fees,
    payments,
    monthlySummary,
    units,
    residentUnit,
  ] = await Promise.all([
    isAdmin ? getFinancialOverview() : Promise.resolve(null),
    getFeeTracking(),
    getPaymentHistory(),
    isAdmin ? getMonthlySummary() : Promise.resolve(null),
    isAdmin ? getUnitsForFilter() : Promise.resolve(null),
    getResidentUnitInfo(),
  ]);

  return (
    <FinancesPageClient
      userRole={user.role || "resident"}
      overview={overview}
      fees={fees || []}
      payments={payments || []}
      monthlySummary={monthlySummary || []}
      units={units || []}
      residentUnit={residentUnit}
    />
  );
}

export async function generateMetadata() {
  const t = await getTranslations("finances");
  return {
    title: t("title"),
  };
}

export default function FinancesPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <Suspense fallback={<FinancesSkeleton />}>
        <FinancesContent />
      </Suspense>
    </main>
  );
}
