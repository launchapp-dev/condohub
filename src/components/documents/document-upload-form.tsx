"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { uploadDocument } from "@/actions/documents";

const categories = [
  "rules",
  "meetingMinutes",
  "financialReports",
  "insurance",
  "legal",
  "forms",
] as const;

interface DocumentUploadFormProps {
  children?: React.ReactNode;
}

export function DocumentUploadForm({ children }: DocumentUploadFormProps) {
  const t = useTranslations("documents");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const schema = z.object({
    title: z.string().min(1, t("titleRequired")),
    category: z.enum(categories),
    isPublic: z.boolean(),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "rules",
      isPublic: false,
    },
  });

  const isPublic = watch("isPublic");

  const onSubmit = (data: FormData) => {
    if (!selectedFile) {
      toast.error(t("fileRequired"));
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("isPublic", String(data.isPublic));
    formData.append("file", selectedFile);

    startTransition(async () => {
      const result = await uploadDocument(formData);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success(t("uploadSuccess"));
        reset();
        setSelectedFile(null);
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children || (
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            {t("upload")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("uploadTitle")}</DialogTitle>
          <DialogDescription>{t("uploadDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="document-title">{t("documentTitle")}</Label>
            <Input
              id="document-title"
              placeholder={t("titlePlaceholder")}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="document-category">{t("category")}</Label>
            <Select
              defaultValue="rules"
              onValueChange={(value) =>
                setValue("category", value as FormData["category"])
              }
            >
              <SelectTrigger id="document-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {t(`categories.${cat}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="document-file">{t("fileLabel")}</Label>
            <Input
              id="document-file"
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            {selectedFile && (
              <p className="text-xs text-muted-foreground">
                {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={isPublic}
              onCheckedChange={(checked) =>
                setValue("isPublic", checked as boolean)
              }
            />
            <Label
              className="cursor-pointer"
              onClick={() => setValue("isPublic", !isPublic)}
            >
              {t("makePublic")}
            </Label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("uploading") : t("uploadSubmit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
