import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getVisitors } from "@/lib/actions/visitors";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import type { VisitorStatus } from "@/types/visitor";

interface VisitorsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ filter?: string }>;
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

function formatPurpose(
  purpose: string,
  t: (key: string) => string
): string {
  const purposeMap: Record<string, string> = {
    guest: t("visitors.register.form.purpose.options.guest"),
    delivery: t("visitors.register.form.purpose.options.delivery"),
    contractor: t("visitors.register.form.purpose.options.contractor"),
    "service-provider": t("visitors.register.form.purpose.options.serviceProvider"),
    "real-estate-agent": t("visitors.register.form.purpose.options.realEstateAgent"),
    other: t("visitors.register.form.purpose.options.other"),
  };
  return purposeMap[purpose] || purpose;
}

export async function generateMetadata() {
  const t = await getTranslations("visitors");
  return {
    title: t("title"),
  };
}

export default async function VisitorsPage({ params, searchParams }: VisitorsPageProps) {
  const { locale } = await params;
  const { filter } = await searchParams;
  const t = await getTranslations();

  const statusFilter = filter as VisitorStatus | undefined;
  const visitors = await getVisitors(
    statusFilter ? { status: statusFilter } : undefined
  );

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("visitors.list.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("visitors.list.description")}</p>
        </div>
        <Link
          href={`/${locale}/visitors/register`}
          className={buttonVariants({ className: "inline-flex" })}
        >
          <Plus className="me-2 h-4 w-4" />
          {t("visitors.registerNew")}
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href={`/${locale}/visitors`}>
          <Badge
            variant={!filter ? "default" : "outline"}
            className="cursor-pointer px-3 py-1"
          >
            {t("visitors.list.filter.all")}
          </Badge>
        </Link>
        <Link href={`/${locale}/visitors?filter=upcoming`}>
          <Badge
            variant={filter === "upcoming" ? "default" : "outline"}
            className="cursor-pointer px-3 py-1"
          >
            {t("visitors.list.filter.upcoming")}
          </Badge>
        </Link>
        <Link href={`/${locale}/visitors?filter=past`}>
          <Badge
            variant={filter === "past" ? "default" : "outline"}
            className="cursor-pointer px-3 py-1"
          >
            {t("visitors.list.filter.past")}
          </Badge>
        </Link>
        <Link href={`/${locale}/visitors?filter=checked-in`}>
          <Badge
            variant={filter === "checked-in" ? "default" : "outline"}
            className="cursor-pointer px-3 py-1"
          >
            {t("visitors.list.filter.checkedIn")}
          </Badge>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("visitors.visitorList")}</CardTitle>
        </CardHeader>
        <CardContent>
          {visitors.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg font-medium">{t("visitors.list.noVisitors")}</p>
              <p className="text-sm text-muted-foreground">
                {t("visitors.list.noVisitorsDescription")}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("visitors.name")}</TableHead>
                  <TableHead>{t("visitors.unit")}</TableHead>
                  <TableHead>{t("visitors.purpose")}</TableHead>
                  <TableHead>{t("visitors.expectedAt")}</TableHead>
                  <TableHead>{t("visitors.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell>
                      <Link
                        href={`/${locale}/visitors/${visitor.id}`}
                        className="font-medium hover:underline"
                      >
                        {visitor.visitorName}
                      </Link>
                    </TableCell>
                    <TableCell>{visitor.unitNumber ?? "—"}</TableCell>
                    <TableCell>{formatPurpose(visitor.purpose, t) ?? "—"}</TableCell>
                    <TableCell>
                      {new Date(visitor.expectedArrivalDate).toLocaleDateString(locale)} {visitor.expectedArrivalTime}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(visitor.status)}>
                        {t(`visitors.list.status.${visitor.status.replace("-", "")}`)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
