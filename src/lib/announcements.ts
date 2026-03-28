"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { announcements, communityMembers, announcementComments } from "@/db/schema";

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

export async function getAnnouncements() {
  const session = await getSession();
  const community = await getUserCommunity();
  if (!session || !community) return [];

  const data = await db.query.announcements.findMany({
    where: eq(announcements.communityId, community.id),
    with: {
      author: true,
      comments: {
        with: {
          author: true,
        },
      },
    },
    orderBy: desc(announcements.publishedAt),
  });

  return data;
}

export async function getAnnouncement(id: string) {
  const session = await getSession();
  const community = await getUserCommunity();
  if (!session || !community) return null;

  const data = await db.query.announcements.findFirst({
    where: eq(announcements.id, id),
    with: {
      author: true,
      comments: {
        with: {
          author: true,
        },
        orderBy: desc(announcementComments.createdAt),
      },
    },
  });

  if (!data || data.communityId !== community.id) return null;

  return data;
}

export async function createAnnouncement(formData: FormData) {
  const session = await getSession();
  const community = await getUserCommunity();
  if (!session || !community) {
    return { error: "Unauthorized" };
  }

  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;
  const priority = (formData.get("priority") as string) || "normal";
  const scheduledAtRaw = formData.get("scheduledAt") as string;
  const pinToTop = formData.get("pinToTop") === "true";

  if (!subject || subject.length < 3) {
    return { error: "Title is required and must be at least 3 characters" };
  }

  if (!body || body.length < 10) {
    return { error: "Content is required and must be at least 10 characters" };
  }

  const now = new Date();
  const publishedAt = scheduledAtRaw ? new Date(scheduledAtRaw) : now;
  const id = crypto.randomUUID();

  await db.insert(announcements).values({
    id,
    communityId: community.id,
    authorId: session.user.id,
    subject,
    body,
    priority: priority as "low" | "normal" | "high" | "urgent",
    publishedAt,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/announcements");
  return { success: true, id };
}
