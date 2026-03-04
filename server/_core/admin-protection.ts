import { TRPCError } from "@trpc/server";
import type { TrpcContext } from "./context";

/**
 * Admin protection middleware
 * Ensures only the designated admin user can access admin routes
 */

const ADMIN_EMAIL = "gui.fernandes_@hotmail.com";

/**
 * Verify that user is the designated admin
 */
export function verifyAdminUser(user: TrpcContext["user"]): boolean {
  if (!user) return false;
  if (user.role !== "admin") return false;
  if (user.email !== ADMIN_EMAIL) return false;
  return true;
}

/**
 * Throw error if user is not the designated admin
 */
export function requireAdminUser(user: TrpcContext["user"]): void {
  if (!verifyAdminUser(user)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only the designated admin user can access this resource",
    });
  }
}

/**
 * Log admin actions for audit trail
 */
export async function logAdminAction(
  userId: number,
  action: string,
  details: Record<string, any>
) {
  console.log(`[ADMIN ACTION] User ${userId} performed: ${action}`, details);
  // TODO: Store in audit log table
}

/**
 * Disable public admin creation
 */
export const ADMIN_CREATION_DISABLED = true;

/**
 * Get designated admin email
 */
export function getDesignatedAdminEmail(): string {
  return ADMIN_EMAIL;
}

/**
 * Check if user can perform admin action
 */
export function canPerformAdminAction(user: TrpcContext["user"]): boolean {
  return verifyAdminUser(user);
}

/**
 * Check if user can manage other admins
 */
export function canManageAdmins(user: TrpcContext["user"]): boolean {
  return verifyAdminUser(user);
}

/**
 * Check if user can change system settings
 */
export function canChangeSystemSettings(user: TrpcContext["user"]): boolean {
  return verifyAdminUser(user);
}

/**
 * Check if user can manage users
 */
export function canManageUsers(user: TrpcContext["user"]): boolean {
  return verifyAdminUser(user);
}

/**
 * Check if user can manage companies
 */
export function canManageCompanies(user: TrpcContext["user"]): boolean {
  return verifyAdminUser(user);
}

/**
 * Check if user can manage trips
 */
export function canManageTrips(user: TrpcContext["user"]): boolean {
  return verifyAdminUser(user);
}

/**
 * Check if user can view analytics
 */
export function canViewAnalytics(user: TrpcContext["user"]): boolean {
  return verifyAdminUser(user);
}
