"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  Users,
  Wrench,
  UserCheck,
  Megaphone,
  Plus,
  Settings,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Activity,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import type { AdminDashboardData } from "@/actions/dashboard";

interface AdminDashboardProps {
  data: AdminDashboardData;
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const tMaintenance = useTranslations("maintenance");

  const getUrgencyBadgeVariant = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "destructive";
      case "normal":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "visitor":
        return <UserCheck className="h-4 w-4" />;
      case "maintenance":
        return <Wrench className="h-4 w-4" />;
      case "announcement":
        return <Megaphone className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("welcome", { name: data.user.name })}</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("stats.totalResidents")}
                </p>
                <div className="text-2xl font-bold">{data.stats.totalResidents}</div>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("stats.pendingRequests")}
                </p>
                <div className="text-2xl font-bold">{data.stats.pendingRequests}</div>
              </div>
              <Wrench className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("stats.visitorsToday")}
                </p>
                <div className="text-2xl font-bold">{data.stats.visitorsToday}</div>
              </div>
              <UserCheck className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("stats.activeAnnouncements")}
                </p>
                <div className="text-2xl font-bold">{data.stats.activeAnnouncements}</div>
              </div>
              <Megaphone className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Link href="/announcements/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("quickActions.addAnnouncement")}
          </Button>
        </Link>
        <Link href="/visitors">
          <Button variant="outline">
            <UserCheck className="mr-2 h-4 w-4" />
            {t("quickActions.manageVisitors")}
          </Button>
        </Link>
        <Link href="/settings/community">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            {t("quickActions.communitySettings")}
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Pending Approvals */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">{t("admin.pendingApprovals")}</CardTitle>
            </div>
            <Link href="/maintenance">
              <Button variant="ghost" size="sm">
                {tCommon("viewAll")}
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            {data.pendingApprovals.length > 0 ? (
              <div className="space-y-3">
                {data.pendingApprovals.map((request) => (
                  <Link
                    key={request.id}
                    href={`/maintenance/${request.id}`}
                    className="block"
                  >
                    <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{request.category}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {request.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {request.requesterName}
                            {request.unitNumber && ` · ${request.unitNumber}`}
                          </p>
                        </div>
                        <Badge variant={getUrgencyBadgeVariant(request.urgency)}>
                          {tMaintenance(`urgency${request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}`)}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">{t("admin.noPendingApprovals")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue Maintenance */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <CardTitle className="text-base">{t("admin.overdueMaintenance")}</CardTitle>
            </div>
            <Link href="/maintenance">
              <Button variant="ghost" size="sm">
                {tCommon("viewAll")}
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            {data.overdueMaintenance.length > 0 ? (
              <div className="space-y-3">
                {data.overdueMaintenance.map((request) => (
                  <Link
                    key={request.id}
                    href={`/maintenance/${request.id}`}
                    className="block"
                  >
                    <div className="rounded-lg border border-destructive/20 p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{request.category}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {request.description}
                          </p>
                          <p className="text-xs text-destructive">
                            {t("admin.daysOpen", { days: request.daysOpen })}
                            {request.unitNumber && ` · ${request.unitNumber}`}
                          </p>
                        </div>
                        <Badge variant="destructive">
                          {tMaintenance(`status${request.status.charAt(0).toUpperCase() + request.status.slice(1).replace("_", "")}`)}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">{t("admin.noOverdueMaintenance")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{t("admin.financialSummary")}</CardTitle>
          </div>
          <Link href="/finances">
            <Button variant="ghost" size="sm">
              {tCommon("viewAll")}
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t("admin.totalDues")}</p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(data.financialSummary.totalDues)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t("admin.collectedAmount")}</p>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(data.financialSummary.collectedAmount)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t("admin.pendingAmount")}</p>
              <p className="text-2xl font-bold text-orange-600">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(data.financialSummary.pendingAmount)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{t("admin.collectionRate")}:</span>
            <span className="font-medium">
              {data.financialSummary.collectionRate.toFixed(1)}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{t("admin.recentActivity")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {data.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {data.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.timestamp), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">{t("admin.noRecentActivity")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
