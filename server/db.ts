import { eq, desc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  trips,
  companies,
  tripStops,
  trackingData,
  alerts,
  userPreferences,
  trafficIncidents,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ TRIPS ============

export async function getAllTrips(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(trips)
    .orderBy(desc(trips.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getTripById(tripId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(trips).where(eq(trips.id, tripId)).limit(1);
  return result[0] || null;
}

export async function getActiveTrips() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(trips)
    .where(eq(trips.status, "in_progress"))
    .orderBy(desc(trips.departureTime));
}

export async function getTripsByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(trips)
    .where(eq(trips.companyId, companyId))
    .orderBy(desc(trips.departureTime));
}

export async function searchTrips(city?: string, busNumber?: string) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(trips);

  const conditions = [];
  if (city) {
    conditions.push(
      // Search in origin or destination
      eq(trips.origin, city)
    );
  }
  if (busNumber) {
    conditions.push(eq(trips.busNumber, busNumber));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  return query.orderBy(desc(trips.departureTime));
}

export async function createTrip(tripData: typeof trips.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(trips).values(tripData);
  return result;
}

export async function updateTripStatus(tripId: number, status: string, delayMinutes = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(trips)
    .set({
      status: status as any,
      delayMinutes,
      updatedAt: new Date(),
    })
    .where(eq(trips.id, tripId));
}

export async function updateTripLocation(
  tripId: number,
  latitude: string,
  longitude: string,
  speed: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(trips)
    .set({
      currentLatitude: latitude as any,
      currentLongitude: longitude as any,
      currentSpeed: speed,
      updatedAt: new Date(),
    })
    .where(eq(trips.id, tripId));
}

// ============ TRIP STOPS ============

export async function getTripStops(tripId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(tripStops)
    .where(eq(tripStops.tripId, tripId))
    .orderBy(tripStops.stopNumber);
}

export async function addTripStop(stopData: typeof tripStops.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(tripStops).values(stopData);
}

// ============ TRACKING DATA ============

export async function getLatestTracking(tripId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(trackingData)
    .where(eq(trackingData.tripId, tripId))
    .orderBy(desc(trackingData.createdAt))
    .limit(1);

  return result[0] || null;
}

export async function getTrackingHistory(tripId: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(trackingData)
    .where(eq(trackingData.tripId, tripId))
    .orderBy(desc(trackingData.createdAt))
    .limit(limit);
}

export async function addTrackingData(trackingInfo: typeof trackingData.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(trackingData).values(trackingInfo);
}

// ============ ALERTS ============

export async function getTripAlerts(tripId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(alerts)
    .where(eq(alerts.tripId, tripId))
    .orderBy(desc(alerts.createdAt));
}

export async function createAlert(alertData: typeof alerts.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(alerts).values(alertData);
}

export async function markAlertAsRead(alertId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(alerts).set({ isRead: true }).where(eq(alerts.id, alertId));
}

// ============ COMPANIES ============

export async function getAllCompanies() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(companies).where(eq(companies.isActive, true));
}

export async function getCompanyById(companyId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  return result[0] || null;
}

export async function createCompany(companyData: typeof companies.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(companies).values(companyData);
}

// ============ USER PREFERENCES ============

export async function getUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  return result[0] || null;
}

export async function updateUserPreferences(
  userId: number,
  prefs: Partial<typeof userPreferences.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(userPreferences)
    .set({ ...prefs, updatedAt: new Date() })
    .where(eq(userPreferences.userId, userId));
}

// ============ TRAFFIC INCIDENTS ============

export async function getActiveTrafficIncidents(road?: string) {
  const db = await getDb();
  if (!db) return [];

  let query = db
    .select()
    .from(trafficIncidents)
    .where(eq(trafficIncidents.isActive, true));

  if (road) {
    query = query.where(eq(trafficIncidents.road, road));
  }

  return query.orderBy(desc(trafficIncidents.createdAt));
}

export async function createTrafficIncident(
  incidentData: typeof trafficIncidents.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(trafficIncidents).values(incidentData);
}

export async function deactivateTrafficIncident(incidentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(trafficIncidents)
    .set({ isActive: false })
    .where(eq(trafficIncidents.id, incidentId));
}
