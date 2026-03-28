import { getTranslations } from "next-intl/server";
import { getUnits } from "@/lib/visitors";
import { RegisterVisitorForm } from "./register-visitor-form";

export async function generateMetadata() {
  const t = await getTranslations("visitors");
  return {
    title: t("registerTitle"),
  };
}

export default async function RegisterVisitorPage() {
  const t = await getTranslations("visitors");
  const units = await getUnits();

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">{t("registerTitle")}</h1>
      <RegisterVisitorForm units={units} />
    </main>
  );
}
