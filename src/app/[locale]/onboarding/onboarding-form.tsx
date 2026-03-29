"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createCommunity } from "@/lib/onboarding";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Building2,
  Home,
  Sparkles,
  Image as ImageIcon,
  Users,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Mexico_City",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Rome",
  "Europe/Amsterdam",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Seoul",
  "Asia/Hong_Kong",
  "Asia/Bangkok",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Pacific/Auckland",
];

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "KRW", name: "South Korean Won" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "AED", name: "UAE Dirham" },
  { code: "SAR", name: "Saudi Riyal" },
];

const predefinedAmenities = [
  { id: "partyRoom", nameKey: "partyRoom" },
  { id: "gym", nameKey: "gym" },
  { id: "pool", nameKey: "pool" },
  { id: "bbq", nameKey: "bbq" },
  { id: "guestParking", nameKey: "guestParking" },
  { id: "coworking", nameKey: "coworking" },
  { id: "tennis", nameKey: "tennis" },
  { id: "playground", nameKey: "playground" },
  { id: "petArea", nameKey: "petArea" },
  { id: "storage", nameKey: "storage" },
  { id: "elevator", nameKey: "elevator" },
  { id: "concierge", nameKey: "concierge" },
];

const unitSchema = z.object({
  unitNumber: z.string().min(1, "required"),
  floor: z.string().optional(),
  tower: z.string().optional(),
});

const inviteSchema = z.object({
  email: z.string().email("invalidEmail").or(z.string().length(0)),
  unitNumber: z.string().optional(),
});

const formSchema = z.object({
  profile: z.object({
    name: z.string().min(1, "required"),
    address: z.string().min(1, "required"),
    timezone: z.string().min(1, "required"),
    defaultLocale: z.string().min(1, "required"),
    currency: z.string().min(1, "required"),
    logoUrl: z.string().optional(),
  }),
  hasTowers: z.boolean(),
  towers: z.array(z.string()),
  units: z.array(unitSchema).min(1, "atLeastOneUnit"),
  amenities: z.array(z.object({
    id: z.string(),
    name: z.string(),
    requiresApproval: z.boolean(),
  })),
  invites: z.array(inviteSchema),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  { id: "profile", icon: Home },
  { id: "building", icon: Building2 },
  { id: "amenities", icon: Sparkles },
  { id: "logo", icon: ImageIcon },
  { id: "invites", icon: Users },
] as const;

interface OnboardingFormProps {
  userName: string;
}

export default function OnboardingForm({ userName }: OnboardingFormProps) {
  const t = useTranslations("onboarding");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [bulkInput, setBulkInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profile: {
        name: "",
        address: "",
        timezone: "UTC",
        defaultLocale: "en",
        currency: "USD",
        logoUrl: "",
      },
      hasTowers: false,
      towers: [],
      units: [],
      amenities: [],
      invites: [{ email: "", unitNumber: "" }],
    },
  });

  const { fields: unitFields, append: appendUnit, remove: removeUnit } = useFieldArray({
    control,
    name: "units",
  });

  const { fields: inviteFields, append: appendInvite, remove: removeInvite } = useFieldArray({
    control,
    name: "invites",
  });

  const hasTowers = watch("hasTowers");
  const towers = watch("towers");
  const selectedAmenities = watch("amenities");

  const handleBulkAddUnits = () => {
    if (!bulkInput.trim()) return;

    const newUnits: { unitNumber: string; floor?: string; tower?: string }[] = [];
    const parts = bulkInput.split(",").map((p) => p.trim());

    parts.forEach((part) => {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((p) => p.trim());
        const startNum = parseInt(start);
        const endNum = parseInt(end);

        if (!isNaN(startNum) && !isNaN(endNum)) {
          for (let i = startNum; i <= endNum; i++) {
            const unitNum = String(i);
            const floor = unitNum.length >= 3 ? parseInt(unitNum.slice(0, -2)) || undefined : undefined;
            newUnits.push({
              unitNumber: unitNum,
              floor: floor ? String(floor) : undefined,
            });
          }
        }
      } else if (part) {
        const floor = part.length >= 3 ? parseInt(part.slice(0, -2)) || undefined : undefined;
        newUnits.push({
          unitNumber: part,
          floor: floor ? String(floor) : undefined,
        });
      }
    });

    newUnits.forEach((unit) => appendUnit(unit));
    setBulkInput("");
  };

  const toggleAmenity = (id: string, name: string) => {
    const exists = selectedAmenities.find((a) => a.id === id);
    if (exists) {
      setValue(
        "amenities",
        selectedAmenities.filter((a) => a.id !== id)
      );
    } else {
      setValue("amenities", [...selectedAmenities, { id, name, requiresApproval: false }]);
    }
  };

  const toggleAmenityApproval = (id: string) => {
    setValue(
      "amenities",
      selectedAmenities.map((a) =>
        a.id === id ? { ...a, requiresApproval: !a.requiresApproval } : a
      )
    );
  };

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const result = await createCommunity({
        community: {
          name: data.profile.name,
          address: data.profile.address,
          timezone: data.profile.timezone,
          defaultLocale: data.profile.defaultLocale,
          currency: data.profile.currency,
          logoUrl: data.profile.logoUrl,
        },
        units: data.units.map((u) => ({
          unitNumber: u.unitNumber,
          floor: u.floor ? parseInt(u.floor) : undefined,
          tower: u.tower,
        })),
        amenities: data.amenities.map((a) => ({
          name: a.name,
          requiresApproval: a.requiresApproval,
        })),
        invites: data.invites.filter((i) => i.email).map((i) => ({
          email: i.email,
          unitNumber: i.unitNumber,
        })),
      });

      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success(t("success.title"));
        router.push("/dashboard");
      }
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return watch("profile.name") && watch("profile.address");
      case 1:
        return unitFields.length > 0;
      default:
        return true;
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCompleted
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`hidden sm:block w-12 md:w-20 h-0.5 mx-2 ${
                        isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {t("progress", { step: currentStep + 1, total: steps.length })} -{" "}
            {t(`steps.${steps[currentStep].id}`)}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Community Profile */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">{t("profile.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("profile.description")}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("profile.nameLabel")}</Label>
                  <Input
                    id="name"
                    placeholder={t("profile.namePlaceholder")}
                    {...register("profile.name")}
                  />
                  {errors.profile?.name && (
                    <p className="text-sm text-destructive">{tCommon("required")}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{t("profile.addressLabel")}</Label>
                  <Input
                    id="address"
                    placeholder={t("profile.addressPlaceholder")}
                    {...register("profile.address")}
                  />
                  {errors.profile?.address && (
                    <p className="text-sm text-destructive">{tCommon("required")}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t("profile.timezoneLabel")}</Label>
                    <Select
                      value={watch("profile.timezone")}
                      onValueChange={(v) => v && setValue("profile.timezone", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("profile.languageLabel")}</Label>
                    <Select
                      value={watch("profile.defaultLocale")}
                      onValueChange={(v) => v && setValue("profile.defaultLocale", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                        <SelectItem value="ko">한국어</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("profile.currencyLabel")}</Label>
                    <Select
                      value={watch("profile.currency")}
                      onValueChange={(v) => v && setValue("profile.currency", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.code} - {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Building Structure */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">{t("building.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("building.description")}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={hasTowers}
                  onCheckedChange={(checked) => setValue("hasTowers", checked as boolean)}
                />
                <Label>{t("building.hasTowersLabel")}</Label>
              </div>

              {hasTowers && (
                <div className="space-y-2">
                  <Label>{t("building.towerNameLabel")}</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder={t("building.towerNamePlaceholder")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = (e.target as HTMLInputElement).value;
                          if (value) {
                            setValue("towers", [...towers, value]);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = (e.currentTarget.previousSibling as HTMLInputElement);
                        if (input?.value) {
                          setValue("towers", [...towers, input.value]);
                          input.value = "";
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {towers.map((tower, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md"
                      >
                        <span className="text-sm">{tower}</span>
                        <button
                          type="button"
                          onClick={() => setValue("towers", towers.filter((_, i) => i !== index))}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Bulk Add */}
              <div className="space-y-2">
                <Label>{t("building.bulkAddLabel")}</Label>
                <p className="text-xs text-muted-foreground">
                  {t("building.bulkAddHelp")}
                </p>
                <div className="flex gap-2">
                  <Input
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder={t("building.bulkAddPlaceholder")}
                  />
                  <Button type="button" variant="outline" onClick={handleBulkAddUnits}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Individual Units */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t("building.unitsLabel")}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendUnit({ unitNumber: "", floor: "", tower: "" })}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {t("building.addUnit")}
                  </Button>
                </div>

                {unitFields.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    {t("building.atLeastOneUnit")}
                  </p>
                )}

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {unitFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <Input
                        placeholder={t("building.unitNumberLabel")}
                        {...register(`units.${index}.unitNumber`)}
                        className="flex-1"
                      />
                      <Input
                        placeholder={t("building.floorLabel")}
                        {...register(`units.${index}.floor`)}
                        className="w-24"
                      />
                      {hasTowers && (
                        <Select
                          value={watch(`units.${index}.tower`) || ""}
                          onValueChange={(v) => v && setValue(`units.${index}.tower`, v)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Tower" />
                          </SelectTrigger>
                          <SelectContent>
                            {towers.map((tower) => (
                              <SelectItem key={tower} value={tower}>
                                {tower}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeUnit(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Amenities */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">{t("amenities.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("amenities.description")}
                </p>
              </div>

              <div>
                <Label className="mb-3 block">{t("amenities.predefinedLabel")}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {predefinedAmenities.map((amenity) => {
                    const isSelected = selectedAmenities.some((a) => a.id === amenity.id);
                    return (
                      <div
                        key={amenity.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground"
                        }`}
                        onClick={() => toggleAmenity(amenity.id, t(`amenities.${amenity.nameKey}`))}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {t(`amenities.${amenity.nameKey}`)}
                          </span>
                          {isSelected && (
                            <Checkbox
                              checked
                              onCheckedChange={() => {}}
                              className="pointer-events-none"
                            />
                          )}
                        </div>
                        {isSelected && (
                          <div className="mt-2 flex items-center gap-2">
                            <Checkbox
                              checked={selectedAmenities.find((a) => a.id === amenity.id)?.requiresApproval}
                              onCheckedChange={() => toggleAmenityApproval(amenity.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-xs text-muted-foreground">
                              {t("amenities.requiresApproval")}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedAmenities.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t("amenities.noAmenities")}
                </p>
              )}
            </div>
          )}

          {/* Step 4: Logo */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">{t("logo.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("logo.description")}
                </p>
              </div>

              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                <div className="flex flex-col items-center justify-center text-center">
                  {watch("profile.logoUrl") ? (
                    <div className="space-y-4">
                      <div className="w-32 h-32 mx-auto bg-muted rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-muted-foreground" />
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setValue("profile.logoUrl", "")}
                        >
                          {t("logo.removeLogo")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        {t("logo.dragDrop")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("logo.fileTypes")}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() => setValue("profile.logoUrl", "placeholder")}
                      >
                        {t("logo.uploadLabel")}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Invites */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">{t("invites.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("invites.description")}
                </p>
              </div>

              <div className="space-y-4">
                {inviteFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-1">
                      <Input
                        placeholder={t("invites.emailPlaceholder")}
                        {...register(`invites.${index}.email`)}
                      />
                    </div>
                    <Input
                      placeholder={t("invites.unitLabel")}
                      {...register(`invites.${index}.unitNumber`)}
                      className="w-32"
                    />
                    {inviteFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInvite(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendInvite({ email: "", unitNumber: "" })}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("invites.addInvite")}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={nextStep}
                  className="w-full"
                >
                  {t("invites.skipInvites")}
                </Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {t("navigation.back")}
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep} disabled={!canProceed()}>
                {t("navigation.next")}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isPending || !canProceed()}>
                {isPending ? t("navigation.saving") : t("navigation.finish")}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
