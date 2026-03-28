"use server";

import { db } from "@/db";
import { visitors } from "@/db/schema";
import { visitorSchema, CreateVisitorInput } from "@/lib/validators/visitor";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { communityMembers, units } from "@/db/schema";

async function getUserCommunity() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const membership = await db.query.communityMembers.findFirst({
    where: eq(communityMembers.userId, session.user.id),
    with: {
      community: true,
    },
  });

  return membership?.community ?? null;
}

export interface CreateVisitorResult {
  success: true;
  visitor: {
    id: string;
    name: string;
    expectedAt: Date | null;
    qrCode: string | null;
    status: string;
  };
}

const purposeMap: Record<string, "Guest" | "Delivery" | "Contractor" | "Service Provider" | "Real Estate Agent" | "Other"> = {
  guest: "Guest",
  delivery: "Delivery",
  contractor: "Contractor",
  service_provider: "Service Provider",
  real_estate_agent: "Real Estate Agent",
  other: "Other",
};

export async function createVisitor(
  formData: CreateVisitorInput
): Promise<CreateVisitorResult> {
  const validatedData = visitorSchema.parse(formData);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const community = await getUserCommunity();
  if (!community) {
    throw new Error("No community found");
  }

  const expectedAt = new Date(validatedData.expectedAt);

  if (isNaN(expectedAt.getTime())) {
    throw new Error("Invalid expected arrival time");
  }

  const qrData = JSON.stringify({
    visitorId: "temp",
    name: validatedData.name,
    expectedAt: expectedAt.toISOString(),
  });

  const qrCode = await QRCode.toDataURL(qrData, {
    width: 256,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  const [visitor] = await db
    .insert(visitors)
    .values({
      communityId: community.id,
      hostId: session.user.id,
      unitId: validatedData.unitId || null,
      name: validatedData.name,
      phone: validatedData.phone || null,
      purpose: purposeMap[validatedData.purpose],
      expectedAt,
      qrCode,
      status: "expected",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({
      id: visitors.id,
      name: visitors.name,
      expectedAt: visitors.expectedAt,
      qrCode: visitors.qrCode,
      status: visitors.status,
    });

  revalidatePath("/visitors");

  return {
    success: true,
    visitor,
  };
}
