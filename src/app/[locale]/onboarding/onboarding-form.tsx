"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { completeOnboarding, type OnboardingData } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Home,
  Sparkles,
  Users,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const supportedTimezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Vancouver",
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
  "Asia/Mumbai",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Pacific/Auckland",
];

type Step = "community" | "units" | "amenities" | "review";

interface OnboardingFormProps {
  userName: string;
}

export default function OnboardingForm({ userName }: OnboardingFormProps) {
  const t = useTranslations("onboarding");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("community");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepOrder: Step[] = ["community", "units", "amenities", "review"];
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / stepOrder.length) * 100;

  // Schema for each step
  const communitySchema = z.object({
    name: z.string().min(1, t("errors.communityNameRequired")),
    address: z.string().min(1, t("errors.addressRequired")),
    defaultLocale: z.string(),
    timezone: z.string(),
  });

  const unitSchema = z.object({
    unitNumber: z.string().min(1, t("errors.unitNumberRequired")),
    floor: z.number().min(0, t("errors.floorRequired")),
  });

  const amenitySchema = z.object({
    name: z.string().min(1, t("errors.amenityNameRequired")),
    description: z.string(),
    requiresApproval: z.boolean(),
  });

  const formSchema = z.object({
    community: communitySchema,
    units: z.array(unitSchema).min(1, t("errors.atLeastOneUnit")),
    amenities: z.array(amenitySchema),
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      community: {
        name: "",
        address: "",
        defaultLocale: locale,
        timezone: "UTC",
      },
      units: [],
      amenities: [],
    },
  });

  const {
    fields: unitFields,
    append: appendUnit,
    remove: removeUnit,
  } = useFieldArray({
    control,
    name: "units",
  });

  const {
    fields: amenityFields,
    append: appendAmenity,
    remove: removeAmenity,
  } = useFieldArray({
    control,
    name: "amenities",
  });

  const watchUnits = watch("units");
  const watchAmenities = watch("amenities");

  const validateStep = async (): Promise<boolean> => {
    if (currentStep === "community") {
      return await trigger("community");
    }
    if (currentStep === "units") {
      return watchUnits.length > 0;
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (!isValid) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    const onboardingData: OnboardingData = {
      community: data.community,
      units: data.units,
      amenities: data.amenities,
    };

    const result = await completeOnboarding(onboardingData);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || t("errors.generic"));
      setIsSubmitting(false);
    }
  };

  const addUnit = () => {
    appendUnit({ unitNumber: "", floor: 1 });
  };

  const addAmenity = () => {
    appendAmenity({ name: "", description: "", requiresApproval: false });
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <Progress value={progress} className="mb-4" />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span className={currentStep === "community" ? "font-medium text-foreground" : ""}>
          {t("steps.community")}
        </span>
        <span className={currentStep === "units" ? "font-medium text-foreground" : ""}>
          {t("steps.units")}
        </span>
        <span className={currentStep === "amenities" ? "font-medium text-foreground" : ""}>
          {t("steps.amenities")}
        </span>
        <span className={currentStep === "review" ? "font-medium text-foreground" : ""}>
          {t("steps.review")}
        </span>
      </div>
    </div>
  );

  const renderCommunityStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">{t("community.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("community.subtitle")}</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="communityName">{t("community.name")}</Label>
          <Input
            id="communityName"
            placeholder={t("community.namePlaceholder")}
            {...register("community.name")}
          />
          {errors.community?.name && (
            <p className="text-sm text-destructive">{errors.community.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="communityAddress">{t("community.address")}</Label>
          <Input
            id="communityAddress"
            placeholder={t("community.addressPlaceholder")}
            {...register("community.address")}
          />
          {errors.community?.address && (
            <p className="text-sm text-destructive">{errors.community.address.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="defaultLocale">{t("community.language")}</Label>
            <Select
              defaultValue={locale}
              onValueChange={(value) => value && setValue("community.defaultLocale", value)}
            >
              <SelectTrigger id="defaultLocale">
                <SelectValue placeholder={t("community.languagePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t("languages.en")}</SelectItem>
                <SelectItem value="es">{t("languages.es")}</SelectItem>
                <SelectItem value="pt">{t("languages.pt")}</SelectItem>
                <SelectItem value="fr">{t("languages.fr")}</SelectItem>
                <SelectItem value="ar">{t("languages.ar")}</SelectItem>
                <SelectItem value="zh">{t("languages.zh")}</SelectItem>
                <SelectItem value="ja">{t("languages.ja")}</SelectItem>
                <SelectItem value="ko">{t("languages.ko")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">{t("community.timezone")}</Label>
            <Select
              defaultValue="UTC"
              onValueChange={(value) => value && setValue("community.timezone", value)}
            >
              <SelectTrigger id="timezone">
                <SelectValue placeholder={t("community.timezonePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {supportedTimezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUnitsStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Home className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">{t("units.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("units.subtitle")}</p>
        </div>
      </div>

      <div className="space-y-4">
        {unitFields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`unit-${index}-number`}>{t("units.unitNumber")}</Label>
                  <Input
                    id={`unit-${index}-number`}
                    placeholder={t("units.unitNumberPlaceholder")}
                    {...register(`units.${index}.unitNumber`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`unit-${index}-floor`}>{t("units.floor")}</Label>
                  <Input
                    id={`unit-${index}-floor`}
                    type="number"
                    min={0}
                    {...register(`units.${index}.floor`, { valueAsNumber: true })}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUnit(index)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("units.remove")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addUnit}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("units.add")}
        </Button>

        {watchUnits.length === 0 && (
          <p className="text-sm text-destructive">{t("errors.atLeastOneUnit")}</p>
        )}
      </div>
    </div>
  );

  const renderAmenitiesStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">{t("amenities.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("amenities.subtitle")}</p>
        </div>
      </div>

      <div className="space-y-4">
        {amenityFields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`amenity-${index}-name`}>{t("amenities.name")}</Label>
                  <Input
                    id={`amenity-${index}-name`}
                    placeholder={t("amenities.namePlaceholder")}
                    {...register(`amenities.${index}.name`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`amenity-${index}-description`}>
                    {t("amenities.description")}
                  </Label>
                  <Input
                    id={`amenity-${index}-description`}
                    placeholder={t("amenities.descriptionPlaceholder")}
                    {...register(`amenities.${index}.description`)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${index}-approval`}
                    {...register(`amenities.${index}.requiresApproval`)}
                  />
                  <Label htmlFor={`amenity-${index}-approval`} className="text-sm">
                    {t("amenities.requiresApproval")}
                  </Label>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAmenity(index)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("amenities.remove")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addAmenity}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("amenities.add")}
        </Button>

        {amenityFields.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            {t("amenities.skipHint")}
          </p>
        )}
      </div>
    </div>
  );

  const renderReviewStep = () => {
    const communityData = watch("community");
    const unitsData = watch("units");
    const amenitiesData = watch("amenities");

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium">{t("review.title")}</h3>
            <p className="text-sm text-muted-foreground">{t("review.subtitle")}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("review.communityInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t("review.name")}</span>
                <span className="text-sm font-medium">{communityData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t("review.address")}</span>
                <span className="text-sm font-medium">{communityData.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t("review.language")}</span>
                <span className="text-sm font-medium">{communityData.defaultLocale}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t("review.timezone")}</span>
                <span className="text-sm font-medium">{communityData.timezone}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("review.unitsInfo")}</CardTitle>
              <CardDescription>
                {t("review.unitsCount", { count: unitsData.length })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {unitsData.slice(0, 10).map((unit, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium"
                  >
                    {unit.unitNumber}
                  </span>
                ))}
                {unitsData.length > 10 && (
                  <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium">
                    +{unitsData.length - 10}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("review.amenitiesInfo")}</CardTitle>
              <CardDescription>
                {t("review.amenitiesCount", { count: amenitiesData.length })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {amenitiesData.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("review.noAmenities")}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {amenitiesData.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium"
                    >
                      {amenity.name}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "community":
        return renderCommunityStep();
      case "units":
        return renderUnitsStep();
      case "amenities":
        return renderAmenitiesStep();
      case "review":
        return renderReviewStep();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl">
      <Card className="border-0 shadow-none sm:border sm:shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("welcome", { name: userName })}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepIndicator()}
          {renderCurrentStep()}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-between px-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {tc("back")}
        </Button>

        {currentStep === "review" ? (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? tc("loading") : t("complete")}
          </Button>
        ) : (
          <Button type="button" onClick={handleNext}>
            {tc("next")}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
