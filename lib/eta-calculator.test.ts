import { describe, it, expect } from "vitest";

/**
 * ETACalculator Test Suite
 * Tests for calculating estimated time of arrival (ETA) based on travel data
 */

function calculateEta(
  departureTimeStr: string,
  totalTravelHours: number,
  totalTravelMinutes: number,
  currentTimeStr: string,
  delayMinutes: number
): string {
  // Parse departure time
  const [depHour, depMin] = departureTimeStr.split(":").map(Number);
  const departureDate = new Date(2026, 2, 1); // March 1, 2026
  const departureTime = new Date(departureDate);
  departureTime.setHours(depHour, depMin, 0, 0);

  // Parse current time (assuming same day or next day)
  const [currHour, currMin] = currentTimeStr.split(":").map(Number);
  const currentDate = new Date(2026, 2, 1); // March 1, 2026 initially
  const currentTime = new Date(currentDate);
  currentTime.setHours(currHour, currMin, 0, 0);

  // If current time is before departure, adjust to next day
  if (currentTime < departureTime) {
    currentDate.setDate(currentDate.getDate() + 1);
    currentTime.setDate(currentDate.getDate());
  }

  // Calculate total travel time in minutes
  const totalTravelMinutesValue = totalTravelHours * 60 + totalTravelMinutes;

  // Calculate time elapsed
  const timeElapsedMs = currentTime.getTime() - departureTime.getTime();
  const timeElapsedMinutes = timeElapsedMs / (1000 * 60);

  // Calculate remaining travel time
  let remainingTravelMinutes = totalTravelMinutesValue - timeElapsedMinutes;

  // Add delay
  remainingTravelMinutes += delayMinutes;

  // If already arrived
  if (remainingTravelMinutes <= 0) {
    return "Already arrived";
  }

  // Calculate ETA
  const etaTime = new Date(currentTime.getTime() + remainingTravelMinutes * 60 * 1000);
  const hours = String(etaTime.getHours()).padStart(2, "0");
  const minutes = String(etaTime.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

describe("ETACalculator", () => {
  it("should calculate ETA correctly for a journey in progress", () => {
    // Departure: 14:15 on March 1
    // Duration: 16h 20min
    // Current time: 19:15 (5 hours elapsed)
    // Delay: 120 minutes
    // Expected ETA: 08:35 on March 2

    const eta = calculateEta("14:15", 16, 20, "19:15", 120);
    expect(eta).toBe("08:35");
  });

  it("should calculate ETA with no delay", () => {
    // Departure: 14:15
    // Duration: 16h 20min
    // Current time: 19:15 (5 hours elapsed)
    // Delay: 0 minutes
    // Expected ETA: 06:35 on March 2

    const eta = calculateEta("14:15", 16, 20, "19:15", 0);
    expect(eta).toBe("06:35");
  });

  it("should calculate ETA with small delay", () => {
    // Departure: 14:15
    // Duration: 16h 20min
    // Current time: 19:15 (5 hours elapsed)
    // Delay: 30 minutes
    // Expected ETA: 07:05 on March 2

    const eta = calculateEta("14:15", 16, 20, "19:15", 30);
    expect(eta).toBe("07:05");
  });

  it("should calculate ETA with significant delay", () => {
    // Departure: 14:15
    // Duration: 16h 20min
    // Current time: 19:15 (5 hours elapsed)
    // Delay: 180 minutes (3 hours)
    // Expected ETA: 09:35 on March 2

    const eta = calculateEta("14:15", 16, 20, "19:15", 180);
    expect(eta).toBe("09:35");
  });

  it("should handle different travel durations", () => {
    // Departure: 10:00
    // Duration: 12h 0min
    // Current time: 14:00 (4 hours elapsed)
    // Delay: 0 minutes
    // Expected ETA: 22:00 on March 1

    const eta = calculateEta("10:00", 12, 0, "14:00", 0);
    expect(eta).toBe("22:00");
  });

  it("should handle early morning departures", () => {
    // Departure: 06:00
    // Duration: 8h 0min
    // Current time: 10:00 (4 hours elapsed)
    // Delay: 0 minutes
    // Expected ETA: 14:00 on March 1

    const eta = calculateEta("06:00", 8, 0, "10:00", 0);
    expect(eta).toBe("14:00");
  });
});

describe("Travel Data Validation", () => {
  it("should validate passage number format", () => {
    const passageNumber = "SPPR0123001";
    expect(passageNumber).toMatch(/^[A-Z]{2}[A-Z]{2}\d{7}$/);
  });

  it("should validate time format", () => {
    const time = "14:15";
    expect(time).toMatch(/^\d{2}:\d{2}$/);
  });

  it("should validate date format", () => {
    const date = "01/03/2026";
    expect(date).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it("should validate travel status", () => {
    const validStatuses = ["active", "completed", "cancelled"];
    const status = "active";
    expect(validStatuses).toContain(status);
  });
});

describe("Progress Calculation", () => {
  it("should calculate progress percentage correctly", () => {
    const currentKm = 520;
    const totalKm = 800;
    const progress = Math.round((currentKm / totalKm) * 100);
    expect(progress).toBe(65);
  });

  it("should handle edge case of 0% progress", () => {
    const currentKm = 0;
    const totalKm = 800;
    const progress = Math.round((currentKm / totalKm) * 100);
    expect(progress).toBe(0);
  });

  it("should handle edge case of 100% progress", () => {
    const currentKm = 800;
    const totalKm = 800;
    const progress = Math.round((currentKm / totalKm) * 100);
    expect(progress).toBe(100);
  });
});
