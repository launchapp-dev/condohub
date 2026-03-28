import { useTranslations } from "next-intl";

export default function DocumentsPage() {
  const t = useTranslations("documents");

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
    </main>
  );
}
