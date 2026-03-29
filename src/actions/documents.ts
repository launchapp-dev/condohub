"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { documents, communityMembers } from "@/db/schema";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import type { UserRole } from "@/lib/auth";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

async function getUserMembership() {
  const session = await getSession();
  if (!session) return null;

  const membership = await db.query.communityMembers.findFirst({
    where: eq(communityMembers.userId, session.user.id),
  });

  return membership;
}

function isAdminRole(role: UserRole): boolean {
  return role === "admin" || role === "board_member";
}

export interface DocumentWithUploader {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string | null;
  fileSize: number | null;
  category: string | null;
  isPublic: boolean;
  createdAt: Date;
  uploadedBy: {
    id: string;
    name: string;
  };
}

export async function getDocuments(): Promise<DocumentWithUploader[] | null> {
  const session = await getSession();
  const membership = await getUserMembership();
  if (!session || !membership?.communityId) return null;

  const isAdmin = isAdminRole(membership.role);

  const docs = await db.query.documents.findMany({
    where: and(
      eq(documents.communityId, membership.communityId),
      isAdmin ? undefined : eq(documents.isPublic, true)
    ),
    with: {
      uploadedBy: true,
    },
    orderBy: desc(documents.createdAt),
  });

  return docs.map((doc) => ({
    id: doc.id,
    title: doc.title,
    fileUrl: doc.fileUrl,
    fileType: doc.fileType,
    fileSize: doc.fileSize,
    category: doc.category,
    isPublic: doc.isPublic,
    createdAt: doc.createdAt,
    uploadedBy: {
      id: doc.uploadedBy.id,
      name: doc.uploadedBy.name,
    },
  }));
}

export async function uploadDocument(formData: FormData) {
  const session = await getSession();
  const membership = await getUserMembership();
  if (!session || !membership?.communityId) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const isPublic = formData.get("isPublic") === "true";
  const file = formData.get("file") as File;

  if (!title || !file || !category) {
    return { error: "Title, file, and category are required" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), "public", "uploads", "documents");
  await mkdir(uploadDir, { recursive: true });

  const fileName = `${crypto.randomUUID()}-${file.name}`;
  const filePath = join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  const fileUrl = `/uploads/documents/${fileName}`;
  const now = new Date();

  await db.insert(documents).values({
    id: crypto.randomUUID(),
    communityId: membership.communityId,
    uploadedById: session.user.id,
    title,
    fileUrl,
    fileType: file.type || null,
    fileSize: file.size,
    category,
    isPublic,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/documents");
  return { success: true };
}

export async function deleteDocument(id: string) {
  const session = await getSession();
  const membership = await getUserMembership();
  if (!session || !membership?.communityId || !isAdminRole(membership.role)) {
    return { error: "Unauthorized" };
  }

  const doc = await db.query.documents.findFirst({
    where: and(
      eq(documents.id, id),
      eq(documents.communityId, membership.communityId)
    ),
  });

  if (!doc) {
    return { error: "Document not found" };
  }

  try {
    const filePath = join(process.cwd(), "public", doc.fileUrl);
    await unlink(filePath);
  } catch {
    // Ignore if file doesn't exist
  }

  await db.delete(documents).where(eq(documents.id, id));

  revalidatePath("/documents");
  return { success: true };
}

export async function toggleDocumentVisibility(id: string, isPublic: boolean) {
  const session = await getSession();
  const membership = await getUserMembership();
  if (!session || !membership?.communityId || !isAdminRole(membership.role)) {
    return { error: "Unauthorized" };
  }

  await db
    .update(documents)
    .set({ isPublic, updatedAt: new Date() })
    .where(
      and(
        eq(documents.id, id),
        eq(documents.communityId, membership.communityId)
      )
    );

  revalidatePath("/documents");
  return { success: true };
}
