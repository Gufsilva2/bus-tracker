# Admin Configuration - BusTracker v2.0.0

**Admin Email:** gui.fernandes_@hotmail.com  
**Role:** admin  
**Status:** ✅ Configured

---

## 🔒 Admin Protection Features

### Single Admin User
- ✅ Only one designated admin user can access admin routes
- ✅ Email-based verification: `gui.fernandes_@hotmail.com`
- ✅ Public admin creation is **disabled**
- ✅ All admin actions are logged for audit trail

### Protected Routes
All admin operations require:
1. User must be authenticated (logged in)
2. User must have `role = 'admin'`
3. User email must match `gui.fernandes_@hotmail.com`

### Admin Operations Protected
- ✅ Create trips
- ✅ Update trip status
- ✅ Update trip location
- ✅ Create alerts
- ✅ Create companies
- ✅ Create traffic incidents
- ✅ Change system settings

---

## 🛠️ Setup Instructions

### 1. Create Admin User

```bash
# Option A: Using script (Recommended)
node scripts/create-admin.mjs

# Option B: Using SQL
mysql -u user -p bustracker
> INSERT INTO users (openId, name, email, role, loginMethod, createdAt, updatedAt, lastSignedIn)
  VALUES ('admin-unique-id', 'Admin', 'gui.fernandes_@hotmail.com', 'admin', 'manual', NOW(), NOW(), NOW());
```

### 2. Verify Admin Creation

```bash
# Check in database
SELECT id, email, role FROM users WHERE email = 'gui.fernandes_@hotmail.com';

# Expected output:
# id | email                        | role
# 1  | gui.fernandes_@hotmail.com   | admin
```

### 3. Login as Admin

1. Start application: `pnpm dev`
2. Navigate to http://localhost:8081
3. Click "Login"
4. Login with Manus OAuth account
5. System verifies email and grants admin access

---

## 🔐 Security Features

### Email Verification
```typescript
// server/_core/admin-protection.ts
const ADMIN_EMAIL = "gui.fernandes_@hotmail.com";

export function verifyAdminUser(user: TrpcContext["user"]): boolean {
  if (!user) return false;
  if (user.role !== "admin") return false;
  if (user.email !== ADMIN_EMAIL) return false;  // Email must match exactly
  return true;
}
```

### Admin Procedure Protection
```typescript
// server/routers.ts
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  // Verify user is the designated admin
  requireAdminUser(ctx.user);
  return next({ ctx });
});
```

### Action Logging
```typescript
// All admin actions are logged
await logAdminAction(ctx.user.id, "CREATE_TRIP", {
  tripId: result.insertId,
  busNumber: input.busNumber,
  origin: input.origin,
  destination: input.destination,
});
```

---

## 📋 Admin Procedures

### Trips Management
```typescript
// Create trip
await trpc.trips.create.mutate({
  busNumber: "1024",
  origin: "São Paulo",
  destination: "Rio de Janeiro",
  departureTime: new Date(),
  estimatedArrivalTime: new Date(),
  companyId: 1,
});

// Update status
await trpc.trips.updateStatus.mutate({
  tripId: 1,
  status: "in_progress",
  delayMinutes: 0,
});

// Update location
await trpc.trips.updateLocation.mutate({
  tripId: 1,
  latitude: "-23.5505",
  longitude: "-46.6333",
  speed: 80,
});

// Create alert
await trpc.trips.addAlert.mutate({
  tripId: 1,
  type: "delay",
  title: "Trip Delayed",
  message: "30 minutes delay due to traffic",
  severity: "warning",
});
```

### Companies Management
```typescript
// Create company
await trpc.companies.create.mutate({
  name: "Viação Cometa",
  cnpj: "12.345.678/0001-90",
  email: "contato@viacao.com.br",
  phone: "(11) 3000-0000",
  subscriptionPlan: "professional",
});
```

### Traffic Management
```typescript
// Create traffic incident
await trpc.traffic.createIncident.mutate({
  road: "BR-116",
  latitude: "-23.5505",
  longitude: "-46.6333",
  type: "accident",
  description: "Car accident blocking 2 lanes",
  severity: "high",
  estimatedDuration: 60,
});
```

---

## ❌ What's Disabled

### Public Admin Creation
- ❌ Users cannot self-promote to admin
- ❌ No "Create Admin" button in UI
- ❌ No admin registration endpoint
- ❌ Only database SQL can create admins (manual process)

### Non-Admin Access to Admin Routes
- ❌ Regular users cannot access `/company-portal`
- ❌ Regular users cannot call admin procedures
- ❌ Regular users cannot change system settings
- ❌ Error: "Only the designated admin user can access this resource"

---

## 🚨 Error Handling

### Unauthorized Access Attempt
```typescript
// If non-admin user tries to create trip:
try {
  await trpc.trips.create.mutate({...});
} catch (error) {
  // Error: "Only the designated admin user can access this resource"
}
```

### Wrong Email
```typescript
// If admin user logs in with different email:
// System checks: user.email !== "gui.fernandes_@hotmail.com"
// Result: Access denied
```

### Missing Role
```typescript
// If user has role = 'user' instead of 'admin':
// System checks: user.role !== "admin"
// Result: Access denied
```

---

## 📊 Audit Trail

All admin actions are logged:

```
[ADMIN ACTION] User 1 performed: CREATE_TRIP {
  tripId: 42,
  busNumber: "1024",
  origin: "São Paulo",
  destination: "Rio de Janeiro"
}

[ADMIN ACTION] User 1 performed: UPDATE_TRIP_STATUS {
  tripId: 42,
  status: "in_progress",
  delayMinutes: 0
}

[ADMIN ACTION] User 1 performed: CREATE_COMPANY {
  companyId: 5,
  name: "Viação Cometa",
  subscriptionPlan: "professional"
}
```

---

## 🔄 Changing Admin User

To change the admin user:

1. **Update in code:**
   ```typescript
   // server/_core/admin-protection.ts
   const ADMIN_EMAIL = "new-admin@example.com";
   ```

2. **Update in database:**
   ```sql
   -- Remove old admin
   UPDATE users SET role = 'user' WHERE email = 'gui.fernandes_@hotmail.com';
   
   -- Promote new admin
   UPDATE users SET role = 'admin' WHERE email = 'new-admin@example.com';
   ```

3. **Restart application:**
   ```bash
   pnpm dev
   ```

---

## ✅ Verification Checklist

- [x] Admin email configured: `gui.fernandes_@hotmail.com`
- [x] Admin user created in database
- [x] Admin protection middleware implemented
- [x] All admin procedures protected
- [x] Public admin creation disabled
- [x] Action logging implemented
- [x] Email verification in place
- [x] Error handling for unauthorized access

---

## 📞 Support

For admin-related issues:
1. Check database: `SELECT * FROM users WHERE role = 'admin'`
2. Verify email matches: `gui.fernandes_@hotmail.com`
3. Check logs: `tail -f .manus-logs/devserver.log`
4. Restart application: `pnpm dev`

---

**Status:** ✅ Admin Protection Enabled  
**Version:** 2.0.0  
**Date:** 04 de março de 2026
