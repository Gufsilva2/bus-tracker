/**
 * Traffic Service
 * Integrates real-time traffic data from BR-116 and BR-277
 * Provides incident information and ETA calculations
 */

export interface TrafficIncident {
  id: string;
  type: "accident" | "congestion" | "construction" | "weather";
  location: string;
  km: number;
  severity: "low" | "medium" | "high";
  description: string;
  timestamp: string;
  affectedLanes?: number;
  estimatedDuration?: string;
}

export interface TrafficData {
  route: "BR-116" | "BR-277";
  averageSpeed: number;
  congestionLevel: "low" | "medium" | "high";
  incidents: TrafficIncident[];
  lastUpdated: string;
}

export interface ETAData {
  currentKm: number;
  totalKm: number;
  progress: number;
  estimatedArrival: string;
  timeRemaining: string;
  averageSpeed: number;
  delay: number; // in minutes
}

// Mock traffic data for BR-116 (Régis Bittencourt)
const mockBR116Data: TrafficData = {
  route: "BR-116",
  averageSpeed: 78,
  congestionLevel: "medium",
  incidents: [
    {
      id: "br116-1",
      type: "accident",
      location: "Cajati/SP",
      km: 500,
      severity: "high",
      description: "Tombamento de carreta com incêndio. Bloqueio total.",
      timestamp: "Há 2 horas",
      affectedLanes: 2,
      estimatedDuration: "2-3 horas",
    },
    {
      id: "br116-2",
      type: "congestion",
      location: "Serra do Cafezal",
      km: 420,
      severity: "medium",
      description: "Lentidão devido ao fluxo intenso de veículos.",
      timestamp: "Há 30 min",
    },
    {
      id: "br116-3",
      type: "congestion",
      location: "Registro/SP",
      km: 460,
      severity: "medium",
      description: "Trânsito intenso. Fluxo lento em ambas as direções.",
      timestamp: "Há 15 min",
    },
  ],
  lastUpdated: new Date().toISOString(),
};

// Mock traffic data for BR-277
const mockBR277Data: TrafficData = {
  route: "BR-277",
  averageSpeed: 85,
  congestionLevel: "low",
  incidents: [
    {
      id: "br277-1",
      type: "construction",
      location: "Curitiba/PR",
      km: 150,
      severity: "low",
      description: "Obras de manutenção em andamento. Uma faixa liberada.",
      timestamp: "Hoje",
      affectedLanes: 1,
    },
  ],
  lastUpdated: new Date().toISOString(),
};

/**
 * Get traffic data for a specific route
 */
export function getTrafficData(route: "BR-116" | "BR-277"): TrafficData {
  return route === "BR-116" ? mockBR116Data : mockBR277Data;
}

/**
 * Get all traffic incidents
 */
export function getAllIncidents(): TrafficIncident[] {
  return [...mockBR116Data.incidents, ...mockBR277Data.incidents];
}

/**
 * Get incidents by severity
 */
export function getIncidentsBySeverity(
  severity: "low" | "medium" | "high"
): TrafficIncident[] {
  return getAllIncidents().filter((i) => i.severity === severity);
}

/**
 * Calculate ETA based on current position and traffic conditions
 */
export function calculateETA(
  departureTime: string,
  totalDuration: { hours: number; minutes: number },
  currentTime: string,
  currentKm: number,
  totalKm: number,
  delayMinutes: number = 0
): ETAData {
  // Parse times
  const [depHour, depMin] = departureTime.split(":").map(Number);
  const [currHour, currMin] = currentTime.split(":").map(Number);

  // Create date objects
  const depDate = new Date(2026, 2, 1, depHour, depMin, 0);
  const currDate = new Date(2026, 2, 1, currHour, currMin, 0);

  // If current time is before departure, assume it's the next day
  if (currDate < depDate) {
    currDate.setDate(currDate.getDate() + 1);
  }

  // Calculate total travel time in minutes
  const totalMinutes = totalDuration.hours * 60 + totalDuration.minutes;

  // Calculate elapsed time
  const elapsedMs = currDate.getTime() - depDate.getTime();
  const elapsedMinutes = elapsedMs / (1000 * 60);

  // Calculate remaining time
  let remainingMinutes = totalMinutes - elapsedMinutes + delayMinutes;

  // Calculate ETA
  const etaDate = new Date(currDate.getTime() + remainingMinutes * 60 * 1000);
  const etaHours = String(etaDate.getHours()).padStart(2, "0");
  const etaMinutes = String(etaDate.getMinutes()).padStart(2, "0");
  const estimatedArrival = `${etaHours}:${etaMinutes}`;

  // Calculate time remaining
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = Math.floor(remainingMinutes % 60);
  const timeRemaining = `${hours}h ${minutes}min`;

  // Calculate progress
  const progress = Math.round((currentKm / totalKm) * 100);

  // Calculate average speed
  const averageSpeed = Math.round((currentKm / elapsedMinutes) * 60);

  return {
    currentKm,
    totalKm,
    progress,
    estimatedArrival,
    timeRemaining,
    averageSpeed,
    delay: delayMinutes,
  };
}

/**
 * Get impact of traffic on ETA
 */
export function getTrafficImpact(
  route: "BR-116" | "BR-277",
  currentKm: number
): { additionalDelay: number; affectedSegments: TrafficIncident[] } {
  const trafficData = getTrafficData(route);
  const affectedSegments = trafficData.incidents.filter(
    (i) => Math.abs(i.km - currentKm) < 100
  ); // Within 100km range

  // Estimate additional delay based on severity
  let additionalDelay = 0;
  affectedSegments.forEach((incident) => {
    if (incident.severity === "high") additionalDelay += 60;
    else if (incident.severity === "medium") additionalDelay += 30;
    else additionalDelay += 10;
  });

  return { additionalDelay, affectedSegments };
}

/**
 * Simulate real-time position update
 */
export function simulatePositionUpdate(
  previousKm: number,
  averageSpeed: number,
  timeIntervalMinutes: number = 5
): number {
  // Add some randomness to simulate real-world conditions
  const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  const distanceTraveled = (averageSpeed * timeIntervalMinutes * randomFactor) / 60;
  return Math.round(previousKm + distanceTraveled);
}
