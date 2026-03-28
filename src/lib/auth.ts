import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { headers } from "next/headers";
import { db } from "@/db";
import { communityMembers, type roleEnum } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

export function generateId(): string {
  return randomBytes(16).toString("hex");
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  secret: process.env.BETTER_AUTH_SECRET || "change-me-in-production",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
});

export type UserRole = (typeof roleEnum)[number];

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  communityId?: string;
  role?: UserRole;
}

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession();
  if (!session) return null;

  // Get user's community membership (first one for now)
  const membership = await db.query.communityMembers.findFirst({
    where: eq(communityMembers.userId, session.user.id),
    with: {
      community: true,
    },
  });

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    communityId: membership?.communityId,
    role: membership?.role,
  };
}

export function requireAuth() {
  return async (): Promise<CurrentUser> => {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    return user;
  };
}
