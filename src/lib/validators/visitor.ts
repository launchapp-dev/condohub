import { z } from "zod";

export const idTypeEnum = [
  "passport",
  "drivers_license",
  "national_id",
  "other",
] as const;

export const visitorTypeEnum = [
  "guest",
  "delivery",
  "contractor",
  "service_provider",
  "real_estate_agent",
  "other",
] as const;

export const visitorSchema = z.object({
  name: z.string().min(1, "formErrors.required"),
  phone: z.string().optional(),
  idType: z.enum(idTypeEnum).optional(),
  vehiclePlate: z.string().optional(),
  expectedAt: z.string().min(1, "formErrors.required"),
  purpose: z.enum(visitorTypeEnum),
  unitId: z.string().optional(),
});

export type CreateVisitorInput = z.infer<typeof visitorSchema>;
