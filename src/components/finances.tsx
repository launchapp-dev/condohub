"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Building,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import type { UserRole } from "@/lib/auth";
import type {
  FinancialOverview,
  FeeData,
  PaymentData,
  MonthlySummary,
  BudgetCategory,
} from "@/actions/finances";

interface FinancesPageClientProps {
  userRole: UserRole;
  overview: FinancialOverview | null;
  fees: FeeData[];
  payments: PaymentData[];
  monthlySummary: MonthlySummary[];
  units: { id: string; unitNumber: string }[];
  residentUnit: { id: string; unitNumber: string; floor: number | null } | null;
}

export function FinancesPageClient({
  userRole,
  overview,
  fees,
  payments,
  monthlySummary,
  units,
  residentUnit,
}: FinancesPageClientProps) {
  const t = useTranslations("finances");
  const isAdmin = userRole === "admin" || userRole === "board_member";
  const [unitFilter, setUnitFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Filter payments based on selected filters
  const filteredPayments = payments.filter((payment) => {
    if (unitFilter !== "all" && payment.unitNumber !== unitFilter) {
      return false;
    }
    if (dateFrom && new Date(payment.paidAt) < new Date(dateFrom)) {
      return false;
    }
    if (dateTo && new Date(payment.paidAt) > new Date(dateTo)) {
      return false;
    }
    return true;
  });

  // Filter fees based on unit
  const filteredFees = fees.filter((fee) => {
    if (unitFilter !== "all" && fee.unitNumber !== unitFilter) {
      return false;
    }
    return true;
  });

  const handleUnitChange = (value: string | null) => {
    if (value !== null) {
      setUnitFilter(value);
    }
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ["Date", "Unit", "Fee", "Amount", "Method", "Payer"];
    const rows = filteredPayments.map((p) => [
      format(p.paidAt, "yyyy-MM-dd"),
      p.unitNumber || "N/A",
      p.feeTitle,
      p.amount.toFixed(2),
      p.method || "N/A",
      p.payerName,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    // Download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        {residentUnit && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>
              {t("unit")}: {residentUnit.unitNumber}
              {residentUnit.floor && ` (${t("floor")} ${residentUnit.floor})`}
            </span>
          </div>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
          <TabsTrigger value="fees">{t("tabs.fees")}</TabsTrigger>
          <TabsTrigger value="payments">{t("tabs.payments")}</TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="reports">{t("tabs.reports")}</TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {isAdmin && overview ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title={t("stats.totalBudget")}
                  value={formatCurrency(overview.totalBudget)}
                  icon={<DollarSign className="h-4 w-4" />}
                  description={t("stats.currentYear")}
                />
                <StatCard
                  title={t("stats.totalDues")}
                  value={formatCurrency(overview.totalDues)}
                  icon={<TrendingUp className="h-4 w-4" />}
                  description={t("stats.ytdFees")}
                />
                <StatCard
                  title={t("stats.collected")}
                  value={formatCurrency(overview.totalCollected)}
                  icon={<CheckCircle className="h-4 w-4" />}
                  description={`${overview.collectionRate.toFixed(1)}% ${t(
                    "stats.collectionRate"
                  )}`}
                />
                <StatCard
                  title={t("stats.pending")}
                  value={formatCurrency(
                    overview.totalDues - overview.totalCollected
                  )}
                  icon={<Clock className="h-4 w-4" />}
                  description={`${overview.outstandingFees} ${t(
                    "stats.outstandingFees"
                  )}`}
                  variant="warning"
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{t("budget.title")}</CardTitle>
                  <CardDescription>{t("budget.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {overview.categories.map((category) => (
                      <BudgetProgressBar
                        key={category.category}
                        category={category.category}
                        planned={category.plannedAmount}
                        spent={category.spentAmount}
                        percentage={category.percentageUsed}
                        formatCurrency={formatCurrency}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <ResidentOverview
              fees={fees}
              formatCurrency={formatCurrency}
              t={t}
            />
          )}
        </TabsContent>

        {/* Fee Tracking Tab */}
        <TabsContent value="fees" className="space-y-4">
          {isAdmin && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="unit-filter">{t("filters.unit")}</Label>
                <Select value={unitFilter} onValueChange={handleUnitChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t("filters.allUnits")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("filters.allUnits")}</SelectItem>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.unitNumber}>
                        {unit.unitNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{t("fees.title")}</CardTitle>
              <CardDescription>{t("fees.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {isAdmin && <TableHead>{t("fees.unit")}</TableHead>}
                    <TableHead>{t("fees.title")}</TableHead>
                    <TableHead>{t("fees.amount")}</TableHead>
                    <TableHead>{t("fees.dueDate")}</TableHead>
                    <TableHead>{t("fees.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFees.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={isAdmin ? 5 : 4}
                        className="text-center text-muted-foreground"
                      >
                        {t("fees.noFees")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFees.map((fee) => (
                      <TableRow key={fee.id}>
                        {isAdmin && (
                          <TableCell>{fee.unitNumber || "N/A"}</TableCell>
                        )}
                        <TableCell>{fee.title}</TableCell>
                        <TableCell>{formatCurrency(fee.amount)}</TableCell>
                        <TableCell>
                          {format(fee.dueDate, "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <FeeStatusBadge isPaid={fee.isPaid} t={t} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap items-end gap-4">
              {isAdmin && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="unit-filter-payments">
                    {t("filters.unit")}
                  </Label>
                  <Select value={unitFilter} onValueChange={handleUnitChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={t("filters.allUnits")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("filters.allUnits")}
                      </SelectItem>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.unitNumber}>
                          {unit.unitNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="date-from">{t("filters.from")}</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="date-to">{t("filters.to")}</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
            {isAdmin && (
              <Button onClick={handleExportCSV} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                {t("actions.exportCSV")}
              </Button>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("payments.title")}</CardTitle>
              <CardDescription>{t("payments.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("payments.date")}</TableHead>
                    {isAdmin && <TableHead>{t("payments.unit")}</TableHead>}
                    <TableHead>{t("payments.fee")}</TableHead>
                    <TableHead>{t("payments.amount")}</TableHead>
                    {isAdmin && <TableHead>{t("payments.payer")}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={isAdmin ? 5 : 3}
                        className="text-center text-muted-foreground"
                      >
                        {t("payments.noPayments")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {format(payment.paidAt, "MMM d, yyyy")}
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            {payment.unitNumber || "N/A"}
                          </TableCell>
                        )}
                        <TableCell>{payment.feeTitle}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        {isAdmin && (
                          <TableCell>{payment.payerName}</TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab (Admin only) */}
        {isAdmin && (
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("reports.monthlySummary")}</CardTitle>
                <CardDescription>
                  {t("reports.monthlyDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("reports.month")}</TableHead>
                      <TableHead>{t("reports.totalDues")}</TableHead>
                      <TableHead>{t("reports.collected")}</TableHead>
                      <TableHead>{t("reports.pending")}</TableHead>
                      <TableHead>{t("reports.collectionRate")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlySummary.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground"
                        >
                          {t("reports.noData")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      monthlySummary.map((month) => (
                        <TableRow key={month.month}>
                          <TableCell>{month.month}</TableCell>
                          <TableCell>
                            {formatCurrency(month.totalDues)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(month.totalCollected)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(month.totalPending)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={month.collectionRate}
                                className="h-2 w-20"
                              />
                              <span className="text-sm">
                                {month.collectionRate.toFixed(0)}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {overview && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("reports.annualSummary")}</CardTitle>
                  <CardDescription>
                    {t("reports.annualDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {t("reports.totalDues")}
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(overview.totalDues)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {t("reports.totalCollected")}
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(overview.totalCollected)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {t("reports.collectionRate")}
                      </p>
                      <p className="text-2xl font-bold">
                        {overview.collectionRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <h4 className="mb-4 font-medium">
                    {t("reports.byCategory")}
                  </h4>
                  <div className="space-y-4">
                    {overview.categories.map((category) => (
                      <BudgetProgressBar
                        key={category.category}
                        category={category.category}
                        planned={category.plannedAmount}
                        spent={category.spentAmount}
                        percentage={category.percentageUsed}
                        formatCurrency={formatCurrency}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
  variant = "default",
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  variant?: "default" | "warning" | "success";
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className={
            variant === "warning"
              ? "text-yellow-500"
              : variant === "success"
              ? "text-green-500"
              : "text-muted-foreground"
          }
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function BudgetProgressBar({
  category,
  planned,
  spent,
  percentage,
  formatCurrency,
}: {
  category: string;
  planned: number;
  spent: number;
  percentage: number;
  formatCurrency: (amount: number) => string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{category}</span>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          {formatCurrency(spent)} / {formatCurrency(planned)}
        </div>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-xs text-muted-foreground">
        {percentage.toFixed(1)}% {spent > planned ? "over" : "of"} budget
      </p>
    </div>
  );
}

function FeeStatusBadge({
  isPaid,
  t,
}: {
  isPaid: boolean;
  t: (key: string) => string;
}) {
  if (isPaid) {
    return (
      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
        <CheckCircle className="mr-1 h-3 w-3" />
        {t("fees.paid")}
      </Badge>
    );
  }
  return (
    <Badge variant="destructive">
      <AlertCircle className="mr-1 h-3 w-3" />
      {t("fees.overdue")}
    </Badge>
  );
}

function ResidentOverview({
  fees,
  formatCurrency,
  t,
}: {
  fees: FeeData[];
  formatCurrency: (amount: number) => string;
  t: (key: string) => string;
}) {
  const outstandingFees = fees.filter((f) => !f.isPaid);
  const totalOutstanding = outstandingFees.reduce(
    (sum, f) => sum + f.amount,
    0
  );
  const paidFees = fees.filter((f) => f.isPaid);
  const totalPaid = paidFees.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("resident.outstanding")}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalOutstanding)}
            </div>
            <p className="text-xs text-muted-foreground">
              {outstandingFees.length} {t("resident.pendingFees")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("resident.paidYTD")}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalPaid)}
            </div>
            <p className="text-xs text-muted-foreground">
              {paidFees.length} {t("resident.paidFees")}
            </p>
          </CardContent>
        </Card>
      </div>

      {outstandingFees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("resident.outstandingFees")}</CardTitle>
            <CardDescription>
              {t("resident.payByDueDate")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {outstandingFees.map((fee) => (
                <div
                  key={fee.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{fee.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("fees.due")}: {format(fee.dueDate, "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">
                      {formatCurrency(fee.amount)}
                    </span>
                    <Button size="sm">{t("actions.payNow")}</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function FinancesSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
