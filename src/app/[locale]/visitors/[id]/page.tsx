import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getVisitorById } from "@/lib/actions/visitors";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import type { VisitorStatus, IdType, VisitPurpose } from "@/types/visitor";

interface VisitorDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

function getStatusColor(status: VisitorStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "pending":
      return "secondary";
    case "checked-in":
      return "default";
    case "checked-out":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "default";
  }
}

function formatIdType(idType: IdType, t: (key: string) => string): string {
  const map: Record<string, string> = {
    passport: t("visitors.register.form.idType.options.passport"),
    "driver-license": t("visitors.register.form.idType.options.driverLicense"),
    "national-id": t("visitors.register.form.idType.options.nationalId"),
    other: t("visitors.register.form.idType.options.other"),
  };
  return map[idType] || idType;
}

function formatPurpose(purpose: VisitPurpose, t: (key: string) => string): string {
  const map: Record<string, string> = {
    guest: t("visitors.register.form.purpose.options.guest"),
    delivery: t("visitors.register.form.purpose.options.delivery"),
    contractor: t("visitors.register.form.purpose.options.contractor"),
    "service-provider": t("visitors.register.form.purpose.options.serviceProvider"),
    "real-estate-agent": t("visitors.register.form.purpose.options.realEstateAgent"),
    other: t("visitors.register.form.purpose.options.other"),
  };
  return map[purpose] || purpose;
}

export async function generateMetadata() {
  const t = await getTranslations("visitors");
  return {
    title: t("visitorDetails"),
  };
}

export default async function VisitorDetailPage({ params }: VisitorDetailPageProps) {
  const { locale, id } = await params;
  const t = await getTranslations();

  const visitor = await getVisitorById(id);

  if (!visitor) {
    notFound();
  }

  const isPending = visitor.status === "pending";
  const isCheckedIn = visitor.status === "checked-in";
  const isCheckedOut = visitor.status === "checked-out";
  const isCancelled = visitor.status === "cancelled";

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/visitors`}>
          <Button variant="ghost" size="sm">
            ← {t("visitors.detail.backToList")}
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">{t("visitorDetails")}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("visitors.detail.visitorInfo.title")}</CardTitle>
                <Badge variant={getStatusColor(visitor.status)}>
                  {t(`visitors.list.status.${visitor.status.replace("-", "")}`)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("visitors.detail.visitorInfo.name")}</p>
                  <p className="font-medium">{visitor.visitorName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("visitors.detail.visitorInfo.purpose")}</p>
                  <p className="font-medium">{formatPurpose(visitor.purpose, t)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("visitors.detail.visitorInfo.idType")}</p>
                  <p className="font-medium">{formatIdType(visitor.idType, t)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("visitors.detail.visitorInfo.idNumber")}</p>
                  <p className="font-medium">{visitor.idNumber}</p>
                </div>
                {visitor.vehiclePlate && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t("visitors.detail.visitorInfo.vehiclePlate")}</p>
                    <p className="font-medium">{visitor.vehiclePlate}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">{t("visitors.detail.visitorInfo.unitNumber")}</p>
                  <p className="font-medium">{visitor.unitNumber}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">{t("visitors.detail.visitorInfo.expectedArrival")}</p>
                  <p className="font-medium">
                    {new Date(visitor.expectedArrivalDate).toLocaleDateString(locale)} {visitor.expectedArrivalTime}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("visitors.detail.timeline.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <UserPlus className="h-4 w-4" />
                    </div>
                    <div className="h-full w-px bg-border" />
                  </div>
                  <div className="pb-6">
                    <p className="font-medium">{t("visitors.detail.timeline.registered")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("visitors.detail.timeline.at")} {new Date(visitor.createdAt).toLocaleString(locale)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        isCheckedIn || isCheckedOut
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <LogIn className="h-4 w-4" />
                    </div>
                    {(isCheckedIn || isCheckedOut) && <div className="h-full w-px bg-border" />}
                  </div>
                  <div className={isCheckedIn || isCheckedOut ? "pb-6" : ""}>
                    <p className="font-medium">{t("visitors.detail.timeline.checkedIn")}</p>
                    {visitor.checkedInAt ? (
                      <p className="text-sm text-muted-foreground">
                        {t("visitors.detail.timeline.at")} {new Date(visitor.checkedInAt).toLocaleString(locale)}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {isPending ? t("visitors.list.status.pending") : "-"}
                      </p>
                    )}
                  </div>
                </div>

                {(isCheckedIn || isCheckedOut) && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          isCheckedOut
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <LogOut className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{t("visitors.detail.timeline.checkedOut")}</p>
                      {visitor.checkedOutAt ? (
                        <p className="text-sm text-muted-foreground">
                          {t("visitors.detail.timeline.at")} {new Date(visitor.checkedOutAt).toLocaleString(locale)}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {isCheckedIn ? t("visitors.list.status.checkedIn") : "-"}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {visitor.qrCode && (
            <Card id="qr">
              <CardHeader>
                <CardTitle>{t("visitors.detail.qrCode.title")}</CardTitle>
                <CardDescription>{t("visitors.detail.qrCode.scanInstructions")}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Image
                  src={visitor.qrCode}
                  alt="Visitor QR Code"
                  width={250}
                  height={250}
                  className="rounded-lg border"
                />
              </CardContent>
            </Card>
          )}

          {!isCancelled && !isCheckedOut && (
            <Card>
              <CardHeader>
                <CardTitle>{t("common.actions")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {isPending && (
                    <>
                      <form action={`/${locale}/api/visitors/${visitor.id}/check-in`}>
                        <Button className="w-full" variant="default">
                          <LogIn className="mr-2 h-4 w-4" />
                          {t("visitors.detail.actions.checkIn")}
                        </Button>
                      </form>
                      <form action={`/${locale}/api/visitors/${visitor.id}/cancel`}>
                        <Button className="w-full" variant="destructive">
                          {t("visitors.detail.actions.cancel")}
                        </Button>
                      </form>
                    </>
                  )}
                  {isCheckedIn && (
                    <form action={`/${locale}/api/visitors/${visitor.id}/check-out`}>
                      <Button className="w-full" variant="default">
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("visitors.detail.actions.checkOut")}
                      </Button>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
