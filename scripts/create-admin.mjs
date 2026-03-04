#!/usr/bin/env node

/**
 * Create a single admin user
 * Usage: node scripts/create-admin.mjs
 */

import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_EMAIL = "gui.fernandes_@hotmail.com";
const ADMIN_NAME = "Admin";
const ADMIN_OPEN_ID = "admin-" + Date.now(); // Generate unique ID

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set in .env.local");
  process.exit(1);
}

async function createAdmin() {
  let connection;

  try {
    // Parse DATABASE_URL
    const url = new URL(DATABASE_URL);
    const config = {
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
    };

    console.log("📦 Connecting to database...");
    connection = await mysql.createConnection(config);

    // Check if admin already exists
    console.log("🔍 Checking for existing admin...");
    const [existingAdmins] = await connection.execute(
      "SELECT id, email FROM users WHERE role = 'admin' LIMIT 1"
    );

    if (existingAdmins.length > 0) {
      console.log(`⚠️  Admin already exists: ${existingAdmins[0].email}`);
      console.log("   Skipping creation...");
      await connection.end();
      return;
    }

    // Check if email already exists
    console.log("🔍 Checking if email already exists...");
    const [existingEmail] = await connection.execute(
      "SELECT id, role FROM users WHERE email = ?",
      [ADMIN_EMAIL]
    );

    if (existingEmail.length > 0) {
      console.log(`⚠️  Email already exists. Updating to admin...`);
      await connection.execute("UPDATE users SET role = 'admin' WHERE email = ?", [
        ADMIN_EMAIL,
      ]);
      console.log(`✅ User ${ADMIN_EMAIL} promoted to admin!`);
    } else {
      // Create new admin user
      console.log("👤 Creating new admin user...");
      const now = new Date();

      await connection.execute(
        `INSERT INTO users (openId, name, email, role, loginMethod, createdAt, updatedAt, lastSignedIn)
         VALUES (?, ?, ?, 'admin', 'manual', ?, ?, ?)`,
        [ADMIN_OPEN_ID, ADMIN_NAME, ADMIN_EMAIL, now, now, now]
      );

      console.log(`✅ Admin user created successfully!`);
    }

    // Verify creation
    const [admin] = await connection.execute(
      "SELECT id, email, role, createdAt FROM users WHERE email = ?",
      [ADMIN_EMAIL]
    );

    if (admin.length > 0) {
      const user = admin[0];
      console.log("\n📋 Admin User Details:");
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
    }

    console.log("\n✨ Setup complete!");
    console.log("   - Only this user can access admin routes");
    console.log("   - Public admin creation is disabled");
    console.log("   - Admin user can manage system settings");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdmin();
