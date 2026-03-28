import { useTranslations } from "next-intl";

export default function RegisterVisitorPage() {
  const t = useTranslations("visitors");

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">{t("registerTitle")}</h1>
    </main>
  );
}
