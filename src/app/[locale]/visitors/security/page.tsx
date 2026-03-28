import { getTranslations } from "next-intl/server";
import { getVisitors } from "@/lib/visitors";
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
import { SecurityActions } from "./security-actions";

export async function generateMetadata() {
  const t = await getTranslations("visitors");
  return {
    title: t("securityView"),
  };
}

export default async function SecurityPage() {
  const t = await getTranslations("visitors");
  const visitorsList = await getVisitors();

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">{t("securityView")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("todayVisitors")}</CardTitle>
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
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitorsList.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell className="font-medium">{visitor.name}</TableCell>
                    <TableCell>{visitor.unit?.unitNumber ?? "—"}</TableCell>
                    <TableCell>{visitor.purpose ?? "—"}</TableCell>
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
                    <TableCell className="text-right">
                      <SecurityActions
                        visitorId={visitor.id}
                        status={visitor.status}
                        checkInLabel={t("checkIn")}
                        checkOutLabel={t("checkOut")}
                      />
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
