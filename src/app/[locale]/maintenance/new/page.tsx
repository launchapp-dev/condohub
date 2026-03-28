import { useTranslations } from "next-intl";

export default function NewMaintenancePage() {
  const t = useTranslations("maintenance");

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">{t("newTitle")}</h1>
    </main>
  );
}
