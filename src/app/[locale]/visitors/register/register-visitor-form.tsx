"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  visitorSchema,
  CreateVisitorInput,
  idTypeEnum,
  visitorTypeEnum,
} from "@/lib/validators/visitor";
import { createVisitor } from "@/actions/visitors";
import { Download, Share, QrCode, User, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

interface VisitorResult {
  id: string;
  name: string;
  expectedAt: Date | null;
  qrCode: string | null;
  status: string;
}

interface RegisterVisitorFormProps {
  units: { id: string; unitNumber: string }[];
}

export function RegisterVisitorForm({ units }: RegisterVisitorFormProps) {
  const t = useTranslations("visitors");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<VisitorResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateVisitorInput>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      name: "",
      phone: "",
      idType: undefined,
      vehiclePlate: "",
      expectedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      purpose: "guest",
      unitId: "",
    },
  });

  const selectedIdType = watch("idType");
  const selectedPurpose = watch("purpose");

  const onSubmit = async (data: CreateVisitorInput) => {
    setIsSubmitting(true);
    try {
      const response = await createVisitor(data);
      if (response.success) {
        setResult(response.visitor);
        toast.success(t("visitorRegistered"));
      }
    } catch (error) {
      toast.error(t("formErrors.generic") || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadQR = () => {
    if (!result?.qrCode) return;
    const link = document.createElement("a");
    link.href = result.qrCode;
    link.download = `visitor-pass-${result.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!result) return;
    const expectedAtStr = result.expectedAt
      ? format(new Date(result.expectedAt), "PPp")
      : "N/A";
    const shareData = {
      title: t("visitorPass"),
      text: `${t("name")}: ${result.name}\n${t("expectedAt")}: ${expectedAtStr}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(
        `${shareData.title}\n${shareData.text}\n${result.qrCode || ""}`
      );
      toast.success(t("qrCodeCopied") || "Copied to clipboard");
    }
  };

  const handleReset = () => {
    setResult(null);
    reset();
  };

  if (result) {
    return (
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              {t("visitorPass")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="rounded-lg border bg-white p-4">
              {result.qrCode ? (
                <img
                  src={result.qrCode}
                  alt={t("qrCodeGenerated")}
                  className="h-48 w-48"
                />
              ) : (
                <div className="flex h-48 w-48 items-center justify-center text-muted-foreground">
                  QR Code Error
                </div>
              )}
            </div>

            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("name")}:</span>
                <span>{result.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("expectedAt")}:</span>
                <span>
                  {result.expectedAt
                    ? format(new Date(result.expectedAt), "PPp")
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("status")}:</span>
                <Badge variant="outline">{result.status}</Badge>
              </div>
            </div>

            <Separator />

            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleDownloadQR}
              >
                <Download className="mr-2 h-4 w-4" />
                {t("qrCodeDownload")}
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleShare}>
                <Share className="mr-2 h-4 w-4" />
                {t("share")}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleReset}>
              {t("register")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{t("registerTitle")}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Visitor Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                {t("name")}
                <span className="text-destructive"> *</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={t("name")}
                {...register("name")}
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {t(errors.name.message || "formErrors.required")}
                </p>
              )}
            </div>

            {/* Phone and ID Type Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  {t("phone")}
                  <span className="text-muted-foreground text-xs ml-1">
                    ({t("optional")})
                  </span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t("phone")}
                  {...register("phone")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idType">
                  {t("idType")}
                  <span className="text-muted-foreground text-xs ml-1">
                    ({t("optional")})
                  </span>
                </Label>
                <Select
                  value={selectedIdType || ""}
                  onValueChange={(value) =>
                    setValue("idType", value as typeof idTypeEnum[number])
                  }
                >
                  <SelectTrigger id="idType">
                    <SelectValue placeholder={t("idType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">
                      {t("idTypePassport")}
                    </SelectItem>
                    <SelectItem value="drivers_license">
                      {t("idTypeDriversLicense")}
                    </SelectItem>
                    <SelectItem value="national_id">
                      {t("idTypeNationalId")}
                    </SelectItem>
                    <SelectItem value="other">{t("idTypeOther")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Vehicle Plate and Unit Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="vehiclePlate">
                  {t("vehiclePlate")}
                  <span className="text-muted-foreground text-xs ml-1">
                    ({t("optional")})
                  </span>
                </Label>
                <Input
                  id="vehiclePlate"
                  type="text"
                  placeholder={t("vehiclePlate")}
                  {...register("vehiclePlate")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitId">
                  {t("unit")}
                  <span className="text-muted-foreground text-xs ml-1">
                    ({t("optional")})
                  </span>
                </Label>
                <Select
                  value={watch("unitId") || ""}
                  onValueChange={(value) =>
                    setValue("unitId", value || undefined)
                  }
                >
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
            </div>

            {/* Expected Arrival and Purpose Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expectedAt">
                  {t("expectedAt")}
                  <span className="text-destructive"> *</span>
                </Label>
                <Input
                  id="expectedAt"
                  type="datetime-local"
                  {...register("expectedAt")}
                  aria-invalid={errors.expectedAt ? "true" : "false"}
                />
                {errors.expectedAt && (
                  <p className="text-sm text-destructive">
                    {t(
                      errors.expectedAt.message || "formErrors.invalidTime"
                    )}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">
                  {t("visitorType")}
                  <span className="text-destructive"> *</span>
                </Label>
                <Select
                  value={selectedPurpose}
                  onValueChange={(value) =>
                    setValue("purpose", value as typeof visitorTypeEnum[number])
                  }
                >
                  <SelectTrigger id="purpose">
                    <SelectValue placeholder={t("visitorType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guest">
                      {t("visitorTypeGuest")}
                    </SelectItem>
                    <SelectItem value="delivery">
                      {t("visitorTypeDelivery")}
                    </SelectItem>
                    <SelectItem value="contractor">
                      {t("visitorTypeContractor")}
                    </SelectItem>
                    <SelectItem value="service_provider">
                      {t("visitorTypeServiceProvider")}
                    </SelectItem>
                    <SelectItem value="real_estate_agent">
                      {t("visitorTypeRealEstateAgent")}
                    </SelectItem>
                    <SelectItem value="other">
                      {t("visitorTypeOther")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.purpose && (
                  <p className="text-sm text-destructive">
                    {t(errors.purpose.message || "formErrors.required")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("loading") : t("register")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
