"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  Download,
  Trash2,
  FileText,
  Shield,
  Users,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { DocumentUploadForm } from "./document-upload-form";
import { deleteDocument, toggleDocumentVisibility } from "@/actions/documents";
import type { DocumentWithUploader } from "@/actions/documents";
import type { UserRole } from "@/lib/auth";

const categories = [
  "rules",
  "meetingMinutes",
  "financialReports",
  "insurance",
  "legal",
  "forms",
] as const;

interface DocumentsPageClientProps {
  documents: DocumentWithUploader[];
  userRole: UserRole;
}

export function DocumentsPageClient({
  documents,
  userRole,
}: DocumentsPageClientProps) {
  const t = useTranslations("documents");
  const isAdmin = userRole === "admin" || userRole === "board_member";
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  const filteredDocuments =
    categoryFilter === "all"
      ? documents
      : documents.filter((doc) => doc.category === categoryFilter);

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteDocument(id);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success(t("deleteSuccess"));
      }
    });
  };

  const handleToggleVisibility = (id: string, isPublic: boolean) => {
    startTransition(async () => {
      const result = await toggleDocumentVisibility(id, isPublic);
      if ("error" in result) {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        {isAdmin && <DocumentUploadForm />}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>{t("documentList")}</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={categoryFilter}
              onValueChange={(value) => setCategoryFilter(value ?? "all")}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCategories")}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {t(`categories.${cat}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("documentTitle")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("uploadedBy")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("fileSize")}</TableHead>
                <TableHead>{t("visibility")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    {t("noDocuments")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{doc.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {doc.category ? t(`categories.${doc.category as typeof categories[number]}`) : "-"}
                    </TableCell>
                    <TableCell>{doc.uploadedBy.name}</TableCell>
                    <TableCell>
                      {format(doc.createdAt, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {doc.fileSize ? formatFileSize(doc.fileSize) : "-"}
                    </TableCell>
                    <TableCell>
                      <VisibilityBadge isPublic={doc.isPublic} t={t} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={doc.fileUrl}
                          download
                          title={t("download")}
                          className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        {isAdmin && (
                          <>
                            <Switch
                              checked={doc.isPublic}
                              onCheckedChange={(checked) =>
                                handleToggleVisibility(doc.id, checked)
                              }
                              disabled={isPending}
                              title={
                                doc.isPublic
                                  ? t("makeRestricted")
                                  : t("makePublic")
                              }
                            />
                            <DeleteDialog
                              documentTitle={doc.title}
                              onDelete={() => handleDelete(doc.id)}
                              disabled={isPending}
                              t={t}
                            />
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function VisibilityBadge({
  isPublic,
  t,
}: {
  isPublic: boolean;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  if (isPublic) {
    return (
      <Badge variant="secondary">
        <Users className="mr-1 h-3 w-3" />
        {t("public")}
      </Badge>
    );
  }
  return (
    <Badge variant="outline">
      <Shield className="mr-1 h-3 w-3" />
      {t("restricted")}
    </Badge>
  );
}

function DeleteDialog({
  documentTitle,
  onDelete,
  disabled,
  t,
}: {
  documentTitle: string;
  onDelete: () => void;
  disabled: boolean;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive"
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("deleteTitle")}</DialogTitle>
          <DialogDescription>
            {t("deleteConfirm", { title: documentTitle })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            disabled={disabled}
          >
            {t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
