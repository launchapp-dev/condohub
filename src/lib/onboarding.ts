"use server";

import { db } from "@/db";
import { communities, units, amenities, communityMembers } from "@/db/schema";
import { generateId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface CreateCommunityInput {
  community: {
    name: string;
    address: string;
    timezone: string;
    defaultLocale: string;
    currency: string;
    logoUrl?: string;
  };
  units: Array<{
    unitNumber: string;
    floor?: number;
    tower?: string;
  }>;
  amenities: Array<{
    name: string;
    requiresApproval: boolean;
  }>;
  invites: Array<{
    email: string;
    unitNumber?: string;
  }>;
}

export async function createCommunity(input: CreateCommunityInput): Promise<{ success: true } | { error: string }> {
  try {
    const communityId = generateId();
    const now = new Date();

    // Create community
    await db.insert(communities).values({
      id: communityId,
      name: input.community.name,
      address: input.community.address,
      logoUrl: input.community.logoUrl ?? null,
      timezone: input.community.timezone,
      defaultLocale: input.community.defaultLocale,
      currency: input.community.currency,
      createdAt: now,
      updatedAt: now,
    });

    // Create units
    if (input.units.length > 0) {
      await db.insert(units).values(
        input.units.map((unit) => ({
          id: generateId(),
          communityId,
          unitNumber: unit.unitNumber,
          floor: unit.floor ?? null,
          tower: unit.tower ?? null,
          ownerId: null as string | null,
          createdAt: now,
          updatedAt: now,
        }))
      );
    }

    // Create amenities
    if (input.amenities.length > 0) {
      await db.insert(amenities).values(
        input.amenities.map((amenity) => ({
          id: generateId(),
          communityId,
          name: amenity.name,
          description: null as string | null,
          maxDurationMinutes: null as number | null,
          requiresApproval: amenity.requiresApproval,
          createdAt: now,
          updatedAt: now,
        }))
      );
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error creating community:", error);
    return { error: "Failed to create community. Please try again." };
  }
}
