import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

// Better Auth required tables
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const roleEnum = [
  "resident",
  "board_member",
  "admin",
  "security",
  "maintenance",
] as const;

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  image: text("image"),
  emailVerified: integer("email_verified", { mode: "boolean" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  preferredLocale: text("preferred_locale").default("en"),
});

export const communities = sqliteTable("communities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  defaultLocale: text("default_locale").default("en").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const communityMembers = sqliteTable("community_members", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id, { onDelete: "cascade" }),
  role: text("role", { enum: roleEnum }).notNull().default("resident"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const units = sqliteTable("units", {
  id: text("id").primaryKey(),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id, { onDelete: "cascade" }),
  unitNumber: text("unit_number").notNull(),
  floor: integer("floor"),
  ownerId: text("owner_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const visitors = sqliteTable("visitors", {
  id: text("id").primaryKey(),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id, { onDelete: "cascade" }),
  unitId: text("unit_id").references(() => units.id, {
    onDelete: "set null",
  }),
  hostId: text("host_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  phone: text("phone"),
  purpose: text("purpose"),
  expectedAt: integer("expected_at", { mode: "timestamp" }),
  qrCode: text("qr_code"),
  status: text("status", { enum: ["expected", "checked_in", "checked_out"] })
    .notNull()
    .default("expected"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const visitorLogs = sqliteTable("visitor_logs", {
  id: text("id").primaryKey(),
  visitorId: text("visitor_id")
    .notNull()
    .references(() => visitors.id, { onDelete: "cascade" }),
  action: text("action", { enum: ["check_in", "check_out"] }).notNull(),
  performedById: text("performed_by_id").references(() => users.id, {
    onDelete: "set null",
  }),
  performedAt: integer("performed_at", { mode: "timestamp" }).notNull(),
  notes: text("notes"),
});

export const announcements = sqliteTable("announcements", {
  id: text("id").primaryKey(),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id, { onDelete: "cascade" }),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  priority: text("priority", { enum: ["low", "normal", "high", "urgent"] })
    .notNull()
    .default("normal"),
  publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const announcementComments = sqliteTable("announcement_comments", {
  id: text("id").primaryKey(),
  announcementId: text("announcement_id")
    .notNull()
    .references(() => announcements.id, { onDelete: "cascade" }),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const maintenanceRequests = sqliteTable("maintenance_requests", {
  id: text("id").primaryKey(),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id, { onDelete: "cascade" }),
  unitId: text("unit_id").references(() => units.id, {
    onDelete: "set null",
  }),
  requesterId: text("requester_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  description: text("description").notNull(),
  urgency: text("urgency", { enum: ["low", "normal", "high"] })
    .notNull()
    .default("normal"),
  status: text("status", {
    enum: ["pending", "in_progress", "completed", "cancelled"],
  })
    .notNull()
    .default("pending"),
  assignedToId: text("assigned_to_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const amenities = sqliteTable("amenities", {
  id: text("id").primaryKey(),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  maxDurationMinutes: integer("max_duration_minutes"),
  requiresApproval: integer("requires_approval", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const amenityBookings = sqliteTable("amenity_bookings", {
  id: text("id").primaryKey(),
  amenityId: text("amenity_id")
    .notNull()
    .references(() => amenities.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] })
    .notNull()
    .default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id, { onDelete: "cascade" }),
  uploadedById: text("uploaded_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type"),
  fileSize: integer("file_size"),
  isPublic: integer("is_public", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const fees = sqliteTable("fees", {
  id: text("id").primaryKey(),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id, { onDelete: "cascade" }),
  unitId: text("unit_id").references(() => units.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  amount: real("amount").notNull(),
  dueDate: integer("due_date", { mode: "timestamp" }).notNull(),
  isPaid: integer("is_paid", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const payments = sqliteTable("payments", {
  id: text("id").primaryKey(),
  feeId: text("fee_id")
    .notNull()
    .references(() => fees.id, { onDelete: "cascade" }),
  payerId: text("payer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  paidAt: integer("paid_at", { mode: "timestamp" }).notNull(),
  method: text("method"),
  transactionId: text("transaction_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const budgets = sqliteTable("budgets", {
  id: text("id").primaryKey(),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id, { onDelete: "cascade" }),
  year: integer("year").notNull(),
  category: text("category").notNull(),
  plannedAmount: real("planned_amount").notNull(),
  spentAmount: real("spent_amount").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: text("type").notNull().default("general"),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  data: text("data"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  communityMembers: many(communityMembers),
  ownedUnits: many(units, { relationName: "owner" }),
  visitors: many(visitors, { relationName: "host" }),
  announcements: many(announcements, { relationName: "author" }),
  comments: many(announcementComments, { relationName: "author" }),
  maintenanceRequests: many(maintenanceRequests, { relationName: "requester" }),
  assignedMaintenance: many(maintenanceRequests, {
    relationName: "assignedTo",
  }),
  amenityBookings: many(amenityBookings),
  documents: many(documents, { relationName: "uploader" }),
  payments: many(payments),
  notifications: many(notifications),
  visitorLogs: many(visitorLogs, { relationName: "performedBy" }),
}));

export const communitiesRelations = relations(communities, ({ many }) => ({
  members: many(communityMembers),
  units: many(units),
  visitors: many(visitors),
  announcements: many(announcements),
  maintenanceRequests: many(maintenanceRequests),
  amenities: many(amenities),
  documents: many(documents),
  fees: many(fees),
  budgets: many(budgets),
}));

export const communityMembersRelations = relations(
  communityMembers,
  ({ one }) => ({
    user: one(users, {
      fields: [communityMembers.userId],
      references: [users.id],
    }),
    community: one(communities, {
      fields: [communityMembers.communityId],
      references: [communities.id],
    }),
  })
);

export const unitsRelations = relations(units, ({ one, many }) => ({
  community: one(communities, {
    fields: [units.communityId],
    references: [communities.id],
  }),
  owner: one(users, {
    fields: [units.ownerId],
    references: [users.id],
    relationName: "owner",
  }),
  visitors: many(visitors),
  fees: many(fees),
}));

export const visitorsRelations = relations(visitors, ({ one, many }) => ({
  community: one(communities, {
    fields: [visitors.communityId],
    references: [communities.id],
  }),
  unit: one(units, {
    fields: [visitors.unitId],
    references: [units.id],
  }),
  host: one(users, {
    fields: [visitors.hostId],
    references: [users.id],
    relationName: "host",
  }),
  logs: many(visitorLogs),
}));

export const visitorLogsRelations = relations(visitorLogs, ({ one }) => ({
  visitor: one(visitors, {
    fields: [visitorLogs.visitorId],
    references: [visitors.id],
  }),
  performedBy: one(users, {
    fields: [visitorLogs.performedById],
    references: [users.id],
    relationName: "performedBy",
  }),
}));

export const announcementsRelations = relations(announcements, ({ one, many }) => ({
  community: one(communities, {
    fields: [announcements.communityId],
    references: [communities.id],
  }),
  author: one(users, {
    fields: [announcements.authorId],
    references: [users.id],
    relationName: "author",
  }),
  comments: many(announcementComments),
}));

export const announcementCommentsRelations = relations(
  announcementComments,
  ({ one }) => ({
    announcement: one(announcements, {
      fields: [announcementComments.announcementId],
      references: [announcements.id],
    }),
    author: one(users, {
      fields: [announcementComments.authorId],
      references: [users.id],
      relationName: "author",
    }),
  })
);

export const maintenanceRequestsRelations = relations(
  maintenanceRequests,
  ({ one }) => ({
    community: one(communities, {
      fields: [maintenanceRequests.communityId],
      references: [communities.id],
    }),
    unit: one(units, {
      fields: [maintenanceRequests.unitId],
      references: [units.id],
    }),
    requester: one(users, {
      fields: [maintenanceRequests.requesterId],
      references: [users.id],
      relationName: "requester",
    }),
    assignedTo: one(users, {
      fields: [maintenanceRequests.assignedToId],
      references: [users.id],
      relationName: "assignedTo",
    }),
  })
);

export const amenitiesRelations = relations(amenities, ({ one, many }) => ({
  community: one(communities, {
    fields: [amenities.communityId],
    references: [communities.id],
  }),
  bookings: many(amenityBookings),
}));

export const amenityBookingsRelations = relations(amenityBookings, ({ one }) => ({
  amenity: one(amenities, {
    fields: [amenityBookings.amenityId],
    references: [amenities.id],
  }),
  user: one(users, {
    fields: [amenityBookings.userId],
    references: [users.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  community: one(communities, {
    fields: [documents.communityId],
    references: [communities.id],
  }),
  uploadedBy: one(users, {
    fields: [documents.uploadedById],
    references: [users.id],
    relationName: "uploader",
  }),
}));

export const feesRelations = relations(fees, ({ one, many }) => ({
  community: one(communities, {
    fields: [fees.communityId],
    references: [communities.id],
  }),
  unit: one(units, {
    fields: [fees.unitId],
    references: [units.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  fee: one(fees, {
    fields: [payments.feeId],
    references: [fees.id],
  }),
  payer: one(users, {
    fields: [payments.payerId],
    references: [users.id],
  }),
}));

export const budgetsRelations = relations(budgets, ({ one }) => ({
  community: one(communities, {
    fields: [budgets.communityId],
    references: [communities.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
