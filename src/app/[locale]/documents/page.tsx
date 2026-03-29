import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth";
import { getDocuments } from "@/actions/documents";
import { DocumentsPageClient } from "@/components/documents/documents-page-client";

async function DocumentsContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.communityId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <h1 className="text-2xl font-semibold">Documents</h1>
        <p className="text-muted-foreground text-center max-w-md">
          You are not yet a member of any community.
        </p>
      </div>
    );
  }

  const documents = await getDocuments();

  return (
    <DocumentsPageClient
      documents={documents || []}
      userRole={user.role || "resident"}
    />
  );
}

export async function generateMetadata() {
  const t = await getTranslations("documents");
  return {
    title: t("title"),
  };
}

export default function DocumentsPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <Suspense fallback={<DocumentsSkeleton />}>
        <DocumentsContent />
      </Suspense>
    </main>
  );
}

function DocumentsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 rounded bg-muted" />
        <div className="h-10 w-32 rounded bg-muted" />
      </div>
      <div className="rounded-lg border">
        <div className="h-12 border-b bg-muted/50" />
        <div className="h-16 border-b" />
        <div className="h-16 border-b" />
        <div className="h-16 border-b" />
        <div className="h-16" />
      </div>
    </div>
  );
}
