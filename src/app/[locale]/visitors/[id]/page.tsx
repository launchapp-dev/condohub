import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getVisitor, generateVisitorQr } from "@/lib/visitors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export async function generateMetadata() {
  const t = await getTranslations("visitors");
  return {
    title: t("visitorDetails"),
  };
}

export default async function VisitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("visitors");
  const { id } = await params;
  const visitor = await getVisitor(id);

  if (!visitor) {
    notFound();
  }

  const qrCode = await generateVisitorQr(id);

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">{t("visitorDetails")}</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{visitor.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("status")}</p>
                <div className="mt-1">
                  {visitor.status === "checked_in" && (
                    <Badge variant="default">{t("statusCheckedIn")}</Badge>
                  )}
                  {visitor.status === "checked_out" && (
                    <Badge variant="secondary">{t("statusCheckedOut")}</Badge>
                  )}
                  {visitor.status === "expected" && (
                    <Badge variant="outline">{t("statusExpected")}</Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("unit")}</p>
                <p className="font-medium">{visitor.unit?.unitNumber ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("phone")}</p>
                <p className="font-medium">{visitor.phone ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("expectedAt")}</p>
                <p className="font-medium">
                  {visitor.expectedAt
                    ? new Date(visitor.expectedAt).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">{t("purpose")}</p>
              <p className="font-medium">{visitor.purpose ?? "—"}</p>
            </div>

            {visitor.logs.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">{t("history")}</p>
                  <ul className="mt-2 space-y-2">
                    {visitor.logs.map((log) => (
                      <li key={log.id} className="text-sm">
                        <span className="font-medium">
                          {log.action === "check_in"
                            ? t("checkedInAt")
                            : t("checkedOutAt")}
                        </span>{" "}
                        {new Date(log.performedAt).toLocaleString()}
                        {log.performedBy && (
                          <span className="text-muted-foreground">
                            {" "}— {log.performedBy.name}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("qrPass")}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {qrCode ? (
              <img
                src={qrCode}
                alt={t("qrPass")}
                className="h-64 w-64 rounded-lg border"
              />
            ) : (
              <p className="text-muted-foreground">{t("noQrPass")}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
