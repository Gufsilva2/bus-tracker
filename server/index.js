/**
 * BusTracker REST API
 * Express + PostgreSQL (pg)
 * Endpoints: buses, trips, locations, health
 */

require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const { randomUUID } = require("crypto");

// ─── Database ────────────────────────────────────────────────────────────────

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("railway.app") || process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

async function getDb() {
  return pool;
}

// ─── Table Creation ───────────────────────────────────────────────────────────

async function createTables() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS buses (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name        VARCHAR(255) NOT NULL,
        plate       VARCHAR(20)  NOT NULL UNIQUE,
        created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        bus_id      UUID         NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
        route_name  VARCHAR(255) NOT NULL,
        status      VARCHAR(50)  NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'completed', 'cancelled')),
        created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        trip_id     UUID        NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        latitude    DOUBLE PRECISION NOT NULL,
        longitude   DOUBLE PRECISION NOT NULL,
        speed       DOUBLE PRECISION NOT NULL DEFAULT 0,
        recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_trips_bus_id     ON trips(bus_id);
      CREATE INDEX IF NOT EXISTS idx_trips_status     ON trips(status);
      CREATE INDEX IF NOT EXISTS idx_locations_trip_id ON locations(trip_id);
      CREATE INDEX IF NOT EXISTS idx_locations_recorded_at ON locations(recorded_at DESC);
    `);

    console.log("[DB] Tables created / verified successfully.");
  } finally {
    client.release();
  }
}

// ─── App Setup ────────────────────────────────────────────────────────────────

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") { res.sendStatus(200); return; }
  next();
});

// ─── Validation Helpers ───────────────────────────────────────────────────────

function isValidUUID(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function isValidLatitude(v) {
  return typeof v === "number" && v >= -90 && v <= 90;
}

function isValidLongitude(v) {
  return typeof v === "number" && v >= -180 && v <= 180;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /api/health
app.get("/api/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS db_time");
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      db_time: result.rows[0].db_time,
    });
  } catch (err) {
    res.status(503).json({
      status: "error",
      message: "Database unreachable",
      error: err.message,
    });
  }
});

// POST /api/buses
app.post("/api/buses", async (req, res) => {
  const { name, plate } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: "Field 'name' is required and must be a non-empty string." });
    return;
  }
  if (!plate || typeof plate !== "string" || plate.trim().length === 0) {
    res.status(400).json({ error: "Field 'plate' is required and must be a non-empty string." });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO buses (id, name, plate)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [randomUUID(), name.trim(), plate.trim().toUpperCase()]
    );
    res.status(201).json({ bus: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      res.status(409).json({ error: `A bus with plate '${plate.trim().toUpperCase()}' already exists.` });
      return;
    }
    console.error("[POST /api/buses]", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// POST /api/trips
app.post("/api/trips", async (req, res) => {
  const { bus_id, route_name, status } = req.body;

  if (!bus_id || typeof bus_id !== "string" || !isValidUUID(bus_id)) {
    res.status(400).json({ error: "Field 'bus_id' is required and must be a valid UUID." });
    return;
  }
  if (!route_name || typeof route_name !== "string" || route_name.trim().length === 0) {
    res.status(400).json({ error: "Field 'route_name' is required and must be a non-empty string." });
    return;
  }

  const tripStatus = status ?? "active";
  const validStatuses = ["active", "completed", "cancelled"];
  if (!validStatuses.includes(tripStatus)) {
    res.status(400).json({ error: `Field 'status' must be one of: ${validStatuses.join(", ")}.` });
    return;
  }

  try {
    // Verify bus exists
    const busCheck = await pool.query("SELECT id FROM buses WHERE id = $1", [bus_id]);
    if (busCheck.rowCount === 0) {
      res.status(404).json({ error: `Bus with id '${bus_id}' not found.` });
      return;
    }

    const result = await pool.query(
      `INSERT INTO trips (id, bus_id, route_name, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [randomUUID(), bus_id, route_name.trim(), tripStatus]
    );
    res.status(201).json({ trip: result.rows[0] });
  } catch (err) {
    console.error("[POST /api/trips]", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// GET /api/trips
app.get("/api/trips", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.id,
        t.bus_id,
        b.name  AS bus_name,
        b.plate AS bus_plate,
        t.route_name,
        t.status,
        t.created_at,
        (
          SELECT row_to_json(l)
          FROM (
            SELECT latitude, longitude, speed, recorded_at
            FROM locations
            WHERE trip_id = t.id
            ORDER BY recorded_at DESC
            LIMIT 1
          ) l
        ) AS latest_location
      FROM trips t
      JOIN buses b ON b.id = t.bus_id
      WHERE t.status = 'active'
      ORDER BY t.created_at DESC
    `);
    res.json({ trips: result.rows });
  } catch (err) {
    console.error("[GET /api/trips]", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// POST /api/location
app.post("/api/location", async (req, res) => {
  const { trip_id, latitude, longitude, speed } = req.body;

  if (!trip_id || typeof trip_id !== "string" || !isValidUUID(trip_id)) {
    res.status(400).json({ error: "Field 'trip_id' is required and must be a valid UUID." });
    return;
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const spd = speed !== undefined ? parseFloat(speed) : 0;

  if (!isValidLatitude(lat)) {
    res.status(400).json({ error: "Field 'latitude' must be a number between -90 and 90." });
    return;
  }
  if (!isValidLongitude(lon)) {
    res.status(400).json({ error: "Field 'longitude' must be a number between -180 and 180." });
    return;
  }
  if (isNaN(spd) || spd < 0) {
    res.status(400).json({ error: "Field 'speed' must be a non-negative number." });
    return;
  }

  try {
    // Verify trip exists
    const tripCheck = await pool.query("SELECT id, status FROM trips WHERE id = $1", [trip_id]);
    if (tripCheck.rowCount === 0) {
      res.status(404).json({ error: `Trip with id '${trip_id}' not found.` });
      return;
    }
    if (tripCheck.rows[0].status !== "active") {
      res.status(409).json({ error: `Cannot update location for a trip with status '${tripCheck.rows[0].status}'.` });
      return;
    }

    const result = await pool.query(
      `INSERT INTO locations (id, trip_id, latitude, longitude, speed)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [randomUUID(), trip_id, lat, lon, spd]
    );
    res.status(201).json({ location: result.rows[0] });
  } catch (err) {
    console.error("[POST /api/location]", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// GET /api/trips/:tripId
app.get("/api/trips/:tripId", async (req, res) => {
  const { tripId } = req.params;

  if (!isValidUUID(tripId)) {
    res.status(400).json({ error: "Parameter 'tripId' must be a valid UUID." });
    return;
  }

  try {
    // Trip + bus info
    const tripResult = await pool.query(`
      SELECT
        t.id,
        t.bus_id,
        b.name  AS bus_name,
        b.plate AS bus_plate,
        t.route_name,
        t.status,
        t.created_at
      FROM trips t
      JOIN buses b ON b.id = t.bus_id
      WHERE t.id = $1
    `, [tripId]);

    if (tripResult.rowCount === 0) {
      res.status(404).json({ error: `Trip with id '${tripId}' not found.` });
      return;
    }

    // Latest position
    const latestResult = await pool.query(`
      SELECT id, latitude, longitude, speed, recorded_at
      FROM locations
      WHERE trip_id = $1
      ORDER BY recorded_at DESC
      LIMIT 1
    `, [tripId]);

    // Full history (last 200 points)
    const historyResult = await pool.query(`
      SELECT id, latitude, longitude, speed, recorded_at
      FROM locations
      WHERE trip_id = $1
      ORDER BY recorded_at DESC
      LIMIT 200
    `, [tripId]);

    res.json({
      trip: tripResult.rows[0],
      latest_position: latestResult.rows[0] ?? null,
      history: historyResult.rows,
    });
  } catch (err) {
    console.error("[GET /api/trips/:tripId]", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ─── Bootstrap ────────────────────────────────────────────────────────────────

async function bootstrap() {
  try {
    await createTables();
  } catch (err) {
    console.error("[DB] Failed to create tables:", err);
    process.exit(1);
  }

  const port = parseInt(process.env.PORT ?? "3000", 10);
  app.listen(port, () => {
    console.log(`[BusTracker API] Server running on port ${port}`);
    console.log(`[BusTracker API] Health: http://localhost:${port}/api/health`);
  });
}

bootstrap().catch(console.error);

module.exports = app;
