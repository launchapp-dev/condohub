"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { visitors, visitorLogs, communityMembers, units } from "@/db/schema";
import QRCode from "qrcode";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

async function getUserCommunity() {
  const session = await getSession();
  if (!session) return null;

  const membership = await db.query.communityMembers.findFirst({
    where: eq(communityMembers.userId, session.user.id),
    with: {
      community: true,
    },
  });

  return membership?.community ?? null;
}

export async function getVisitors() {
  const session = await getSession();
  const community = await getUserCommunity();
  if (!session || !community) return [];

  const data = await db.query.visitors.findMany({
    where: eq(visitors.communityId, community.id),
    with: {
      unit: true,
      host: true,
      logs: {
        orderBy: desc(visitorLogs.performedAt),
      },
    },
    orderBy: desc(visitors.createdAt),
  });

  return data;
}

export async function getVisitor(id: string) {
  const session = await getSession();
  const community = await getUserCommunity();
  if (!session || !community) return null;

  const data = await db.query.visitors.findFirst({
    where: and(
      eq(visitors.id, id),
      eq(visitors.communityId, community.id)
    ),
    with: {
      unit: true,
      host: true,
      logs: {
        with: {
          performedBy: true,
        },
        orderBy: desc(visitorLogs.performedAt),
      },
    },
  });

  return data;
}

export async function createVisitor(formData: FormData) {
  const session = await getSession();
  const community = await getUserCommunity();
  if (!session || !community) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const phone = (formData.get("phone") as string) || null;
  const purpose = (formData.get("purpose") as string) || null;
  const expectedAtRaw = formData.get("expectedAt") as string;
  const unitId = (formData.get("unitId") as string) || null;

  if (!name) {
    return { error: "Name is required" };
  }

  const expectedAt = expectedAtRaw ? new Date(expectedAtRaw) : null;
  const now = new Date();

  await db.insert(visitors).values({
    communityId: community.id,
    hostId: session.user.id,
    unitId,
    name,
    phone,
    purpose: purpose as typeof visitors.$inferInsert["purpose"],
    expectedAt,
    status: "expected",
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/visitors");
  return { success: true };
}

export async function checkInVisitor(id: string) {
  const session = await getSession();
  const community = await getUserCommunity();
  if (!session || !community) {
    return { error: "Unauthorized" };
  }

  const now = new Date();

  await db
    .update(visitors)
    .set({ status: "checked_in", updatedAt: now })
    .where(and(eq(visitors.id, id), eq(visitors.communityId, community.id)));

  await db.insert(visitorLogs).values({
    id: crypto.randomUUID(),
    visitorId: id,
    action: "check_in",
    performedById: session.user.id,
    performedAt: now,
  });

  revalidatePath("/visitors");
  revalidatePath("/visitors/security");
  revalidatePath(`/visitors/${id}`);
  return { success: true };
}

export async function checkOutVisitor(id: string) {
  const session = await getSession();
  const community = await getUserCommunity();
  if (!session || !community) {
    return { error: "Unauthorized" };
  }

  const now = new Date();

  await db
    .update(visitors)
    .set({ status: "checked_out", updatedAt: now })
    .where(and(eq(visitors.id, id), eq(visitors.communityId, community.id)));

  await db.insert(visitorLogs).values({
    id: crypto.randomUUID(),
    visitorId: id,
    action: "check_out",
    performedById: session.user.id,
    performedAt: now,
  });

  revalidatePath("/visitors");
  revalidatePath("/visitors/security");
  revalidatePath(`/visitors/${id}`);
  return { success: true };
}

export async function generateVisitorQr(id: string) {
  const session = await getSession();
  const community = await getUserCommunity();
  if (!session || !community) return null;

  const visitor = await db.query.visitors.findFirst({
    where: and(eq(visitors.id, id), eq(visitors.communityId, community.id)),
  });

  if (!visitor) return null;

  const url = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/visitors/${visitor.id}`;
  return QRCode.toDataURL(url);
}

export async function getUnits() {
  const community = await getUserCommunity();
  if (!community) return [];

  return db.query.units.findMany({
    where: eq(units.communityId, community.id),
    orderBy: units.unitNumber,
  });
}
