# BusTracker Real-Time - Complete Deployment Guide

## Project Overview

BusTracker Real-Time is a comprehensive bus tracking application built with React Native + Expo, Express + tRPC, and MySQL.

## Quick Start

### 1. Install Dependencies
\`\`\`bash
pnpm install
\`\`\`

### 2. Setup Environment
Create .env.local with database and auth credentials.

### 3. Initialize Database
\`\`\`bash
pnpm db:push
\`\`\`

### 4. Development
\`\`\`bash
pnpm dev
\`\`\`

### 5. Build & Production
\`\`\`bash
pnpm build
pnpm start
\`\`\`

## Available Scripts

- pnpm dev - Start dev server + Metro
- pnpm dev:server - Start Express only
- pnpm dev:metro - Start Metro only
- pnpm build - Build for production
- pnpm start - Run production
- pnpm test - Run tests
- pnpm db:push - Database migration
- pnpm android - Run on Android
- pnpm ios - Run on iOS

## Tech Stack

- Frontend: React Native + Expo
- Backend: Express + tRPC
- Database: MySQL/TiDB
- ORM: Drizzle
- Auth: Manus OAuth
- Build: Expo + esbuild

## Deployment Options

1. Manus Platform (Recommended)
2. Expo Go (Development)
3. EAS Build (Mobile)
4. Docker (Web)
5. Railway/Render/Vercel

## Features

- Real-time bus tracking
- Traffic map visualization
- ETA calculations
- Push notifications
- Company admin portal
- Passenger management
- QR code scanning

## Security

- Change JWT_SECRET in production
- Use HTTPS
- Validate all inputs
- Keep dependencies updated
- Use environment variables for secrets

## Support

See full documentation in README files and design.md
