import AsyncStorage from "@react-native-async-storage/async-storage";
import { Trip, TrackingData, SharedTrip } from "./types";

const TRIPS_STORAGE_KEY = "@bustracker_trips";
const TRACKING_STORAGE_KEY = "@bustracker_tracking";
const SHARED_TRIPS_STORAGE_KEY = "@bustracker_shared_trips";

/**
 * Serviço de gerenciamento de viagens
 */
export class TripService {
  /**
   * Criar nova viagem
   */
  static async createTrip(tripData: Omit<Trip, "id" | "createdAt" | "updatedAt">): Promise<Trip> {
    const trip: Trip = {
      ...tripData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const trips = await this.getAllTrips();
    trips.push(trip);
    await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));

    return trip;
  }

  /**
   * Obter todas as viagens
   */
  static async getAllTrips(): Promise<Trip[]> {
    try {
      const data = await AsyncStorage.getItem(TRIPS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Obter viagem por ID
   */
  static async getTripById(tripId: string): Promise<Trip | null> {
    const trips = await this.getAllTrips();
    return trips.find((t) => t.id === tripId) || null;
  }

  /**
   * Atualizar viagem
   */
  static async updateTrip(tripId: string, updates: Partial<Trip>): Promise<Trip | null> {
    const trips = await this.getAllTrips();
    const index = trips.findIndex((t) => t.id === tripId);

    if (index === -1) return null;

    trips[index] = {
      ...trips[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
    return trips[index];
  }

  /**
   * Deletar viagem
   */
  static async deleteTrip(tripId: string): Promise<boolean> {
    const trips = await this.getAllTrips();
    const filtered = trips.filter((t) => t.id !== tripId);

    if (filtered.length === trips.length) return false;

    await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  /**
   * Obter viagens ativas
   */
  static async getActiveTrips(): Promise<Trip[]> {
    const trips = await this.getAllTrips();
    return trips.filter((t) => t.status === "in_progress");
  }

  /**
   * Obter viagens recentes
   */
  static async getRecentTrips(limit: number = 10): Promise<Trip[]> {
    const trips = await this.getAllTrips();
    return trips
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  /**
   * Salvar dados de rastreamento
   */
  static async saveTrackingData(trackingData: TrackingData): Promise<void> {
    const allTracking = await this.getAllTrackingData();
    allTracking.push(trackingData);

    // Manter apenas últimos 100 registros
    if (allTracking.length > 100) {
      allTracking.shift();
    }

    await AsyncStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(allTracking));
  }

  /**
   * Obter todos os dados de rastreamento
   */
  static async getAllTrackingData(): Promise<TrackingData[]> {
    try {
      const data = await AsyncStorage.getItem(TRACKING_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Obter dados de rastreamento de uma viagem
   */
  static async getTripTrackingData(tripId: string): Promise<TrackingData[]> {
    const allTracking = await this.getAllTrackingData();
    return allTracking.filter((t) => t.tripId === tripId);
  }

  /**
   * Obter último ponto de rastreamento
   */
  static async getLatestTrackingData(tripId: string): Promise<TrackingData | null> {
    const tracking = await this.getTripTrackingData(tripId);
    return tracking.length > 0 ? tracking[tracking.length - 1] : null;
  }

  /**
   * Criar viagem compartilhada
   */
  static async createSharedTrip(tripId: string, createdBy: string): Promise<SharedTrip> {
    const shareCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const publicUrl = `https://bustracker.com/share/${shareCode}`;

    const sharedTrip: SharedTrip = {
      id: Date.now().toString(),
      tripId,
      shareCode,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicUrl)}`,
      publicUrl,
      createdBy,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      accessCount: 0,
    };

    const sharedTrips = await this.getAllSharedTrips();
    sharedTrips.push(sharedTrip);
    await AsyncStorage.setItem(SHARED_TRIPS_STORAGE_KEY, JSON.stringify(sharedTrips));

    return sharedTrip;
  }

  /**
   * Obter todas as viagens compartilhadas
   */
  static async getAllSharedTrips(): Promise<SharedTrip[]> {
    try {
      const data = await AsyncStorage.getItem(SHARED_TRIPS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Obter viagem compartilhada por código
   */
  static async getSharedTripByCode(shareCode: string): Promise<SharedTrip | null> {
    const sharedTrips = await this.getAllSharedTrips();
    const shared = sharedTrips.find((s) => s.shareCode === shareCode);

    if (shared) {
      // Incrementar contador de acessos
      shared.accessCount += 1;
      await AsyncStorage.setItem(SHARED_TRIPS_STORAGE_KEY, JSON.stringify(sharedTrips));
    }

    return shared || null;
  }

  /**
   * Deletar viagem compartilhada
   */
  static async deleteSharedTrip(sharedTripId: string): Promise<boolean> {
    const sharedTrips = await this.getAllSharedTrips();
    const filtered = sharedTrips.filter((s) => s.id !== sharedTripId);

    if (filtered.length === sharedTrips.length) return false;

    await AsyncStorage.setItem(SHARED_TRIPS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  /**
   * Calcular distância entre dois pontos (Haversine)
   */
  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Estimar ETA baseado em velocidade e distância
   */
  static estimateETA(distanceKm: number, speedKmh: number): number {
    if (speedKmh === 0) return 0;
    return Math.round((distanceKm / speedKmh) * 60); // retorna em minutos
  }

  /**
   * Formatar tempo em minutos para string legível
   */
  static formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  /**
   * Formatar distância
   */
  static formatDistance(km: number): string {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  }
}
