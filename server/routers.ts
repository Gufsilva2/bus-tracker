import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { requireAdminUser, logAdminAction } from "./_core/admin-protection";

// ============ VALIDATION SCHEMAS ============

const tripSearchSchema = z.object({
  city: z.string().optional(),
  busNumber: z.string().optional(),
  limit: z.number().default(50),
  offset: z.number().default(0),
});

const tripCreateSchema = z.object({
  busNumber: z.string().min(1),
  origin: z.string().min(3),
  originLatitude: z.string().optional(),
  originLongitude: z.string().optional(),
  destination: z.string().min(3),
  destinationLatitude: z.string().optional(),
  destinationLongitude: z.string().optional(),
  departureTime: z.date(),
  estimatedArrivalTime: z.date(),
  companyId: z.number(),
  totalPassengers: z.number().default(0),
});

const tripStatusUpdateSchema = z.object({
  tripId: z.number(),
  status: z.enum(["scheduled", "in_progress", "arrived", "delayed", "cancelled"]),
  delayMinutes: z.number().default(0),
  delayReason: z.string().optional(),
});

const locationUpdateSchema = z.object({
  tripId: z.number(),
  latitude: z.string(),
  longitude: z.string(),
  speed: z.number(),
  heading: z.number().optional(),
});

// ============ ADMIN PROCEDURE ============

const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  // Verify user is the designated admin
  requireAdminUser(ctx.user);
  return next({ ctx });
});

// ============ ROUTERS ============

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ TRIPS ============

  trips: router({
    // Public: Search trips
    search: publicProcedure.input(tripSearchSchema).query(async ({ input }) => {
      try {
        if (input.city || input.busNumber) {
          return await db.searchTrips(input.city, input.busNumber);
        }
        return await db.getAllTrips(input.limit, input.offset);
      } catch (error) {
        console.error("Error searching trips:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search trips",
        });
      }
    }),

    // Public: Get trip details
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        try {
          const trip = await db.getTripById(input.id);
          if (!trip) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Trip not found" });
          }
          return trip;
        } catch (error) {
          console.error("Error getting trip:", error);
          throw error;
        }
      }),

    // Public: Get active trips
    getActive: publicProcedure.query(async () => {
      try {
        return await db.getActiveTrips();
      } catch (error) {
        console.error("Error getting active trips:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get active trips",
        });
      }
    }),

    // Public: Get trip stops
    getStops: publicProcedure
      .input(z.object({ tripId: z.number() }))
      .query(async ({ input }) => {
        try {
          return await db.getTripStops(input.tripId);
        } catch (error) {
          console.error("Error getting trip stops:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get trip stops",
          });
        }
      }),

    // Public: Get tracking history
    getTracking: publicProcedure
      .input(z.object({ tripId: z.number(), limit: z.number().default(100) }))
      .query(async ({ input }) => {
        try {
          return await db.getTrackingHistory(input.tripId, input.limit);
        } catch (error) {
          console.error("Error getting tracking data:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get tracking data",
          });
        }
      }),

    // Public: Get alerts
    getAlerts: publicProcedure
      .input(z.object({ tripId: z.number() }))
      .query(async ({ input }) => {
        try {
          return await db.getTripAlerts(input.tripId);
        } catch (error) {
          console.error("Error getting alerts:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get alerts",
          });
        }
      }),

    // Admin: Create trip
    create: adminProcedure.input(tripCreateSchema).mutation(async ({ input, ctx }) => {
      try {
        const result = await db.createTrip({
          busNumber: input.busNumber,
          origin: input.origin,
          originLatitude: input.originLatitude as any,
          originLongitude: input.originLongitude as any,
          destination: input.destination,
          destinationLatitude: input.destinationLatitude as any,
          destinationLongitude: input.destinationLongitude as any,
          departureTime: input.departureTime,
          estimatedArrivalTime: input.estimatedArrivalTime,
          status: "scheduled",
          companyId: input.companyId,
          totalPassengers: input.totalPassengers,
        });
        
        // Log admin action
        await logAdminAction(ctx.user.id, "CREATE_TRIP", {
          tripId: result.insertId,
          busNumber: input.busNumber,
          origin: input.origin,
          destination: input.destination,
        });
        
        return { success: true, id: result.insertId };
      } catch (error) {
        console.error("Error creating trip:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create trip",
        });
      }
    }),

    // Admin: Update trip status
    updateStatus: adminProcedure
      .input(tripStatusUpdateSchema)
      .mutation(async ({ input, ctx }) => {
        try {
          await db.updateTripStatus(input.tripId, input.status, input.delayMinutes);
          
          // Log admin action
          await logAdminAction(ctx.user.id, "UPDATE_TRIP_STATUS", {
            tripId: input.tripId,
            status: input.status,
            delayMinutes: input.delayMinutes,
          });
          
          return { success: true };
        } catch (error) {
          console.error("Error updating trip status:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update trip status",
          });
        }
      }),

    // Admin: Update location
    updateLocation: adminProcedure
      .input(locationUpdateSchema)
      .mutation(async ({ input, ctx }) => {
        try {
          // Update trip location
          await db.updateTripLocation(
            input.tripId,
            input.latitude,
            input.longitude,
            input.speed
          );

          // Add tracking data point
          await db.addTrackingData({
            tripId: input.tripId,
            latitude: input.latitude as any,
            longitude: input.longitude as any,
            speed: input.speed,
            heading: input.heading,
          });

          // Log admin action
          await logAdminAction(ctx.user.id, "UPDATE_LOCATION", {
            tripId: input.tripId,
            latitude: input.latitude,
            longitude: input.longitude,
            speed: input.speed,
          });

          return { success: true };
        } catch (error) {
          console.error("Error updating location:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update location",
          });
        }
      }),

    // Admin: Add alert
    addAlert: adminProcedure
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
          await db.createAlert({
            tripId: input.tripId,
            type: input.type,
            title: input.title,
            message: input.message,
            severity: input.severity,
          });
          
          // Log admin action
          await logAdminAction(ctx.user.id, "CREATE_ALERT", {
            tripId: input.tripId,
            type: input.type,
            severity: input.severity,
          });
          
          return { success: true };
        } catch (error) {
          console.error("Error creating alert:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create alert",
          });
        }
      }),
  }),

  // ============ COMPANIES ============

  companies: router({
    // Public: Get all companies
    getAll: publicProcedure.query(async () => {
      try {
        return await db.getAllCompanies();
      } catch (error) {
        console.error("Error getting companies:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get companies",
        });
      }
    }),

    // Public: Get company by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        try {
          const company = await db.getCompanyById(input.id);
          if (!company) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Company not found" });
          }
          return company;
        } catch (error) {
          console.error("Error getting company:", error);
          throw error;
        }
      }),

    // Admin: Create company
    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(3),
          cnpj: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          subscriptionPlan: z.enum(["starter", "professional", "enterprise"]).default("starter"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const result = await db.createCompany({
            name: input.name,
            cnpj: input.cnpj,
            email: input.email,
            phone: input.phone,
            subscriptionPlan: input.subscriptionPlan,
          });
          
          // Log admin action
          await logAdminAction(ctx.user.id, "CREATE_COMPANY", {
            companyId: result.insertId,
            name: input.name,
            subscriptionPlan: input.subscriptionPlan,
          });
          
          return { success: true, id: result.insertId };
        } catch (error) {
          console.error("Error creating company:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create company",
          });
        }
      }),
  }),

  // ============ TRAFFIC ============

  traffic: router({
    // Public: Get active traffic incidents
    getIncidents: publicProcedure
      .input(z.object({ road: z.string().optional() }))
      .query(async ({ input }) => {
        try {
          return await db.getActiveTrafficIncidents(input.road);
        } catch (error) {
          console.error("Error getting traffic incidents:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get traffic incidents",
          });
        }
      }),

    // Admin: Create incident
    createIncident: adminProcedure
      .input(
        z.object({
          road: z.string(),
          latitude: z.string(),
          longitude: z.string(),
          type: z.enum(["accident", "congestion", "roadwork", "weather", "incident"]),
          description: z.string().optional(),
          severity: z.enum(["low", "medium", "high"]).default("medium"),
          estimatedDuration: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const result = await db.createTrafficIncident({
            road: input.road,
            latitude: input.latitude as any,
            longitude: input.longitude as any,
            type: input.type,
            description: input.description,
            severity: input.severity,
            estimatedDuration: input.estimatedDuration,
          });
          
          // Log admin action
          await logAdminAction(ctx.user.id, "CREATE_TRAFFIC_INCIDENT", {
            incidentId: result.insertId,
            road: input.road,
            type: input.type,
            severity: input.severity,
          });
          
          return { success: true, id: result.insertId };
        } catch (error) {
          console.error("Error creating traffic incident:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create traffic incident",
          });
        }
      }),
  }),

  // ============ USER PREFERENCES ============

  preferences: router({
    // Protected: Get user preferences
    get: protectedProcedure.query(async ({ ctx }) => {
      try {
        return await db.getUserPreferences(ctx.user.id);
      } catch (error) {
        console.error("Error getting preferences:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get preferences",
        });
      }
    }),

    // Protected: Update preferences
    update: protectedProcedure
      .input(
        z.object({
          notificationsEnabled: z.boolean().optional(),
          notifyOnDelay: z.boolean().optional(),
          notifyOnArrival: z.boolean().optional(),
          theme: z.enum(["light", "dark", "auto"]).optional(),
          language: z.enum(["pt-BR", "en-US"]).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          await db.updateUserPreferences(ctx.user.id, input);
          
          // Log preference change
          await logAdminAction(ctx.user.id, "UPDATE_PREFERENCES", input);
          
          return { success: true };
        } catch (error) {
          console.error("Error updating preferences:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update preferences",
          });
        }
      }),
  }),
});

// Export admin protection utilities
export { requireAdminUser, verifyAdminUser, getDesignatedAdminEmail } from "./_core/admin-protection";

export type AppRouter = typeof appRouter;
