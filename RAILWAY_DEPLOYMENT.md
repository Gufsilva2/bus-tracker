# BusTracker - Railway Deployment Guide

**Version:** 2.1.0  
**Status:** Production Ready

---

## 📋 Pre-Deployment Checklist

- [ ] GitHub account created
- [ ] Railway account created (railway.app)
- [ ] Google Maps API key obtained
- [ ] Manus OAuth credentials ready
- [ ] Admin email configured: gui.fernandes_@hotmail.com

---

## 🚀 Deployment Steps

### 1. Create GitHub Repository

```bash
# Create repo on GitHub named "bus-tracker"
# Then push local code:

cd /home/ubuntu/bus-tracker
git remote add origin https://github.com/YOUR_USERNAME/bus-tracker.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub account
5. Select "bus-tracker" repository
6. Click "Deploy"

### 3. Configure Database

1. In Railway dashboard, click "Add Service"
2. Select "PostgreSQL"
3. Click "Add"
4. Railway will automatically set `DATABASE_URL` environment variable

### 4. Configure Environment Variables

In Railway dashboard, go to "Variables" and add:

```
DATABASE_URL=postgresql://... (auto-filled by Railway)
JWT_SECRET=your-secret-key-here-min-32-characters
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
OWNER_OPEN_ID=your-open-id
OWNER_NAME=Admin Name
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-railway-url.railway.app
VITE_API_BASE_URL=https://your-railway-url.railway.app
```

### 5. Build & Deploy

Railway will automatically:
1. Install dependencies: `pnpm install`
2. Build: `pnpm build`
3. Start: `pnpm start`

Watch the deployment logs in Railway dashboard.

### 6. Run Database Migrations

After first deployment:

```bash
# Via Railway CLI
railway run pnpm db:push

# Or via SSH into Railway container
railway shell
pnpm db:push
```

### 7. Create Admin User

```bash
# Via Railway CLI
railway run node scripts/create-admin.mjs

# Or via SSH
railway shell
node scripts/create-admin.mjs
```

---

## 🔗 Getting Your Production URL

After deployment, Railway provides a URL like:
```
https://bus-tracker-production-xxxx.railway.app
```

This is your public production URL.

---

## ✅ Post-Deployment Verification

### 1. Test Homepage
```
https://bus-tracker-production-xxxx.railway.app/
```

### 2. Test OAuth Login
- Click "Login"
- Authenticate with Manus OAuth
- Should redirect to dashboard

### 3. Test Admin Access
- Login with email: gui.fernandes_@hotmail.com
- Should see admin panel
- Other users should NOT see admin options

### 4. Test WebSocket
- Open browser console
- Should see WebSocket connection: `ws://...`
- Subscribe to trip should work

### 5. Test Google Maps
- Navigate to trip details
- Map should render with markers and polyline

### 6. Test Public Sharing
- Admin generates share link
- Access `/share/{shareId}` without login
- Should see trip details and real-time updates

---

## 🔐 Security Checklist

- [ ] Admin email protected: gui.fernandes_@hotmail.com
- [ ] JWT_SECRET is strong (min 32 characters)
- [ ] DATABASE_URL is secure
- [ ] OAuth credentials are valid
- [ ] Google Maps API key is restricted
- [ ] WebSocket authentication enabled
- [ ] Public routes don't expose admin data

---

## 📊 Monitoring

### View Logs
```bash
railway logs
```

### View Metrics
- CPU usage
- Memory usage
- Request count
- Response time

### Set Alerts
Configure in Railway dashboard for:
- High CPU usage
- High memory usage
- Deployment failures
- Crashes

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Check build logs in Railway dashboard
# Common issues:
# - Missing dependencies: pnpm install
# - TypeScript errors: pnpm check
# - Build command: pnpm build
```

### Database Connection Error
```bash
# Verify DATABASE_URL is set
# Check PostgreSQL service is running
# Test connection: psql $DATABASE_URL
```

### WebSocket Not Connecting
```bash
# Check Socket.io is initialized
# Verify WebSocket port is exposed
# Check CORS settings
```

### OAuth Not Working
```bash
# Verify VITE_APP_ID is correct
# Check OAUTH_SERVER_URL
# Verify redirect URI is registered
```

---

## 📈 Scaling

### Increase Resources
1. Go to Railway dashboard
2. Click "Settings"
3. Increase CPU/Memory allocation
4. Railway will restart with new resources

### Database Scaling
1. Go to PostgreSQL service
2. Upgrade plan for more storage/connections
3. No downtime required

---

## 🔄 Continuous Deployment

Railway automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Railway will automatically:
# 1. Detect push
# 2. Build new version
# 3. Run tests
# 4. Deploy to production
```

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- BusTracker Issues: Check GitHub repo
- Manus Support: https://help.manus.im

---

**Status:** ✅ Ready for Production  
**Version:** 2.1.0  
**Last Updated:** 04 de março de 2026
