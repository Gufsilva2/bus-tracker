# BusTracker Real-Time - Complete Project Export

## What's Included

This ZIP contains the **complete source code** of the BusTracker Real-Time bus tracking application.

✅ **Full Source Code** (~3 MB)
- React Native + Expo frontend (iOS/Android/Web)
- Express + tRPC backend
- Drizzle ORM with MySQL schema
- All components and utilities
- Authentication system
- Admin portal

✅ **Configuration Files**
- package.json with all dependencies
- TypeScript configuration
- Expo configuration
- Drizzle database configuration
- Tailwind CSS configuration

✅ **Documentation**
- design.md - Complete UI/UX design
- DEPLOYMENT_COMPLETE.md - Deployment guide
- APP_STORE_GUIDE.md - App Store submission
- REGISTRATION_STEP_BY_STEP.md - Company registration
- OWNERSHIP_REGISTRATION.md - IP ownership
- B2B_ADVERTISING_GUIDE.md - Advertising guide
- INTELLECTUAL_PROPERTY.md - IP information

## Getting Started

### 1. Extract the ZIP
```bash
unzip bustracker-complete-export.zip
cd bustracker-export
```

### 2. Install Dependencies
```bash
pnpm install
# or: npm install
# or: yarn install
```

### 3. Setup Environment
Create `.env.local` with your configuration:
```
DATABASE_URL=mysql://user:pass@host/database
JWT_SECRET=your-secret-key
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
```

### 4. Initialize Database
```bash
pnpm db:push
```

### 5. Run Development
```bash
pnpm dev
```

## Project Structure

```
bustracker-export/
├── app/                    # Expo Router app screens
├── components/             # React Native components
├── server/                 # Express + tRPC backend
├── drizzle/                # Database schema
├── lib/                    # Utilities and services
├── hooks/                  # Custom React hooks
├── constants/              # App constants
├── assets/                 # Images and icons
├── package.json            # Dependencies
└── README_FIRST.md         # This file
```

## Key Technologies

| Layer | Technology |
|-------|-----------|
| Frontend | React Native 19, Expo 54 |
| Backend | Express 4, tRPC 11 |
| Database | MySQL/TiDB, Drizzle ORM |
| Auth | Manus OAuth |
| Styling | Tailwind CSS, NativeWind |
| Build | Expo, esbuild |
| Testing | Vitest |

## Available Commands

```bash
pnpm dev              # Start dev server + Metro
pnpm dev:server       # Start Express only
pnpm dev:metro        # Start Metro only
pnpm build            # Build for production
pnpm start            # Run production
pnpm test             # Run tests
pnpm db:push          # Database migration
pnpm android          # Run on Android
pnpm ios              # Run on iOS
pnpm check            # Type check
pnpm lint             # ESLint
pnpm format           # Format code
```

## Features

### Passenger App
- ✅ Add and track bus trips
- ✅ Real-time ETA updates
- ✅ Traffic map visualization
- ✅ Trip history
- ✅ Push notifications
- ✅ QR code scanning

### Company Portal
- ✅ Create and manage trips
- ✅ Update trip status
- ✅ Monitor fleet
- ✅ View analytics
- ✅ Manage bookings

### Admin Dashboard
- ✅ System configuration
- ✅ User management
- ✅ Company management
- ✅ Analytics

## Deployment Options

1. **Manus Platform** (Recommended)
   - Create checkpoint
   - Click Publish
   - Configure domain

2. **Expo Go** (Development)
   - Run `pnpm dev`
   - Scan QR code

3. **EAS Build** (Mobile)
   - Build for iOS/Android
   - Deploy to app stores

4. **Docker** (Web)
   - Build container
   - Deploy to any hosting

5. **Railway/Render** (Web)
   - Connect GitHub
   - Deploy automatically

See DEPLOYMENT_COMPLETE.md for detailed instructions.

## Database

### Tables
- users - User accounts
- trips - Bus trips
- stops - Trip waypoints
- trip_status - Real-time updates
- companies - Bus companies
- passengers - Passenger data
- bookings - Ticket bookings

### Setup
```bash
pnpm db:push
```

## Security

⚠️ **Important**
- Never commit `.env` files
- Use strong JWT_SECRET in production
- Validate all user inputs
- Keep dependencies updated
- Use HTTPS in production

## File Sizes

| Item | Size |
|------|------|
| Source Code | ~3 MB |
| node_modules | ~500+ MB (not included) |
| Build Output | ~5-8 MB |

## Troubleshooting

**Port 3000 already in use?**
```bash
lsof -ti:3000 | xargs kill -9
```

**Database connection failed?**
- Check DATABASE_URL format
- Verify database server is running
- Check firewall rules

**Build fails?**
```bash
rm -rf node_modules dist
pnpm install
pnpm build
```

## Documentation

- **design.md** - UI/UX design specifications
- **DEPLOYMENT_COMPLETE.md** - Full deployment guide
- **APP_STORE_GUIDE.md** - App Store submission
- **REGISTRATION_STEP_BY_STEP.md** - Company registration
- **todo.md** - Project tasks and features

## Support & Resources

- **Manus Docs**: https://docs.manus.im
- **React Native**: https://reactnative.dev
- **Expo**: https://docs.expo.dev
- **tRPC**: https://trpc.io
- **Drizzle**: https://orm.drizzle.team

## Next Steps

1. ✅ Extract and install dependencies
2. ✅ Configure environment variables
3. ✅ Setup database
4. ✅ Run development server
5. ⏭️ Customize branding
6. ⏭️ Add your features
7. ⏭️ Deploy to production

## License

MIT License - See LICENSE file

---

**Project**: BusTracker Real-Time  
**Version**: 1.0.0  
**Created**: 2026-03-04  
**Tech Stack**: React Native + Expo + tRPC + Drizzle + MySQL

**Questions?** Check the documentation files or visit https://docs.manus.im
