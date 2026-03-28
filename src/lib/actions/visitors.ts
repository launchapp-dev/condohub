"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import QRCode from "qrcode";
import { createId } from "@paralleldrive/cuid2";
import type { Visitor, CreateVisitorInput, VisitorStatus } from "@/types/visitor";

const createVisitorSchema = z.object({
  visitorName: z.string().min(1, "Visitor name is required"),
  idType: z.enum(["passport", "driver-license", "national-id", "other"]),
  idNumber: z.string().min(1, "ID number is required"),
  vehiclePlate: z.string().optional(),
  expectedArrivalDate: z.string().min(1, "Arrival date is required"),
  expectedArrivalTime: z.string().min(1, "Arrival time is required"),
  purpose: z.enum(["guest", "delivery", "contractor", "service-provider", "real-estate-agent", "other"]),
  unitNumber: z.string().min(1, "Unit number is required"),
});

const visitors = new Map<string, Visitor>();

export async function registerVisitor(
  input: CreateVisitorInput
): Promise<{ success: true; visitor: Visitor } | { success: false; error: string }> {
  try {
    const validated = createVisitorSchema.parse(input);

    const id = createId();
    const qrData = JSON.stringify({
      visitorId: id,
      name: validated.visitorName,
      unit: validated.unitNumber,
      purpose: validated.purpose,
    });

    const qrCode = await QRCode.toDataURL(qrData);

    const visitor: Visitor = {
      id,
      visitorName: validated.visitorName,
      idType: validated.idType,
      idNumber: validated.idNumber,
      vehiclePlate: validated.vehiclePlate || null,
      expectedArrivalDate: validated.expectedArrivalDate,
      expectedArrivalTime: validated.expectedArrivalTime,
      purpose: validated.purpose,
      unitNumber: validated.unitNumber,
      status: "pending",
      qrCode,
      registeredBy: "current-user",
      checkedInAt: null,
      checkedOutAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    visitors.set(id, visitor);

    revalidatePath("/[locale]/visitors");

    return { success: true, visitor };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation failed" };
    }
    console.error("Failed to register visitor:", error);
    return { success: false, error: "Failed to register visitor" };
  }
}

export async function getVisitors(filters?: {
  status?: VisitorStatus;
  registeredBy?: string;
}): Promise<Visitor[]> {
  let result = Array.from(visitors.values());

  if (filters?.status) {
    result = result.filter((v) => v.status === filters.status);
  }

  if (filters?.registeredBy) {
    result = result.filter((v) => v.registeredBy === filters.registeredBy);
  }

  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getVisitorById(id: string): Promise<Visitor | null> {
  return visitors.get(id) || null;
}

export async function updateVisitorStatus(
  id: string,
  status: Exclude<VisitorStatus, "pending">
): Promise<{ success: true; visitor: Visitor } | { success: false; error: string }> {
  try {
    const visitor = visitors.get(id);

    if (!visitor) {
      return { success: false, error: "Visitor not found" };
    }

    const updatedVisitor: Visitor = {
      ...visitor,
      status,
      checkedInAt: status === "checked-in" ? new Date().toISOString() : visitor.checkedInAt,
      checkedOutAt: status === "checked-out" ? new Date().toISOString() : visitor.checkedOutAt,
      updatedAt: new Date().toISOString(),
    };

    visitors.set(id, updatedVisitor);

    revalidatePath("/[locale]/visitors");
    revalidatePath(`/[locale]/visitors/${id}`);

    return { success: true, visitor: updatedVisitor };
  } catch (error) {
    console.error("Failed to update visitor status:", error);
    return { success: false, error: "Failed to update visitor status" };
  }
}

export async function cancelVisitor(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const visitor = visitors.get(id);

    if (!visitor) {
      return { success: false, error: "Visitor not found" };
    }

    const updatedVisitor: Visitor = {
      ...visitor,
      status: "cancelled",
      updatedAt: new Date().toISOString(),
    };

    visitors.set(id, updatedVisitor);

    revalidatePath("/[locale]/visitors");
    revalidatePath(`/[locale]/visitors/${id}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to cancel visitor:", error);
    return { success: false, error: "Failed to cancel visitor" };
  }
}
