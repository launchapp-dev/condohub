import { useTranslations } from "next-intl";

export default function CommunitySettingsPage() {
  const t = useTranslations("settings");

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">{t("communitySettings")}</h1>
    </main>
  );
}
