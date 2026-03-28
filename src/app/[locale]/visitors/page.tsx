import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getVisitors } from "@/lib/visitors";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export async function generateMetadata() {
  const t = await getTranslations("visitors");
  return {
    title: t("title"),
  };
}

export default async function VisitorsPage() {
  const t = await getTranslations("visitors");
  const visitorsList = await getVisitors();

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <Link
          href="/visitors/register"
          className={buttonVariants({ className: "inline-flex" })}
        >
          <Plus className="me-2 h-4 w-4" />
          {t("register")}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("visitorList")}</CardTitle>
        </CardHeader>
        <CardContent>
          {visitorsList.length === 0 ? (
            <p className="text-muted-foreground">{t("noVisitors")}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("unit")}</TableHead>
                  <TableHead>{t("purpose")}</TableHead>
                  <TableHead>{t("expectedAt")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitorsList.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell>
                      <Link
                        href={`/visitors/${visitor.id}`}
                        className="font-medium hover:underline"
                      >
                        {visitor.name}
                      </Link>
                    </TableCell>
                    <TableCell>{visitor.unit?.unitNumber ?? "—"}</TableCell>
                    <TableCell>{visitor.purpose ?? "—"}</TableCell>
                    <TableCell>
                      {visitor.expectedAt
                        ? new Date(visitor.expectedAt).toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {visitor.status === "checked_in" && (
                        <Badge variant="default">{t("statusCheckedIn")}</Badge>
                      )}
                      {visitor.status === "checked_out" && (
                        <Badge variant="secondary">{t("statusCheckedOut")}</Badge>
                      )}
                      {visitor.status === "expected" && (
                        <Badge variant="outline">{t("statusExpected")}</Badge>
                      )}
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
