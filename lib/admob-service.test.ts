import { describe, it, expect, beforeEach } from "vitest";
import { AdMobService, createAdMobService } from "./admob-service";

describe("AdMobService", () => {
  let service: AdMobService;

  beforeEach(() => {
    service = createAdMobService();
  });

  describe("initialization", () => {
    it("should initialize with config", () => {
      const config = service.getConfig();
      expect(config.publisherId).toBeDefined();
      expect(config.appId).toBeDefined();
      expect(config.bannerAdUnitId).toBeDefined();
      expect(config.interstitialAdUnitId).toBeDefined();
      expect(config.rewardedAdUnitId).toBeDefined();
    });
  });

  describe("banner ads", () => {
    it("should load banner ad", () => {
      service.loadBannerAd();
      const impressions = service.getImpressions();
      expect(impressions.length).toBe(1);
      expect(impressions[0].adType).toBe("banner");
    });

    it("should record multiple banner ads", () => {
      service.loadBannerAd();
      service.loadBannerAd();
      service.loadBannerAd();

      const bannerAds = service.getImpressionsByType("banner");
      expect(bannerAds.length).toBe(3);
    });
  });

  describe("interstitial ads", () => {
    it("should load interstitial ad", () => {
      service.loadInterstitialAd();
      const impressions = service.getImpressions();
      expect(impressions.length).toBe(1);
      expect(impressions[0].adType).toBe("interstitial");
    });

    it("should determine when to show interstitial", () => {
      expect(service.shouldShowInterstitial(5)).toBe(true);
      expect(service.shouldShowInterstitial(10)).toBe(true);
      expect(service.shouldShowInterstitial(3)).toBe(false);
      expect(service.shouldShowInterstitial(1)).toBe(false);
    });
  });

  describe("rewarded ads", () => {
    it("should load rewarded ad", () => {
      service.loadRewardedAd();
      const impressions = service.getImpressions();
      expect(impressions.length).toBe(1);
      expect(impressions[0].adType).toBe("rewarded");
    });

    it("should determine when to show rewarded ad", () => {
      expect(service.shouldShowRewardedAd("travel_completed")).toBe(true);
      expect(service.shouldShowRewardedAd("travel_started")).toBe(false);
      expect(service.shouldShowRewardedAd("screen_view")).toBe(false);
    });
  });

  describe("impressions tracking", () => {
    it("should get total impressions", () => {
      service.loadBannerAd();
      service.loadInterstitialAd();
      service.loadRewardedAd();

      expect(service.getTotalImpressions()).toBe(3);
    });

    it("should filter impressions by type", () => {
      service.loadBannerAd();
      service.loadBannerAd();
      service.loadInterstitialAd();
      service.loadRewardedAd();

      expect(service.getImpressionsByType("banner").length).toBe(2);
      expect(service.getImpressionsByType("interstitial").length).toBe(1);
      expect(service.getImpressionsByType("rewarded").length).toBe(1);
    });

    it("should record timestamp for each impression", () => {
      service.loadBannerAd();
      const impressions = service.getImpressions();

      expect(impressions[0].timestamp).toBeDefined();
      expect(new Date(impressions[0].timestamp)).toBeInstanceOf(Date);
    });
  });

  describe("subscription", () => {
    it("should notify subscribers of impressions", () => {
      let receivedImpressions: any[] = [];
      const unsubscribe = service.subscribe((impression) => {
        receivedImpressions.push(impression);
      });

      service.loadBannerAd();
      service.loadInterstitialAd();

      expect(receivedImpressions.length).toBe(2);
      expect(receivedImpressions[0].adType).toBe("banner");
      expect(receivedImpressions[1].adType).toBe("interstitial");

      unsubscribe();
    });

    it("should unsubscribe from impressions", () => {
      let callCount = 0;
      const unsubscribe = service.subscribe(() => {
        callCount++;
      });

      service.loadBannerAd();
      expect(callCount).toBe(1);

      unsubscribe();
      service.loadBannerAd();
      expect(callCount).toBe(1);
    });
  });

  describe("configuration", () => {
    it("should update configuration", () => {
      const originalConfig = service.getConfig();
      const newPublisherId = "pub-new-id";

      service.updateConfig({ publisherId: newPublisherId });
      const updatedConfig = service.getConfig();

      expect(updatedConfig.publisherId).toBe(newPublisherId);
      expect(updatedConfig.appId).toBe(originalConfig.appId);
    });
  });
});
