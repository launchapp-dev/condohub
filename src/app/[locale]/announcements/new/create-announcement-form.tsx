"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createAnnouncement } from "@/lib/announcements";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransition, useState } from "react";
import { toast } from "sonner";

export function CreateAnnouncementForm() {
  const t = useTranslations("announcements");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const schema = z.object({
    title: z.string().min(3, t("form.titleError")),
    content: z.string().min(10, t("form.contentError")),
    category: z.enum(["general", "maintenance", "emergency", "event", "financial", "rules"]),
    pinToTop: z.boolean(),
    scheduledAt: z.string().optional(),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "general",
      pinToTop: false,
    },
  });

  const pinToTop = watch("pinToTop");

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append("subject", data.title);
    formData.append("body", data.content);
    formData.append("priority", mapCategoryToPriority(data.category));
    formData.append("pinToTop", String(data.pinToTop));
    if (data.scheduledAt) {
      formData.append("scheduledAt", data.scheduledAt);
    }

    startTransition(async () => {
      const result = await createAnnouncement(formData);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success(t("form.success"));
        router.push(`/announcements/${result.id}`);
      }
    });
  };

  const mapCategoryToPriority = (category: string): string => {
    switch (category) {
      case "emergency":
        return "urgent";
      case "maintenance":
      case "financial":
        return "high";
      case "event":
      case "rules":
        return "normal";
      case "general":
      default:
        return "normal";
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{t("newTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">{t("form.titleLabel")}</Label>
            <Input
              id="title"
              placeholder={t("form.titlePlaceholder")}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category">{t("form.categoryLabel")}</Label>
            <Select
              defaultValue="general"
              onValueChange={(value) => setValue("category", value as FormData["category"])}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">{t("form.category.general")}</SelectItem>
                <SelectItem value="maintenance">{t("form.category.maintenance")}</SelectItem>
                <SelectItem value="emergency">{t("form.category.emergency")}</SelectItem>
                <SelectItem value="event">{t("form.category.event")}</SelectItem>
                <SelectItem value="financial">{t("form.category.financial")}</SelectItem>
                <SelectItem value="rules">{t("form.category.rules")}</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="content">{t("form.contentLabel")}</Label>
            <Textarea
              id="content"
              placeholder={t("form.contentPlaceholder")}
              rows={8}
              {...register("content")}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="scheduledAt">{t("form.scheduledAt")}</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              {...register("scheduledAt")}
            />
            <p className="text-xs text-muted-foreground">{t("form.scheduledAtHint")}</p>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={pinToTop}
              onCheckedChange={(checked) => setValue("pinToTop", checked as boolean)}
            />
            <Label className="cursor-pointer" onClick={() => setValue("pinToTop", !pinToTop)}>
              {t("form.pinToTop")}
            </Label>
          </div>

          <Button type="submit" disabled={isPending} className="self-start">
            {isPending ? t("form.submitting") : t("form.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
