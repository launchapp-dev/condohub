"use server";

import { db } from "@/db";
import {
  visitors,
  maintenanceRequests,
  announcements,
  amenityBookings,
  fees,
  units,
  communities,
  communityMembers,
  visitorLogs,
  amenities,
} from "@/db/schema";
import { getCurrentUser, type UserRole } from "@/lib/auth";
import {
  eq,
  and,
  desc,
  gte,
  lt,
  count,
  sql,
  or,
  inArray,
  asc,
} from "drizzle-orm";
import { format, startOfDay, endOfDay } from "date-fns";

// Types for dashboard data
export interface ResidentDashboardData {
  user: {
    id: string;
    name: string;
    email: string;
  };
  unit: {
    id: string;
    unitNumber: string;
    floor: number | null;
    communityName: string;
  } | null;
  todayVisitors: Array<{
    id: string;
    name: string;
    expectedAt: Date | null;
    status: string;
    purpose: string | null;
  }>;
  maintenanceRequests: Array<{
    id: string;
    category: string;
    status: string;
    urgency: string;
    createdAt: Date;
  }>;
  announcements: Array<{
    id: string;
    subject: string;
    priority: string;
    publishedAt: Date;
  }>;
  bookings: Array<{
    id: string;
    amenityName: string;
    startTime: Date;
    endTime: Date;
    status: string;
  }>;
  outstandingFees: Array<{
    id: string;
    title: string;
    amount: number;
    dueDate: Date;
  }>;
}

export interface AdminDashboardData {
  user: {
    id: string;
    name: string;
  };
  communityId: string;
  stats: {
    totalResidents: number;
    pendingRequests: number;
    visitorsToday: number;
    activeAnnouncements: number;
  };
  pendingApprovals: Array<{
    id: string;
    category: string;
    description: string;
    urgency: string;
    requesterName: string;
    unitNumber: string | null;
    createdAt: Date;
  }>;
  overdueMaintenance: Array<{
    id: string;
    category: string;
    description: string;
    status: string;
    daysOpen: number;
    unitNumber: string | null;
  }>;
  financialSummary: {
    totalDues: number;
    collectedAmount: number;
    pendingAmount: number;
    collectionRate: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: Date;
  }>;
}

export interface SecurityDashboardData {
  user: {
    id: string;
    name: string;
  };
  communityId: string;
  expectedToday: Array<{
    id: string;
    name: string;
    expectedAt: Date | null;
    unitNumber: string | null;
    hostName: string;
    purpose: string | null;
  }>;
  recentCheckIns: Array<{
    id: string;
    visitorName: string;
    unitNumber: string | null;
    checkInTime: Date;
  }>;
  recentEntries: Array<{
    id: string;
    visitorName: string;
    action: string;
    timestamp: Date;
    unitNumber: string | null;
  }>;
  deliveryLog: Array<{
    id: string;
    visitorName: string;
    checkInTime: Date;
    unitNumber: string | null;
    notes: string | null;
  }>;
}

// Helper to check if user is admin/board
function isAdminRole(role: UserRole): boolean {
  return role === "admin" || role === "board_member";
}

// Resident dashboard data
export async function getResidentDashboardData(): Promise<ResidentDashboardData | null> {
  const user = await getCurrentUser();
  if (!user || !user.communityId) return null;

  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);

  // Get user's unit
  const unit = await db.query.units.findFirst({
    where: eq(units.ownerId, user.id),
    with: {
      community: true,
    },
  });

  // Get today's visitors for this user
  const todayVisitorsData = await db.query.visitors.findMany({
    where: and(
      eq(visitors.hostId, user.id),
      eq(visitors.communityId, user.communityId),
      gte(visitors.expectedAt, startOfToday),
      lt(visitors.expectedAt, endOfToday)
    ),
    orderBy: desc(visitors.expectedAt),
    limit: 5,
  });

  // Get recent maintenance requests
  const maintenanceData = await db.query.maintenanceRequests.findMany({
    where: eq(maintenanceRequests.requesterId, user.id),
    orderBy: desc(maintenanceRequests.createdAt),
    limit: 3,
  });

  // Get recent announcements
  const announcementsData = await db.query.announcements.findMany({
    where: eq(announcements.communityId, user.communityId),
    orderBy: desc(announcements.publishedAt),
    limit: 3,
  });

  // Get upcoming amenity bookings
  const bookingsData = await db.query.amenityBookings.findMany({
    where: and(
      eq(amenityBookings.userId, user.id),
      gte(amenityBookings.startTime, today)
    ),
    with: {
      amenity: true,
    },
    orderBy: asc(amenityBookings.startTime),
    limit: 3,
  });

  // Get outstanding fees
  const feesData = await db.query.fees.findMany({
    where: and(
      eq(fees.unitId, unit?.id || ""),
      eq(fees.isPaid, false),
      eq(fees.communityId, user.communityId)
    ),
    orderBy: asc(fees.dueDate),
    limit: 5,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    unit: unit
      ? {
          id: unit.id,
          unitNumber: unit.unitNumber,
          floor: unit.floor,
          communityName: unit.community.name,
        }
      : null,
    todayVisitors: todayVisitorsData.map((v) => ({
      id: v.id,
      name: v.name,
      expectedAt: v.expectedAt,
      status: v.status,
      purpose: v.purpose,
    })),
    maintenanceRequests: maintenanceData.map((m) => ({
      id: m.id,
      category: m.category,
      status: m.status,
      urgency: m.urgency,
      createdAt: m.createdAt,
    })),
    announcements: announcementsData.map((a) => ({
      id: a.id,
      subject: a.subject,
      priority: a.priority,
      publishedAt: a.publishedAt,
    })),
    bookings: bookingsData.map((b) => ({
      id: b.id,
      amenityName: b.amenity.name,
      startTime: b.startTime,
      endTime: b.endTime,
      status: b.status,
    })),
    outstandingFees: feesData.map((f) => ({
      id: f.id,
      title: f.title,
      amount: f.amount,
      dueDate: f.dueDate,
    })),
  };
}

// Admin/Board dashboard data
export async function getAdminDashboardData(): Promise<AdminDashboardData | null> {
  const user = await getCurrentUser();
  if (!user || !user.communityId || !isAdminRole(user.role || "resident")) {
    return null;
  }

  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Get stats
  const totalResidentsResult = await db
    .select({ count: count() })
    .from(communityMembers)
    .where(eq(communityMembers.communityId, user.communityId));

  const pendingRequestsResult = await db
    .select({ count: count() })
    .from(maintenanceRequests)
    .where(
      and(
        eq(maintenanceRequests.communityId, user.communityId),
        eq(maintenanceRequests.status, "pending")
      )
    );

  const visitorsTodayResult = await db
    .select({ count: count() })
    .from(visitors)
    .where(
      and(
        eq(visitors.communityId, user.communityId),
        gte(visitors.createdAt, startOfToday),
        lt(visitors.createdAt, endOfToday)
      )
    );

  const activeAnnouncementsResult = await db
    .select({ count: count() })
    .from(announcements)
    .where(
      and(
        eq(announcements.communityId, user.communityId),
        gte(announcements.publishedAt, thirtyDaysAgo)
      )
    );

  // Get pending approvals
  const pendingApprovalsData = await db.query.maintenanceRequests.findMany({
    where: and(
      eq(maintenanceRequests.communityId, user.communityId),
      eq(maintenanceRequests.status, "pending")
    ),
    with: {
      requester: true,
      unit: true,
    },
    orderBy: desc(maintenanceRequests.createdAt),
    limit: 5,
  });

  // Get overdue maintenance (in progress for more than 7 days or pending for more than 3 days)
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);

  const overdueMaintenanceData = await db.query.maintenanceRequests.findMany({
    where: and(
      eq(maintenanceRequests.communityId, user.communityId),
      or(
        and(
          eq(maintenanceRequests.status, "in_progress"),
          lt(maintenanceRequests.createdAt, sevenDaysAgo)
        ),
        and(
          eq(maintenanceRequests.status, "pending"),
          lt(maintenanceRequests.createdAt, threeDaysAgo)
        )
      )
    ),
    with: {
      unit: true,
    },
    orderBy: asc(maintenanceRequests.createdAt),
    limit: 5,
  });

  // Get financial summary
  const currentMonthFees = await db.query.fees.findMany({
    where: and(
      eq(fees.communityId, user.communityId),
      gte(fees.dueDate, thirtyDaysAgo)
    ),
  });

  const totalDues = currentMonthFees.reduce((sum, f) => sum + f.amount, 0);
  const collectedAmount = currentMonthFees
    .filter((f) => f.isPaid)
    .reduce((sum, f) => sum + f.amount, 0);
  const pendingAmount = totalDues - collectedAmount;
  const collectionRate = totalDues > 0 ? (collectedAmount / totalDues) * 100 : 0;

  // Get recent activity (combine various sources)
  const recentVisitors = await db.query.visitors.findMany({
    where: eq(visitors.communityId, user.communityId),
    orderBy: desc(visitors.createdAt),
    limit: 3,
  });

  const recentMaintenance = await db.query.maintenanceRequests.findMany({
    where: eq(maintenanceRequests.communityId, user.communityId),
    orderBy: desc(maintenanceRequests.updatedAt),
    limit: 3,
  });

  const recentAnnouncements = await db.query.announcements.findMany({
    where: eq(announcements.communityId, user.communityId),
    orderBy: desc(announcements.createdAt),
    limit: 3,
  });

  // Combine and sort activity
  const allActivity = [
    ...recentVisitors.map((v) => ({
      id: `visitor-${v.id}`,
      type: "visitor",
      description: `New visitor registered: ${v.name}`,
      timestamp: v.createdAt,
    })),
    ...recentMaintenance.map((m) => ({
      id: `maintenance-${m.id}`,
      type: "maintenance",
      description: `Maintenance request updated: ${m.category}`,
      timestamp: m.updatedAt,
    })),
    ...recentAnnouncements.map((a) => ({
      id: `announcement-${a.id}`,
      type: "announcement",
      description: `New announcement: ${a.subject}`,
      timestamp: a.createdAt,
    })),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  return {
    user: {
      id: user.id,
      name: user.name,
    },
    communityId: user.communityId,
    stats: {
      totalResidents: totalResidentsResult[0]?.count || 0,
      pendingRequests: pendingRequestsResult[0]?.count || 0,
      visitorsToday: visitorsTodayResult[0]?.count || 0,
      activeAnnouncements: activeAnnouncementsResult[0]?.count || 0,
    },
    pendingApprovals: pendingApprovalsData.map((m) => ({
      id: m.id,
      category: m.category,
      description: m.description,
      urgency: m.urgency,
      requesterName: m.requester.name,
      unitNumber: m.unit?.unitNumber || null,
      createdAt: m.createdAt,
    })),
    overdueMaintenance: overdueMaintenanceData.map((m) => ({
      id: m.id,
      category: m.category,
      description: m.description,
      status: m.status,
      daysOpen: Math.floor(
        (today.getTime() - m.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      ),
      unitNumber: m.unit?.unitNumber || null,
    })),
    financialSummary: {
      totalDues,
      collectedAmount,
      pendingAmount,
      collectionRate,
    },
    recentActivity: allActivity,
  };
}

// Security dashboard data
export async function getSecurityDashboardData(): Promise<SecurityDashboardData | null> {
  const user = await getCurrentUser();
  if (!user || !user.communityId || user.role !== "security") {
    return null;
  }

  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);

  // Get expected visitors for today
  const expectedTodayData = await db.query.visitors.findMany({
    where: and(
      eq(visitors.communityId, user.communityId),
      gte(visitors.expectedAt, startOfToday),
      lt(visitors.expectedAt, endOfToday),
      eq(visitors.status, "expected")
    ),
    with: {
      unit: true,
      host: true,
    },
    orderBy: asc(visitors.expectedAt),
    limit: 10,
  });

  // Get recent check-ins (last 24 hours)
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const recentLogs = await db.query.visitorLogs.findMany({
    where: and(
      gte(visitorLogs.performedAt, yesterday),
      eq(visitorLogs.action, "check_in")
    ),
    with: {
      visitor: {
        with: {
          unit: true,
        },
      },
    },
    orderBy: desc(visitorLogs.performedAt),
    limit: 10,
  });

  // Get recent entries log (check-ins and check-outs)
  const recentEntriesData = await db.query.visitorLogs.findMany({
    where: gte(visitorLogs.performedAt, yesterday),
    with: {
      visitor: {
        with: {
          unit: true,
        },
      },
    },
    orderBy: desc(visitorLogs.performedAt),
    limit: 20,
  });

  // Get delivery log (visitors with purpose containing "delivery")
  const deliveryLogs = await db.query.visitorLogs.findMany({
    where: and(
      gte(visitorLogs.performedAt, yesterday),
      eq(visitorLogs.action, "check_in")
    ),
    with: {
      visitor: {
        with: {
          unit: true,
        },
      },
    },
    orderBy: desc(visitorLogs.performedAt),
    limit: 10,
  });

  // Filter deliveries based on purpose
  const deliveryLogData = deliveryLogs.filter(
    (log) =>
      log.visitor.purpose?.toLowerCase().includes("delivery") ||
      log.visitor.name.toLowerCase().includes("delivery") ||
      log.visitor.name.toLowerCase().includes("courier") ||
      log.visitor.name.toLowerCase().includes("post") ||
      log.visitor.name.toLowerCase().includes("amazon") ||
      log.visitor.name.toLowerCase().includes("fedex") ||
      log.visitor.name.toLowerCase().includes("ups")
  );

  return {
    user: {
      id: user.id,
      name: user.name,
    },
    communityId: user.communityId,
    expectedToday: expectedTodayData.map((v) => ({
      id: v.id,
      name: v.name,
      expectedAt: v.expectedAt,
      unitNumber: v.unit?.unitNumber || null,
      hostName: v.host.name,
      purpose: v.purpose,
    })),
    recentCheckIns: recentLogs.map((log) => ({
      id: log.id,
      visitorName: log.visitor.name,
      unitNumber: log.visitor.unit?.unitNumber || null,
      checkInTime: log.performedAt,
    })),
    recentEntries: recentEntriesData.map((log) => ({
      id: log.id,
      visitorName: log.visitor.name,
      action: log.action,
      timestamp: log.performedAt,
      unitNumber: log.visitor.unit?.unitNumber || null,
    })),
    deliveryLog: deliveryLogData.map((log) => ({
      id: log.id,
      visitorName: log.visitor.name,
      checkInTime: log.performedAt,
      unitNumber: log.visitor.unit?.unitNumber || null,
      notes: log.notes,
    })),
  };
}
