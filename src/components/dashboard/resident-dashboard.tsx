"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  Users,
  Wrench,
  Megaphone,
  Calendar,
  DollarSign,
  Building,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import type { ResidentDashboardData } from "@/actions/dashboard";

interface ResidentDashboardProps {
  data: ResidentDashboardData;
}

export function ResidentDashboard({ data }: ResidentDashboardProps) {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const tMaintenance = useTranslations("maintenance");

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "in_progress":
        return "default";
      case "completed":
        return "outline";
      case "checked_in":
        return "default";
      case "checked_out":
        return "outline";
      case "expected":
        return "secondary";
      default:
        return "default";
    }
  };

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

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
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

  const totalOutstandingFees = data.outstandingFees.reduce(
    (sum, fee) => sum + fee.amount,
    0
  );

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-semibold">{t("welcome", { name: data.user.name })}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* My Unit Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("myUnit")}</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {data.unit ? (
              <div className="space-y-1">
                <div className="text-2xl font-bold">{data.unit.unitNumber}</div>
                <p className="text-xs text-muted-foreground">
                  {data.unit.communityName}
                  {data.unit.floor && ` · ${t("floor", { floor: data.unit.floor })}`}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("noUnitAssigned")}</p>
            )}
          </CardContent>
        </Card>

        {/* Today's Visitors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("myVisitors")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.todayVisitors.length}</div>
            <p className="text-xs text-muted-foreground">{t("visitorsToday")}</p>
          </CardContent>
          {data.todayVisitors.length > 0 && (
            <CardFooter>
              <Link href="/visitors" className="w-full">
                <Button variant="ghost" size="sm" className="w-full">
                  {tCommon("view")}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          )}
        </Card>

        {/* Outstanding Fees */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("myFees")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalOutstandingFees > 0
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalOutstandingFees)
                : t("noOutstandingFees")}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.outstandingFees.length > 0
                ? t("feesDue", { count: data.outstandingFees.length })
                : t("allPaidUp")}
            </p>
          </CardContent>
          {totalOutstandingFees > 0 && (
            <CardFooter>
              <Link href="/finances" className="w-full">
                <Button variant="ghost" size="sm" className="w-full">
                  {tCommon("view")}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Maintenance Requests */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">{t("myMaintenance")}</CardTitle>
            </div>
            <Link href="/maintenance">
              <Button variant="ghost" size="sm">
                {tCommon("viewAll")}
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            {data.maintenanceRequests.length > 0 ? (
              <div className="space-y-3">
                {data.maintenanceRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-start justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{request.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(request.createdAt), "MMM d")}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant={getUrgencyBadgeVariant(request.urgency)}>
                        {tMaintenance(`urgency${request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}`)}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {tMaintenance(`status${request.status.charAt(0).toUpperCase() + request.status.slice(1).replace("_", "")}`)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">{t("noMaintenance")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">{t("recentAnnouncements")}</CardTitle>
            </div>
            <Link href="/announcements">
              <Button variant="ghost" size="sm">
                {tCommon("viewAll")}
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            {data.announcements.length > 0 ? (
              <div className="space-y-3">
                {data.announcements.map((announcement) => (
                  <Link
                    key={announcement.id}
                    href={`/announcements/${announcement.id}`}
                    className="block"
                  >
                    <div className="flex items-start justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                      <div className="space-y-1">
                        <p className="text-sm font-medium line-clamp-1">
                          {announcement.subject}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(announcement.publishedAt), "MMM d")}
                        </p>
                      </div>
                      <Badge variant={getPriorityBadgeVariant(announcement.priority)}>
                        {announcement.priority}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">{t("noAnnouncements")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{t("myBookings")}</CardTitle>
          </div>
          <Link href="/amenities">
            <Button variant="ghost" size="sm">
              {tCommon("viewAll")}
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {data.bookings.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{booking.amenityName}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(new Date(booking.startTime), "MMM d, h:mm a")}
                    </div>
                  </div>
                  <Badge variant={booking.status === "approved" ? "default" : "secondary"}>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">{t("noBookings")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
