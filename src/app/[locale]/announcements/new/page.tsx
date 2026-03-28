import { useTranslations } from "next-intl";
import { CreateAnnouncementForm } from "./create-announcement-form";

export default function NewAnnouncementPage() {
  const t = useTranslations("announcements");

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">{t("newTitle")}</h1>
      <CreateAnnouncementForm />
    </main>
  );
}
