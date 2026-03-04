/**
 * AdMob Service
 * Integrates Google AdMob for monetization through advertisements
 * 
 * This service handles:
 * - Banner ads (bottom of screens)
 * - Interstitial ads (full-screen between navigation)
 * - Rewarded ads (optional, for premium features)
 */

export interface AdMobConfig {
  publisherId: string;
  appId: string;
  bannerAdUnitId: string;
  interstitialAdUnitId: string;
  rewardedAdUnitId: string;
  testDeviceIds?: string[];
}

export interface AdImpressionData {
  adUnitId: string;
  adType: "banner" | "interstitial" | "rewarded";
  timestamp: string;
  revenue?: number;
  currency?: string;
}

/**
 * AdMob Service for managing advertisements
 * 
 * In production, this would integrate with:
 * - expo-ads-google-mobile-ads (for native ads)
 * - Or react-native-google-mobile-ads
 */
export class AdMobService {
  private config: AdMobConfig;
  private impressions: AdImpressionData[] = [];
  private listeners: ((impression: AdImpressionData) => void)[] = [];

  constructor(config: AdMobConfig) {
    this.config = config;
    this.initializeAdMob();
  }

  /**
   * Initialize AdMob SDK
   * In production, this would call the actual AdMob initialization
   */
  private initializeAdMob(): void {
    console.log("AdMob initialized with config:", {
      publisherId: this.config.publisherId,
      appId: this.config.appId,
    });
  }

  /**
   * Load and display banner ad
   * Typically shown at the bottom of screens
   */
  loadBannerAd(): void {
    const impression: AdImpressionData = {
      adUnitId: this.config.bannerAdUnitId,
      adType: "banner",
      timestamp: new Date().toISOString(),
    };

    this.recordImpression(impression);
    console.log("Banner ad loaded:", this.config.bannerAdUnitId);
  }

  /**
   * Load and display interstitial ad
   * Full-screen ad shown between screen transitions
   */
  loadInterstitialAd(): void {
    const impression: AdImpressionData = {
      adUnitId: this.config.interstitialAdUnitId,
      adType: "interstitial",
      timestamp: new Date().toISOString(),
    };

    this.recordImpression(impression);
    console.log("Interstitial ad loaded:", this.config.interstitialAdUnitId);
  }

  /**
   * Load rewarded ad
   * User watches ad in exchange for in-app reward
   */
  loadRewardedAd(): void {
    const impression: AdImpressionData = {
      adUnitId: this.config.rewardedAdUnitId,
      adType: "rewarded",
      timestamp: new Date().toISOString(),
    };

    this.recordImpression(impression);
    console.log("Rewarded ad loaded:", this.config.rewardedAdUnitId);
  }

  /**
   * Record ad impression
   */
  private recordImpression(impression: AdImpressionData): void {
    this.impressions.push(impression);
    this.notifyListeners(impression);
  }

  /**
   * Get all recorded impressions
   */
  getImpressions(): AdImpressionData[] {
    return [...this.impressions];
  }

  /**
   * Get impressions by type
   */
  getImpressionsByType(type: "banner" | "interstitial" | "rewarded"): AdImpressionData[] {
    return this.impressions.filter((i) => i.adType === type);
  }

  /**
   * Get total impressions count
   */
  getTotalImpressions(): number {
    return this.impressions.length;
  }

  /**
   * Subscribe to ad impressions
   */
  subscribe(listener: (impression: AdImpressionData) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Notify listeners of impression
   */
  private notifyListeners(impression: AdImpressionData): void {
    this.listeners.forEach((listener) => listener(impression));
  }

  /**
   * Check if should show interstitial ad
   * Strategy: Show after every 5 screen navigations
   */
  shouldShowInterstitial(navigationCount: number): boolean {
    return navigationCount > 0 && navigationCount % 5 === 0;
  }

  /**
   * Check if should show rewarded ad
   * Strategy: Offer after completing a travel
   */
  shouldShowRewardedAd(eventType: string): boolean {
    return eventType === "travel_completed";
  }

  /**
   * Get AdMob configuration
   */
  getConfig(): AdMobConfig {
    return { ...this.config };
  }

  /**
   * Update AdMob configuration (for testing)
   */
  updateConfig(newConfig: Partial<AdMobConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

/**
 * Create AdMob service instance with default configuration
 * Replace with actual AdMob IDs from your Google AdMob account
 */
export function createAdMobService(): AdMobService {
  return new AdMobService({
    publisherId: "pub-xxxxxxxxxxxxxxxx", // Replace with your publisher ID
    appId: "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy", // Replace with your app ID
    bannerAdUnitId: "ca-app-pub-3940256099942544/6300978111", // Test banner ad unit
    interstitialAdUnitId: "ca-app-pub-3940256099942544/1033173712", // Test interstitial ad unit
    rewardedAdUnitId: "ca-app-pub-3940256099942544/5224354917", // Test rewarded ad unit
    testDeviceIds: ["33BE2250B43518CCDA7DE426D04EE232"], // Test device ID
  });
}
