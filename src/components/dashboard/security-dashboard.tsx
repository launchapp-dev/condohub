"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  Users,
  UserPlus,
  Package,
  LogIn,
  LogOut,
  Clock,
  ArrowRight,
  Home,
  User,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import type { SecurityDashboardData } from "@/actions/dashboard";

interface SecurityDashboardProps {
  data: SecurityDashboardData;
}

export function SecurityDashboard({ data }: SecurityDashboardProps) {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("welcome", { name: data.user.name })}</h1>
      </div>

      {/* Quick Action */}
      <div className="flex flex-wrap gap-2">
        <Link href="/visitors/register">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            {t("security.walkInRegister")}
          </Button>
        </Link>
        <Link href="/visitors/security">
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            {t("security.securityView")}
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Expected Today */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">{t("security.expectedToday")}</CardTitle>
            </div>
            <Badge variant="secondary">{data.expectedToday.length}</Badge>
          </CardHeader>
          <CardContent className="flex-1">
            {data.expectedToday.length > 0 ? (
              <div className="space-y-3">
                {data.expectedToday.map((visitor) => (
                  <div
                    key={visitor.id}
                    className="rounded-lg border p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{visitor.name}</p>
                        {visitor.purpose && (
                          <p className="text-xs text-muted-foreground">
                            {visitor.purpose}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Home className="h-3 w-3" />
                          {visitor.unitNumber || t("security.noUnit")}
                          <span>·</span>
                          <User className="h-3 w-3" />
                          {visitor.hostName}
                        </div>
                      </div>
                      <div className="text-right">
                        {visitor.expectedAt && (
                          <p className="text-xs font-medium">
                            {format(new Date(visitor.expectedAt), "h:mm a")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">{t("security.noExpectedVisitors")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Check-ins */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <CardTitle className="text-base">{t("security.recentCheckIns")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            {data.recentCheckIns.length > 0 ? (
              <div className="space-y-3">
                {data.recentCheckIns.map((checkIn) => (
                  <div
                    key={checkIn.id}
                    className="rounded-lg border p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{checkIn.visitorName}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Home className="h-3 w-3" />
                          {checkIn.unitNumber || t("security.noUnit")}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(checkIn.checkInTime), "h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">{t("security.noRecentCheckIns")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries Log */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <LogIn className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{t("security.recentEntriesLog")}</CardTitle>
          </div>
          <Link href="/visitors">
            <Button variant="ghost" size="sm">
              {tCommon("viewAll")}
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {data.recentEntries.length > 0 ? (
            <div className="space-y-2">
              {data.recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    entry.action === "check_in" ? "bg-green-100" : "bg-orange-100"
                  }`}>
                    {entry.action === "check_in" ? (
                      <LogIn className="h-4 w-4 text-green-600" />
                    ) : (
                      <LogOut className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{entry.visitorName}</p>
                      <Badge variant={entry.action === "check_in" ? "default" : "secondary"}>
                        {entry.action === "check_in" ? t("security.checkedIn") : t("security.checkedOut")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {entry.unitNumber && (
                        <>
                          <Home className="h-3 w-3" />
                          {entry.unitNumber}
                          <span>·</span>
                        </>
                      )}
                      {format(new Date(entry.timestamp), "MMM d, h:mm a")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">{t("security.noEntries")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delivery Log */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{t("security.deliveryLog")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {data.deliveryLog.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.deliveryLog.map((delivery) => (
                <div
                  key={delivery.id}
                  className="rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{delivery.visitorName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Home className="h-3 w-3" />
                      {delivery.unitNumber || t("security.noUnit")}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(delivery.checkInTime), "MMM d, h:mm a")}
                    </p>
                    {delivery.notes && (
                      <p className="text-xs text-muted-foreground italic">
                        {delivery.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">{t("security.noDeliveries")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
