"use server";

import { db } from "@/db";
import { communities, communityMembers, units, amenities } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export interface OnboardingData {
  community: {
    name: string;
    address: string;
    defaultLocale: string;
    timezone: string;
  };
  units: Array<{
    unitNumber: string;
    floor: number;
  }>;
  amenities: Array<{
    name: string;
    description: string;
    requiresApproval: boolean;
  }>;
}

export async function completeOnboarding(data: OnboardingData): Promise<{
  success: boolean;
  error?: string;
}> {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Check if user already has a community
  const existingMembership = await db.query.communityMembers.findFirst({
    where: eq(communityMembers.userId, user.id),
  });

  if (existingMembership) {
    return { success: false, error: "User already has a community" };
  }

  const now = new Date();

  try {
    // Create community
    const communityId = crypto.randomUUID();
    await db.insert(communities).values({
      id: communityId,
      name: data.community.name,
      address: data.community.address,
      defaultLocale: data.community.defaultLocale,
      timezone: data.community.timezone,
      createdAt: now,
      updatedAt: now,
    });

    // Create community membership with admin role
    await db.insert(communityMembers).values({
      id: crypto.randomUUID(),
      userId: user.id,
      communityId: communityId,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    });

    // Create units
    if (data.units.length > 0) {
      await db.insert(units).values(
        data.units.map((unit) => ({
          id: crypto.randomUUID(),
          communityId: communityId,
          unitNumber: unit.unitNumber,
          floor: unit.floor,
          createdAt: now,
          updatedAt: now,
        }))
      );
    }

    // Create amenities
    if (data.amenities.length > 0) {
      await db.insert(amenities).values(
        data.amenities.map((amenity) => ({
          id: crypto.randomUUID(),
          communityId: communityId,
          name: amenity.name,
          description: amenity.description,
          requiresApproval: amenity.requiresApproval,
          createdAt: now,
          updatedAt: now,
        }))
      );
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Onboarding error:", error);
    return { success: false, error: "Failed to create community" };
  }
}

export async function checkCanOnboard(): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  const existingMembership = await db.query.communityMembers.findFirst({
    where: eq(communityMembers.userId, user.id),
  });

  return !existingMembership;
}
