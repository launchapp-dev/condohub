import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-4xl font-bold">{t("meta.title")}</h1>
      <p className="text-lg text-muted-foreground">{t("meta.description")}</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
        >
          {t("nav.login")}
        </Link>
        <Link
          href="/signup"
          className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-muted"
        >
          {t("nav.signup")}
        </Link>
      </div>
    </main>
  );
}
