"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { registerVisitor } from "@/lib/actions/visitors";
import type { Visitor } from "@/types/visitor";

export default function RegisterVisitorPage() {
  const t = useTranslations("visitors.register");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [registeredVisitor, setRegisteredVisitor] = useState<Visitor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    visitorName: z.string().min(1, t("validation.visitorNameRequired")),
    idType: z.enum(["passport", "driver-license", "national-id", "other"]),
    idNumber: z.string().min(1, t("validation.idNumberRequired")),
    vehiclePlate: z.string().optional(),
    expectedArrivalDate: z.string().min(1, t("validation.arrivalDateRequired")),
    expectedArrivalTime: z.string().min(1, t("validation.arrivalTimeRequired")),
    purpose: z.enum(["guest", "delivery", "contractor", "service-provider", "real-estate-agent", "other"]),
    unitNumber: z.string().min(1, t("validation.unitNumberRequired")),
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const result = await registerVisitor(data);
    setIsSubmitting(false);

    if (result.success) {
      setRegisteredVisitor(result.visitor);
    }
  };

  const handleBack = () => {
    router.push(`/${locale}/visitors`);
  };

  const handleRegisterAnother = () => {
    setRegisteredVisitor(null);
  };

  if (registeredVisitor) {
    return (
      <main className="flex flex-1 flex-col gap-6 p-6">
        <h1 className="text-2xl font-semibold">{t("success.title")}</h1>
        <Card>
          <CardHeader>
            <CardTitle>{t("success.title")}</CardTitle>
            <CardDescription>{t("success.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm font-medium">{t("qrCode.title")}</p>
              <p className="text-sm text-muted-foreground">{t("qrCode.description")}</p>
              {registeredVisitor.qrCode && (
                <Image
                  src={registeredVisitor.qrCode}
                  alt="Visitor QR Code"
                  width={200}
                  height={200}
                  className="rounded-lg border"
                />
              )}
            </div>
            <Separator />
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button variant="outline" onClick={handleBack}>
                {tc("back")}
              </Button>
              <Button onClick={handleRegisterAnother}>
                {t("registerNew")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="visitorName">{t("form.visitorName.label")}</Label>
              <Input
                id="visitorName"
                placeholder={t("form.visitorName.placeholder")}
                {...register("visitorName")}
              />
              {errors.visitorName && (
                <p className="text-sm text-red-500">{errors.visitorName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="idType">{t("form.idType.label")}</Label>
                <Select
                  onValueChange={(value) => setValue("idType", value as FormData["idType"])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("form.idType.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">
                      {t("form.idType.options.passport")}
                    </SelectItem>
                    <SelectItem value="driver-license">
                      {t("form.idType.options.driverLicense")}
                    </SelectItem>
                    <SelectItem value="national-id">
                      {t("form.idType.options.nationalId")}
                    </SelectItem>
                    <SelectItem value="other">
                      {t("form.idType.options.other")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.idType && (
                  <p className="text-sm text-red-500">{errors.idType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber">{t("form.idNumber.label")}</Label>
                <Input
                  id="idNumber"
                  placeholder={t("form.idNumber.placeholder")}
                  {...register("idNumber")}
                />
                {errors.idNumber && (
                  <p className="text-sm text-red-500">{errors.idNumber.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehiclePlate">{t("form.vehiclePlate.label")}</Label>
              <Input
                id="vehiclePlate"
                placeholder={t("form.vehiclePlate.placeholder")}
                {...register("vehiclePlate")}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expectedArrivalDate">{t("form.arrivalDate.label")}</Label>
                <Input
                  id="expectedArrivalDate"
                  type="date"
                  {...register("expectedArrivalDate")}
                />
                {errors.expectedArrivalDate && (
                  <p className="text-sm text-red-500">{errors.expectedArrivalDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedArrivalTime">{t("form.arrivalTime.label")}</Label>
                <Input
                  id="expectedArrivalTime"
                  type="time"
                  {...register("expectedArrivalTime")}
                />
                {errors.expectedArrivalTime && (
                  <p className="text-sm text-red-500">{errors.expectedArrivalTime.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="purpose">{t("form.purpose.label")}</Label>
                <Select
                  onValueChange={(value) => setValue("purpose", value as FormData["purpose"])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("form.purpose.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guest">
                      {t("form.purpose.options.guest")}
                    </SelectItem>
                    <SelectItem value="delivery">
                      {t("form.purpose.options.delivery")}
                    </SelectItem>
                    <SelectItem value="contractor">
                      {t("form.purpose.options.contractor")}
                    </SelectItem>
                    <SelectItem value="service-provider">
                      {t("form.purpose.options.serviceProvider")}
                    </SelectItem>
                    <SelectItem value="real-estate-agent">
                      {t("form.purpose.options.realEstateAgent")}
                    </SelectItem>
                    <SelectItem value="other">
                      {t("form.purpose.options.other")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.purpose && (
                  <p className="text-sm text-red-500">{errors.purpose.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitNumber">{t("form.unitNumber.label")}</Label>
                <Input
                  id="unitNumber"
                  placeholder={t("form.unitNumber.placeholder")}
                  {...register("unitNumber")}
                />
                {errors.unitNumber && (
                  <p className="text-sm text-red-500">{errors.unitNumber.message}</p>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                {tc("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("form.submitting") : t("form.submit")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
