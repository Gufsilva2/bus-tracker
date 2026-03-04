import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getWebSocketServer } from "./websocket";
import * as sharing from "./public-sharing";
import { requireAdminUser, logAdminAction } from "./_core/admin-protection";

/**
 * WebSocket and Public Sharing Routers
 */

export const websocketRouter = router({
  // Admin: Broadcast location update
  broadcastLocation: protectedProcedure
    .input(
      z.object({
        tripId: z.number(),
        latitude: z.number(),
        longitude: z.number(),
        speed: z.number(),
        heading: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify user is admin
        requireAdminUser(ctx.user);

        const wsServer = getWebSocketServer();
        if (!wsServer) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "WebSocket server not available",
          });
        }

        // Broadcast location update
        wsServer.broadcastLocationUpdate({
          tripId: input.tripId,
          latitude: input.latitude,
          longitude: input.longitude,
          speed: input.speed,
          heading: input.heading,
          timestamp: Date.now(),
        });

        // Log action
        await logAdminAction(ctx.user.id, "BROADCAST_LOCATION", {
          tripId: input.tripId,
          latitude: input.latitude,
          longitude: input.longitude,
        });

        return { success: true };
      } catch (error) {
        console.error("Error broadcasting location:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to broadcast location",
        });
      }
    }),

  // Admin: Broadcast status update
  broadcastStatus: protectedProcedure
    .input(
      z.object({
        tripId: z.number(),
        status: z.enum(["scheduled", "in_progress", "delayed", "completed", "cancelled"]),
        delayMinutes: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify user is admin
        requireAdminUser(ctx.user);

        const wsServer = getWebSocketServer();
        if (!wsServer) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "WebSocket server not available",
          });
        }

        // Broadcast status update
        wsServer.broadcastStatusUpdate({
          tripId: input.tripId,
          status: input.status,
          delayMinutes: input.delayMinutes,
          timestamp: Date.now(),
        });

        // Log action
        await logAdminAction(ctx.user.id, "BROADCAST_STATUS", {
          tripId: input.tripId,
          status: input.status,
          delayMinutes: input.delayMinutes,
        });

        return { success: true };
      } catch (error) {
        console.error("Error broadcasting status:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to broadcast status",
        });
      }
    }),

  // Admin: Broadcast alert
  broadcastAlert: protectedProcedure
    .input(
      z.object({
        tripId: z.number(),
        type: z.enum(["delay", "arrival", "incident", "traffic", "custom"]),
        title: z.string(),
        message: z.string(),
        severity: z.enum(["info", "warning", "error"]).default("info"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify user is admin
        requireAdminUser(ctx.user);

        const wsServer = getWebSocketServer();
        if (!wsServer) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "WebSocket server not available",
          });
        }

        // Broadcast alert
        wsServer.broadcastAlert({
          tripId: input.tripId,
          type: input.type,
          title: input.title,
          message: input.message,
          severity: input.severity,
          timestamp: Date.now(),
        });

        // Log action
        await logAdminAction(ctx.user.id, "BROADCAST_ALERT", {
          tripId: input.tripId,
          type: input.type,
          severity: input.severity,
        });

        return { success: true };
      } catch (error) {
        console.error("Error broadcasting alert:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to broadcast alert",
        });
      }
    }),

  // Get WebSocket connection status
  getStatus: publicProcedure.query(() => {
    const wsServer = getWebSocketServer();
    if (!wsServer) {
      return { connected: false, activeConnections: 0 };
    }

    return {
      connected: true,
      activeConnections: wsServer.getActiveConnections(),
    };
  }),
});

export const sharingRouter = router({
  // Protected: Generate share link for a trip
  generateLink: protectedProcedure
    .input(
      z.object({
        tripId: z.number(),
        expirationHours: z.number().default(24).max(720), // Max 30 days
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify user is admin or trip owner
        // TODO: Add ownership check

        const shareLink = await sharing.generateShareLink(input.tripId, input.expirationHours);

        return {
          success: true,
          shareId: shareLink.shareId,
          shareUrl: sharing.getShareURL(shareLink.shareId),
          qrCodeUrl: sharing.getQRCodeURL(shareLink.shareId),
          expiresAt: shareLink.expiresAt,
        };
      } catch (error) {
        console.error("Error generating share link:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate share link",
        });
      }
    }),

  // Public: Get shared trip data
  getPublicTrip: publicProcedure
    .input(z.object({ shareId: z.string() }))
    .query(async ({ input }) => {
      try {
        const tripData = await sharing.getPublicTripData(input.shareId);

        if (!tripData) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Shared trip not found or link expired",
          });
        }

        return tripData;
      } catch (error) {
        console.error("Error fetching public trip:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch trip data",
        });
      }
    }),

  // Protected: Revoke share link
  revokeLink: protectedProcedure
    .input(z.object({ shareId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify user is admin
        requireAdminUser(ctx.user);

        const success = await sharing.revokeShareLink(input.shareId);

        if (success) {
          await logAdminAction(ctx.user.id, "REVOKE_SHARE_LINK", {
            shareId: input.shareId,
          });
        }

        return { success };
      } catch (error) {
        console.error("Error revoking share link:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to revoke share link",
        });
      }
    }),

  // Protected: Get active shares for a trip
  getActiveShares: protectedProcedure
    .input(z.object({ tripId: z.number() }))
    .query(async ({ input }) => {
      try {
        const shares = await sharing.getActiveShares(input.tripId);
        return shares;
      } catch (error) {
        console.error("Error fetching active shares:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch shares",
        });
      }
    }),
});
