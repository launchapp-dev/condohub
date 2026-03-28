"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createVisitor } from "@/lib/visitors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransition } from "react";

export function RegisterVisitorForm({
  units,
}: {
  units: { id: string; unitNumber: string }[];
}) {
  const t = useTranslations("visitors");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const schema = z.object({
    name: z.string().min(1, t("required")),
    phone: z.string().optional(),
    purpose: z.string().optional(),
    expectedAt: z.string().optional(),
    unitId: z.string().optional(),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.phone) formData.append("phone", data.phone);
    if (data.purpose) formData.append("purpose", data.purpose);
    if (data.expectedAt) formData.append("expectedAt", data.expectedAt);
    if (data.unitId) formData.append("unitId", data.unitId);

    startTransition(async () => {
      const result = await createVisitor(formData);
      if ("error" in result) {
        // eslint-disable-next-line no-console
        console.error(result.error);
      } else {
        router.push("/visitors");
      }
    });
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>{t("registerTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input id="phone" type="tel" {...register("phone")} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="purpose">{t("purpose")}</Label>
            <Textarea id="purpose" {...register("purpose")} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="expectedAt">{t("expectedAt")}</Label>
            <Input id="expectedAt" type="datetime-local" {...register("expectedAt")} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="unitId">{t("unit")}</Label>
            <Select onValueChange={(value) => setValue("unitId", value as string)}>
              <SelectTrigger id="unitId">
                <SelectValue placeholder={t("selectUnit")} />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.unitNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isPending} className="mt-2 self-start">
            {isPending ? t("registering") : t("register")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
