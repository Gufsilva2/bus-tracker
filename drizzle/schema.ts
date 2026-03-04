import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "company"]).default("user").notNull(),
  companyId: int("companyId"), // Para usuários de empresas
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Bus companies table
 */
export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 20 }).unique(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  logo: text("logo"), // URL da logo
  subscriptionPlan: mysqlEnum("subscriptionPlan", ["starter", "professional", "enterprise"])
    .default("starter")
    .notNull(),
  monthlyTripsLimit: int("monthlyTripsLimit").default(100),
  usedTripsThisMonth: int("usedTripsThisMonth").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

/**
 * Bus trips table
 */
export const trips = mysqlTable("trips", {
  id: int("id").autoincrement().primaryKey(),
  busNumber: varchar("busNumber", { length: 10 }).notNull(),
  origin: varchar("origin", { length: 255 }).notNull(),
  originLatitude: decimal("originLatitude", { precision: 10, scale: 8 }),
  originLongitude: decimal("originLongitude", { precision: 11, scale: 8 }),
  destination: varchar("destination", { length: 255 }).notNull(),
  destinationLatitude: decimal("destinationLatitude", { precision: 10, scale: 8 }),
  destinationLongitude: decimal("destinationLongitude", { precision: 11, scale: 8 }),
  departureTime: timestamp("departureTime").notNull(),
  estimatedArrivalTime: timestamp("estimatedArrivalTime").notNull(),
  actualArrivalTime: timestamp("actualArrivalTime"),
  status: mysqlEnum("status", ["scheduled", "in_progress", "arrived", "delayed", "cancelled"])
    .default("scheduled")
    .notNull(),
  companyId: int("companyId").notNull(),
  // Current location
  currentLatitude: decimal("currentLatitude", { precision: 10, scale: 8 }),
  currentLongitude: decimal("currentLongitude", { precision: 11, scale: 8 }),
  currentSpeed: int("currentSpeed"), // km/h
  // Delay information
  delayMinutes: int("delayMinutes").default(0),
  delayReason: text("delayReason"),
  // Passenger information
  totalPassengers: int("totalPassengers").default(0),
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Trip = typeof trips.$inferSelect;
export type InsertTrip = typeof trips.$inferInsert;

/**
 * Trip stops/waypoints
 */
export const tripStops = mysqlTable("tripStops", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId").notNull(),
  stopNumber: int("stopNumber").notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  estimatedTime: timestamp("estimatedTime"),
  actualTime: timestamp("actualTime"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TripStop = typeof tripStops.$inferSelect;
export type InsertTripStop = typeof tripStops.$inferInsert;

/**
 * Real-time tracking data
 */
export const trackingData = mysqlTable("trackingData", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  speed: int("speed").notNull(), // km/h
  heading: int("heading"), // 0-360 degrees
  accuracy: int("accuracy"), // meters
  distanceRemaining: int("distanceRemaining"), // km
  estimatedArrivalTime: timestamp("estimatedArrivalTime"),
  currentStatus: mysqlEnum("currentStatus", ["on_schedule", "delayed", "ahead_of_schedule"])
    .default("on_schedule"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TrackingData = typeof trackingData.$inferSelect;
export type InsertTrackingData = typeof trackingData.$inferInsert;

/**
 * Alerts and notifications
 */
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId").notNull(),
  type: mysqlEnum("type", ["delay", "arrival", "incident", "traffic", "custom"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  severity: mysqlEnum("severity", ["info", "warning", "error"]).default("info"),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

/**
 * Public shared trips (for sharing tracking links)
 */
export const sharedTrips = mysqlTable("sharedTrips", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId").notNull(),
  shareCode: varchar("shareCode", { length: 32 }).unique().notNull(),
  publicUrl: text("publicUrl").notNull(),
  createdBy: int("createdBy").notNull(), // User ID
  expiresAt: timestamp("expiresAt").notNull(),
  accessCount: int("accessCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SharedTrip = typeof sharedTrips.$inferSelect;
export type InsertSharedTrip = typeof sharedTrips.$inferInsert;

/**
 * Trip statistics
 */
export const tripStats = mysqlTable("tripStats", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId").notNull().unique(),
  totalDistance: int("totalDistance"), // km
  totalDuration: int("totalDuration"), // minutes
  averageSpeed: int("averageSpeed"), // km/h
  maxSpeed: int("maxSpeed"), // km/h
  delayMinutes: int("delayMinutes").default(0),
  passengersCount: int("passengersCount").default(0),
  sharesCount: int("sharesCount").default(0),
  alertsTriggered: int("alertsTriggered").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TripStat = typeof tripStats.$inferSelect;
export type InsertTripStat = typeof tripStats.$inferInsert;

/**
 * User preferences
 */
export const userPreferences = mysqlTable("userPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  notificationsEnabled: boolean("notificationsEnabled").default(true),
  notifyOnDelay: boolean("notifyOnDelay").default(true),
  notifyOnArrival: boolean("notifyOnArrival").default(true),
  notifyOnProximity: boolean("notifyOnProximity").default(true),
  theme: mysqlEnum("theme", ["light", "dark", "auto"]).default("auto"),
  language: mysqlEnum("language", ["pt-BR", "en-US"]).default("pt-BR"),
  pushToken: text("pushToken"), // For push notifications
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;

/**
 * Traffic incidents (for traffic map)
 */
export const trafficIncidents = mysqlTable("trafficIncidents", {
  id: int("id").autoincrement().primaryKey(),
  road: varchar("road", { length: 50 }).notNull(), // e.g., "BR-116", "BR-277"
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  type: mysqlEnum("type", ["accident", "congestion", "roadwork", "weather", "incident"])
    .notNull(),
  description: text("description"),
  severity: mysqlEnum("severity", ["low", "medium", "high"]).default("medium"),
  estimatedDuration: int("estimatedDuration"), // minutes
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TrafficIncident = typeof trafficIncidents.$inferSelect;
export type InsertTrafficIncident = typeof trafficIncidents.$inferInsert;
