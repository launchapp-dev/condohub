import * as z from "zod";

export const communityProfileSchema = z.object({
  name: z.string().min(1, "required"),
  address: z.string().min(1, "required"),
  timezone: z.string().min(1, "required"),
  defaultLocale: z.string().min(1, "required"),
  currency: z.string().min(1, "required"),
  logoUrl: z.string().optional(),
});

export const unitSchema = z.object({
  unitNumber: z.string().min(1, "required"),
  floor: z.number().optional(),
  tower: z.string().optional(),
});

export const buildingStructureSchema = z.object({
  hasTowers: z.boolean(),
  towers: z.array(z.string()).optional(),
  units: z.array(unitSchema).min(1, "atLeastOneUnit"),
});

export const amenitySchema = z.object({
  name: z.string().min(1, "required"),
  description: z.string().optional(),
  requiresApproval: z.boolean(),
});

export const amenitiesSchema = z.object({
  amenities: z.array(amenitySchema),
});

export const inviteSchema = z.object({
  email: z.string().email("invalidEmail"),
  unitNumber: z.string().optional(),
});

export const invitesSchema = z.object({
  invites: z.array(inviteSchema),
});

export const onboardingSchema = z.object({
  profile: communityProfileSchema,
  building: buildingStructureSchema,
  amenities: amenitiesSchema,
  invites: invitesSchema,
});

export type CommunityProfileData = z.infer<typeof communityProfileSchema>;
export type BuildingStructureData = z.infer<typeof buildingStructureSchema>;
export type AmenitiesData = z.infer<typeof amenitiesSchema>;
export type InvitesData = z.infer<typeof invitesSchema>;
export type OnboardingData = z.infer<typeof onboardingSchema>;
