"use server";

import { db } from "@/db";
import { fees, payments, budgets, units, communities } from "@/db/schema";
import { getCurrentUser, type UserRole } from "@/lib/auth";
import {
  eq,
  and,
  desc,
  asc,
  gte,
  lte,
  sql,
  inArray,
} from "drizzle-orm";
import { format, startOfYear, endOfYear, subMonths } from "date-fns";

// Types for finance data
export interface FeeData {
  id: string;
  title: string;
  amount: number;
  dueDate: Date;
  isPaid: boolean;
  unitNumber: string | null;
  paidAt: Date | null;
}

export interface PaymentData {
  id: string;
  feeTitle: string;
  amount: number;
  paidAt: Date;
  method: string | null;
  unitNumber: string | null;
  payerName: string;
}

export interface BudgetCategory {
  category: string;
  plannedAmount: number;
  spentAmount: number;
  percentageUsed: number;
}

export interface MonthlySummary {
  month: string;
  totalDues: number;
  totalCollected: number;
  totalPending: number;
  collectionRate: number;
}

export interface SpecialAssessment {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  isPaid: boolean;
}

export interface FinancialOverview {
  totalBudget: number;
  totalSpent: number;
  totalDues: number;
  totalCollected: number;
  collectionRate: number;
  outstandingFees: number;
  categories: BudgetCategory[];
}

// Helper to check if user is admin/board
function isAdminRole(role: UserRole): boolean {
  return role === "admin" || role === "board_member";
}

// Get financial overview (admin/board only)
export async function getFinancialOverview(): Promise<FinancialOverview | null> {
  const user = await getCurrentUser();
  if (!user || !user.communityId || !isAdminRole(user.role || "resident")) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  // Get budget data
  const budgetData = await db.query.budgets.findMany({
    where: and(
      eq(budgets.communityId, user.communityId),
      eq(budgets.year, currentYear)
    ),
  });

  const totalBudget = budgetData.reduce((sum, b) => sum + b.plannedAmount, 0);
  const totalSpent = budgetData.reduce((sum, b) => sum + b.spentAmount, 0);

  // Get all fees for current year
  const startOfYearDate = startOfYear(new Date());
  const endOfYearDate = endOfYear(new Date());

  const feesData = await db.query.fees.findMany({
    where: and(
      eq(fees.communityId, user.communityId),
      gte(fees.dueDate, startOfYearDate),
      lte(fees.dueDate, endOfYearDate)
    ),
  });

  const totalDues = feesData.reduce((sum, f) => sum + f.amount, 0);
  const totalCollected = feesData
    .filter((f) => f.isPaid)
    .reduce((sum, f) => sum + f.amount, 0);
  const totalPending = totalDues - totalCollected;
  const collectionRate = totalDues > 0 ? (totalCollected / totalDues) * 100 : 0;
  const outstandingFees = feesData.filter((f) => !f.isPaid).length;

  // Build category breakdown
  const categories: BudgetCategory[] = budgetData.map((b) => ({
    category: b.category,
    plannedAmount: b.plannedAmount,
    spentAmount: b.spentAmount,
    percentageUsed:
      b.plannedAmount > 0 ? (b.spentAmount / b.plannedAmount) * 100 : 0,
  }));

  return {
    totalBudget,
    totalSpent,
    totalDues,
    totalCollected,
    collectionRate,
    outstandingFees,
    categories,
  };
}

// Get fee tracking data
export async function getFeeTracking(
  unitId?: string
): Promise<FeeData[] | null> {
  const user = await getCurrentUser();
  if (!user || !user.communityId) return null;

  const isAdmin = isAdminRole(user.role || "resident");

  // If resident, only show their unit's fees
  let targetUnitId = unitId;
  if (!isAdmin) {
    const userUnit = await db.query.units.findFirst({
      where: eq(units.ownerId, user.id),
    });
    if (!userUnit) return [];
    targetUnitId = userUnit.id;
  }

  const feesData = await db.query.fees.findMany({
    where: and(
      eq(fees.communityId, user.communityId),
      targetUnitId ? eq(fees.unitId, targetUnitId) : undefined
    ),
    with: {
      unit: true,
      payments: true,
    },
    orderBy: desc(fees.dueDate),
  });

  return feesData.map((f) => ({
    id: f.id,
    title: f.title,
    amount: f.amount,
    dueDate: f.dueDate,
    isPaid: f.isPaid,
    unitNumber: f.unit?.unitNumber || null,
    paidAt: f.payments[0]?.paidAt || null,
  }));
}

// Get payment history
export async function getPaymentHistory(
  unitId?: string,
  startDate?: Date,
  endDate?: Date
): Promise<PaymentData[] | null> {
  const user = await getCurrentUser();
  if (!user || !user.communityId) return null;

  const isAdmin = isAdminRole(user.role || "resident");

  // If resident, only show their unit's payments
  let targetUnitIds: string[] = [];
  if (!isAdmin) {
    const userUnit = await db.query.units.findFirst({
      where: eq(units.ownerId, user.id),
    });
    if (!userUnit) return [];
    targetUnitIds = [userUnit.id];
  } else if (unitId) {
    targetUnitIds = [unitId];
  }

  // Get all fees for the unit(s) first
  let feeIds: string[] = [];
  if (targetUnitIds.length > 0) {
    const feesData = await db.query.fees.findMany({
      where: and(
        eq(fees.communityId, user.communityId),
        inArray(fees.unitId, targetUnitIds)
      ),
    });
    feeIds = feesData.map((f) => f.id);
  } else {
    // Admin viewing all - get all fee IDs for the community
    const feesData = await db.query.fees.findMany({
      where: eq(fees.communityId, user.communityId),
    });
    feeIds = feesData.map((f) => f.id);
  }

  if (feeIds.length === 0) return [];

  const paymentsData = await db.query.payments.findMany({
    where: and(
      inArray(payments.feeId, feeIds),
      startDate ? gte(payments.paidAt, startDate) : undefined,
      endDate ? lte(payments.paidAt, endDate) : undefined
    ),
    with: {
      fee: {
        with: {
          unit: true,
        },
      },
      payer: true,
    },
    orderBy: desc(payments.paidAt),
  });

  return paymentsData.map((p) => ({
    id: p.id,
    feeTitle: p.fee.title,
    amount: p.amount,
    paidAt: p.paidAt,
    method: p.method,
    unitNumber: p.fee.unit?.unitNumber || null,
    payerName: p.payer.name,
  }));
}

// Get monthly summary for reports
export async function getMonthlySummary(
  year?: number
): Promise<MonthlySummary[] | null> {
  const user = await getCurrentUser();
  if (!user || !user.communityId || !isAdminRole(user.role || "resident")) {
    return null;
  }

  const targetYear = year || new Date().getFullYear();

  // Get all fees for the year
  const startOfYearDate = new Date(targetYear, 0, 1);
  const endOfYearDate = new Date(targetYear, 11, 31, 23, 59, 59);

  const feesData = await db.query.fees.findMany({
    where: and(
      eq(fees.communityId, user.communityId),
      gte(fees.dueDate, startOfYearDate),
      lte(fees.dueDate, endOfYearDate)
    ),
    with: {
      payments: true,
    },
  });

  // Group by month
  const monthlyData = new Map<
    number,
    { dues: number; collected: number; pending: number }
  >();

  for (let i = 0; i < 12; i++) {
    monthlyData.set(i, { dues: 0, collected: 0, pending: 0 });
  }

  feesData.forEach((fee) => {
    const month = fee.dueDate.getMonth();
    const monthData = monthlyData.get(month)!;
    monthData.dues += fee.amount;
    if (fee.isPaid && fee.payments.length > 0) {
      monthData.collected += fee.amount;
    } else {
      monthData.pending += fee.amount;
    }
    monthlyData.set(month, monthData);
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return Array.from(monthlyData.entries()).map(([month, data]) => ({
    month: months[month],
    totalDues: data.dues,
    totalCollected: data.collected,
    totalPending: data.pending,
    collectionRate: data.dues > 0 ? (data.collected / data.dues) * 100 : 0,
  }));
}

// Get annual report data
export async function getAnnualReport(
  year?: number
): Promise<{
  year: number;
  totalDues: number;
  totalCollected: number;
  totalPending: number;
  collectionRate: number;
  categories: BudgetCategory[];
} | null> {
  const user = await getCurrentUser();
  if (!user || !user.communityId || !isAdminRole(user.role || "resident")) {
    return null;
  }

  const targetYear = year || new Date().getFullYear();

  const [overview, budgetData] = await Promise.all([
    getFinancialOverview(),
    db.query.budgets.findMany({
      where: and(
        eq(budgets.communityId, user.communityId),
        eq(budgets.year, targetYear)
      ),
    }),
  ]);

  if (!overview) return null;

  const categories: BudgetCategory[] = budgetData.map((b) => ({
    category: b.category,
    plannedAmount: b.plannedAmount,
    spentAmount: b.spentAmount,
    percentageUsed:
      b.plannedAmount > 0 ? (b.spentAmount / b.plannedAmount) * 100 : 0,
  }));

  return {
    year: targetYear,
    totalDues: overview.totalDues,
    totalCollected: overview.totalCollected,
    totalPending: overview.totalDues - overview.totalCollected,
    collectionRate: overview.collectionRate,
    categories,
  };
}

// Export payments to CSV
export async function exportPaymentsToCSV(
  unitId?: string,
  startDate?: Date,
  endDate?: Date
): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user || !user.communityId || !isAdminRole(user.role || "resident")) {
    return null;
  }

  const paymentsData = await getPaymentHistory(unitId, startDate, endDate);
  if (!paymentsData) return null;

  // CSV Header
  const headers = ["Date", "Unit", "Fee", "Amount", "Method", "Payer"];

  // CSV Rows
  const rows = paymentsData.map((p) => [
    format(p.paidAt, "yyyy-MM-dd"),
    p.unitNumber || "N/A",
    p.feeTitle,
    p.amount.toFixed(2),
    p.method || "N/A",
    p.payerName,
  ]);

  // Combine
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return csv;
}

// Get all units for filter dropdown (admin only)
export async function getUnitsForFilter(): Promise<
  { id: string; unitNumber: string }[] | null
> {
  const user = await getCurrentUser();
  if (!user || !user.communityId || !isAdminRole(user.role || "resident")) {
    return null;
  }

  const unitsData = await db.query.units.findMany({
    where: eq(units.communityId, user.communityId),
    orderBy: asc(units.unitNumber),
  });

  return unitsData.map((u) => ({
    id: u.id,
    unitNumber: u.unitNumber,
  }));
}

// Get resident's unit info
export async function getResidentUnitInfo(): Promise<{
  id: string;
  unitNumber: string;
  floor: number | null;
} | null> {
  const user = await getCurrentUser();
  if (!user || !user.communityId) return null;

  const unit = await db.query.units.findFirst({
    where: eq(units.ownerId, user.id),
  });

  if (!unit) return null;

  return {
    id: unit.id,
    unitNumber: unit.unitNumber,
    floor: unit.floor,
  };
}
