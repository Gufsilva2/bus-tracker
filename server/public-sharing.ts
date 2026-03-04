import { nanoid } from "nanoid";
import * as db from "./db";

/**
 * Public sharing service
 * Generates shareable links and QR codes for trips
 */

export interface SharedTripLink {
  shareId: string;
  tripId: number;
  expiresAt: Date;
  createdAt: Date;
  viewCount: number;
  isActive: boolean;
}

export interface PublicTripData {
  tripId: number;
  busNumber: string;
  origin: string;
  destination: string;
  departureTime: Date;
  estimatedArrivalTime: Date;
  status: string;
  currentLatitude?: number;
  currentLongitude?: number;
  currentSpeed?: number;
  delayMinutes?: number;
  stops: Array<{
    city: string;
    estimatedTime: Date;
  }>;
}

/**
 * Generate a shareable link for a trip
 */
export async function generateShareLink(
  tripId: number,
  expirationHours: number = 24
): Promise<SharedTripLink> {
  const shareId = nanoid(12);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expirationHours);

  // TODO: Store in database
  // await db.createSharedTrip({
  //   shareId,
  //   tripId,
  //   expiresAt,
  // });

  return {
    shareId,
    tripId,
    expiresAt,
    createdAt: new Date(),
    viewCount: 0,
    isActive: true,
  };
}

/**
 * Get public trip data by share ID
 */
export async function getPublicTripData(shareId: string): Promise<PublicTripData | null> {
  // TODO: Verify share link is valid and not expired
  // const sharedTrip = await db.getSharedTrip(shareId);
  // if (!sharedTrip || sharedTrip.expiresAt < new Date()) {
  //   return null;
  // }

  // TODO: Get trip data
  // const trip = await db.getTripById(sharedTrip.tripId);
  // const stops = await db.getTripStops(trip.id);

  // TODO: Increment view count
  // await db.incrementShareViewCount(shareId);

  return null;
}

/**
 * Generate QR code data URL for a shared trip
 */
export async function generateQRCode(shareId: string): Promise<string> {
  const shareUrl = `${process.env.FRONTEND_URL || "http://localhost:8081"}/share/${shareId}`;

  // TODO: Use QR code library to generate
  // const qrCode = await QRCode.toDataURL(shareUrl);
  // return qrCode;

  return shareUrl;
}

/**
 * Revoke a shared link
 */
export async function revokeShareLink(shareId: string): Promise<boolean> {
  // TODO: Mark as inactive in database
  // await db.revokeSharedTrip(shareId);
  return true;
}

/**
 * Get all active shares for a trip
 */
export async function getActiveShares(tripId: number): Promise<SharedTripLink[]> {
  // TODO: Query database
  // const shares = await db.getActiveShares(tripId);
  // return shares.filter(s => s.expiresAt > new Date());
  return [];
}

/**
 * Format share URL
 */
export function getShareURL(shareId: string): string {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:8081";
  return `${baseUrl}/share/${shareId}`;
}

/**
 * Format QR code URL for Google Charts API
 */
export function getQRCodeURL(shareId: string): string {
  const shareUrl = getShareURL(shareId);
  const encoded = encodeURIComponent(shareUrl);
  return `https://chart.googleapis.com/chart?chs=300x300&chd=D:${encoded}&cht=qr`;
}
