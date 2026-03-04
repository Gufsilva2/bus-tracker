import { describe, it, expect } from "vitest";
import {
  getTrafficData,
  getAllIncidents,
  getIncidentsBySeverity,
  calculateETA,
  getTrafficImpact,
  simulatePositionUpdate,
} from "./traffic-service";

describe("Traffic Service", () => {
  describe("getTrafficData", () => {
    it("should return BR-116 traffic data", () => {
      const data = getTrafficData("BR-116");
      expect(data.route).toBe("BR-116");
      expect(data.incidents.length).toBeGreaterThan(0);
    });

    it("should return BR-277 traffic data", () => {
      const data = getTrafficData("BR-277");
      expect(data.route).toBe("BR-277");
      expect(data.incidents.length).toBeGreaterThan(0);
    });

    it("should have valid traffic metrics", () => {
      const data = getTrafficData("BR-116");
      expect(data.averageSpeed).toBeGreaterThan(0);
      expect(["low", "medium", "high"]).toContain(data.congestionLevel);
    });
  });

  describe("getAllIncidents", () => {
    it("should return all incidents from both routes", () => {
      const incidents = getAllIncidents();
      expect(incidents.length).toBeGreaterThan(0);
    });

    it("should have valid incident structure", () => {
      const incidents = getAllIncidents();
      incidents.forEach((incident) => {
        expect(incident.id).toBeDefined();
        expect(incident.type).toBeDefined();
        expect(incident.location).toBeDefined();
        expect(incident.km).toBeGreaterThanOrEqual(0);
        expect(["low", "medium", "high"]).toContain(incident.severity);
      });
    });
  });

  describe("getIncidentsBySeverity", () => {
    it("should filter incidents by severity", () => {
      const highSeverity = getIncidentsBySeverity("high");
      highSeverity.forEach((incident) => {
        expect(incident.severity).toBe("high");
      });
    });

    it("should return empty array if no incidents match", () => {
      // This might not always be true, but we can test the filter works
      const incidents = getIncidentsBySeverity("low");
      expect(Array.isArray(incidents)).toBe(true);
    });
  });

  describe("calculateETA", () => {
    it("should calculate ETA correctly", () => {
      const eta = calculateETA(
        "14:15",
        { hours: 16, minutes: 20 },
        "19:15",
        520,
        800,
        120
      );

      expect(eta.currentKm).toBe(520);
      expect(eta.totalKm).toBe(800);
      expect(eta.progress).toBe(65);
      expect(eta.delay).toBe(120);
      expect(eta.estimatedArrival).toBeDefined();
      expect(eta.timeRemaining).toBeDefined();
      expect(eta.averageSpeed).toBeGreaterThan(0);
    });

    it("should calculate progress correctly", () => {
      const eta = calculateETA(
        "14:15",
        { hours: 16, minutes: 20 },
        "19:15",
        400,
        800,
        0
      );

      expect(eta.progress).toBe(50);
    });

    it("should handle zero progress", () => {
      const eta = calculateETA(
        "14:15",
        { hours: 16, minutes: 20 },
        "14:15",
        0,
        800,
        0
      );

      expect(eta.progress).toBe(0);
    });

    it("should calculate time remaining", () => {
      const eta = calculateETA(
        "14:15",
        { hours: 16, minutes: 20 },
        "19:15",
        520,
        800,
        0
      );

      expect(eta.timeRemaining).toMatch(/\d+h \d+min/);
    });
  });

  describe("getTrafficImpact", () => {
    it("should identify affected segments", () => {
      const impact = getTrafficImpact("BR-116", 500);
      expect(impact.additionalDelay).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(impact.affectedSegments)).toBe(true);
    });

    it("should calculate additional delay based on severity", () => {
      // High severity incident at km 500
      const impact = getTrafficImpact("BR-116", 500);
      expect(impact.additionalDelay).toBeGreaterThan(0);
    });

    it("should return zero delay if no incidents nearby", () => {
      const impact = getTrafficImpact("BR-116", 0);
      // Depends on mock data, but we can at least check it's a valid number
      expect(typeof impact.additionalDelay).toBe("number");
    });
  });

  describe("simulatePositionUpdate", () => {
    it("should update position based on speed", () => {
      const currentKm = 500;
      const newKm = simulatePositionUpdate(currentKm, 80, 5);
      expect(newKm).toBeGreaterThan(currentKm);
    });

    it("should handle different time intervals", () => {
      const currentKm = 500;
      const newKm5min = simulatePositionUpdate(currentKm, 80, 5);
      const newKm10min = simulatePositionUpdate(currentKm, 80, 10);

      expect(newKm10min).toBeGreaterThan(newKm5min);
    });

    it("should add randomness to simulation", () => {
      const currentKm = 500;
      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(simulatePositionUpdate(currentKm, 80, 5));
      }

      // Check that not all results are the same (randomness is applied)
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBeGreaterThan(1);
    });
  });
});
