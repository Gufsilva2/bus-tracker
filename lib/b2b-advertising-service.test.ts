import { describe, it, expect, beforeEach } from "vitest";
import { B2BAdvertisingService, ADVERTISING_PACKAGES } from "./b2b-advertising-service";

describe("B2BAdvertisingService", () => {
  let service: B2BAdvertisingService;

  beforeEach(() => {
    service = new B2BAdvertisingService();
  });

  describe("Company Registration", () => {
    it("should register a new bus company", () => {
      const company = service.registerCompany({
        name: "Nordeste Transportes",
        cnpj: "76.299.270/0001-07",
        email: "contato@nordeste.com.br",
        phone: "+55 45 3521-1234",
        routes: ["Foz do Iguaçu - São Paulo"],
      });

      expect(company.id).toBeDefined();
      expect(company.name).toBe("Nordeste Transportes");
      expect(company.createdAt).toBeDefined();
    });

    it("should retrieve company by ID", () => {
      const registered = service.registerCompany({
        name: "Viação Cometa",
        cnpj: "00.000.000/0000-00",
        email: "contato@cometa.com.br",
        phone: "+55 11 3000-0000",
        routes: ["São Paulo - Rio de Janeiro"],
      });

      const retrieved = service.getCompany(registered.id);
      expect(retrieved).toEqual(registered);
    });

    it("should get all registered companies", () => {
      service.registerCompany({
        name: "Company 1",
        cnpj: "11.111.111/1111-11",
        email: "company1@test.com",
        phone: "+55 11 1111-1111",
        routes: ["Route 1"],
      });

      service.registerCompany({
        name: "Company 2",
        cnpj: "22.222.222/2222-22",
        email: "company2@test.com",
        phone: "+55 22 2222-2222",
        routes: ["Route 2"],
      });

      const companies = service.getAllCompanies();
      expect(companies.length).toBe(2);
    });
  });

  describe("Advertising Packages", () => {
    it("should have predefined packages", () => {
      const packages = service.getPackages();
      expect(packages.length).toBeGreaterThan(0);
      expect(packages.map((p) => p.id)).toContain("pkg-starter");
      expect(packages.map((p) => p.id)).toContain("pkg-professional");
      expect(packages.map((p) => p.id)).toContain("pkg-premium");
    });

    it("should get package by ID", () => {
      const pkg = service.getPackage("pkg-starter");
      expect(pkg).toBeDefined();
      expect(pkg?.name).toBe("Pacote Iniciante");
      expect(pkg?.price).toBe(299);
    });

    it("should have correct package features", () => {
      const starterPkg = service.getPackage("pkg-starter");
      expect(starterPkg?.features).toContain("Anúncios em banner");
      expect(starterPkg?.adTypes).toEqual(["banner"]);

      const premiumPkg = service.getPackage("pkg-premium");
      expect(premiumPkg?.adTypes).toContain("featured");
    });
  });

  describe("Ad Creation and Management", () => {
    it("should create an ad for a company", () => {
      const company = service.registerCompany({
        name: "Test Company",
        cnpj: "00.000.000/0000-00",
        email: "test@test.com",
        phone: "+55 11 0000-0000",
        routes: ["Route A"],
      });

      const ad = service.createAd(company.id, "pkg-starter", {
        title: "Viaje com conforto",
        description: "Passagens com 50% de desconto",
        imageUrl: "https://example.com/ad.jpg",
        ctaText: "Comprar",
        ctaUrl: "https://nordeste.com.br",
        targetRoutes: ["Route A"],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      });

      expect(ad.id).toBeDefined();
      expect(ad.companyId).toBe(company.id);
      expect(ad.impressions).toBe(0);
      expect(ad.clicks).toBe(0);
    });

    it("should get ads for a specific route", () => {
      const company = service.registerCompany({
        name: "Test Company",
        cnpj: "00.000.000/0000-00",
        email: "test@test.com",
        phone: "+55 11 0000-0000",
        routes: ["SP-RJ"],
      });

      service.createAd(company.id, "pkg-starter", {
        title: "Ad 1",
        description: "Description 1",
        imageUrl: "https://example.com/ad1.jpg",
        ctaText: "Click",
        ctaUrl: "https://example.com",
        targetRoutes: ["SP-RJ"],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      });

      const ads = service.getAdsForRoute("SP-RJ");
      expect(ads.length).toBe(1);
      expect(ads[0].title).toBe("Ad 1");
    });

    it("should get all ads for a company", () => {
      const company = service.registerCompany({
        name: "Test Company",
        cnpj: "00.000.000/0000-00",
        email: "test@test.com",
        phone: "+55 11 0000-0000",
        routes: ["Route A", "Route B"],
      });

      service.createAd(company.id, "pkg-starter", {
        title: "Ad 1",
        description: "Description 1",
        imageUrl: "https://example.com/ad1.jpg",
        ctaText: "Click",
        ctaUrl: "https://example.com",
        targetRoutes: ["Route A"],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      });

      service.createAd(company.id, "pkg-starter", {
        title: "Ad 2",
        description: "Description 2",
        imageUrl: "https://example.com/ad2.jpg",
        ctaText: "Click",
        ctaUrl: "https://example.com",
        targetRoutes: ["Route B"],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      });

      const ads = service.getCompanyAds(company.id);
      expect(ads.length).toBe(2);
    });
  });

  describe("Performance Tracking", () => {
    it("should record ad impressions", () => {
      const company = service.registerCompany({
        name: "Test Company",
        cnpj: "00.000.000/0000-00",
        email: "test@test.com",
        phone: "+55 11 0000-0000",
        routes: ["Route A"],
      });

      const ad = service.createAd(company.id, "pkg-starter", {
        title: "Test Ad",
        description: "Test Description",
        imageUrl: "https://example.com/ad.jpg",
        ctaText: "Click",
        ctaUrl: "https://example.com",
        targetRoutes: ["Route A"],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      });

      service.recordImpression(ad.id);
      service.recordImpression(ad.id);

      const ads = service.getCompanyAds(company.id);
      expect(ads[0].impressions).toBe(2);
    });

    it("should record ad clicks", () => {
      const company = service.registerCompany({
        name: "Test Company",
        cnpj: "00.000.000/0000-00",
        email: "test@test.com",
        phone: "+55 11 0000-0000",
        routes: ["Route A"],
      });

      const ad = service.createAd(company.id, "pkg-starter", {
        title: "Test Ad",
        description: "Test Description",
        imageUrl: "https://example.com/ad.jpg",
        ctaText: "Click",
        ctaUrl: "https://example.com",
        targetRoutes: ["Route A"],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      });

      service.recordClick(ad.id);
      service.recordClick(ad.id);

      const ads = service.getCompanyAds(company.id);
      expect(ads[0].clicks).toBe(2);
    });

    it("should calculate CTR and conversion rate", () => {
      const company = service.registerCompany({
        name: "Test Company",
        cnpj: "00.000.000/0000-00",
        email: "test@test.com",
        phone: "+55 11 0000-0000",
        routes: ["Route A"],
      });

      const ad = service.createAd(company.id, "pkg-starter", {
        title: "Test Ad",
        description: "Test Description",
        imageUrl: "https://example.com/ad.jpg",
        ctaText: "Click",
        ctaUrl: "https://example.com",
        targetRoutes: ["Route A"],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      });

      // 100 impressions, 10 clicks, 2 conversions
      for (let i = 0; i < 100; i++) {
        service.recordImpression(ad.id);
      }
      for (let i = 0; i < 10; i++) {
        service.recordClick(ad.id);
      }
      for (let i = 0; i < 2; i++) {
        service.recordConversion(ad.id);
      }

      const performance = service.getAdPerformance(ad.id);
      expect(performance.ctr).toBe(10); // 10%
      expect(performance.conversionRate).toBe(20); // 20%
    });
  });

  describe("Revenue Calculation", () => {
    it("should calculate company revenue", () => {
      const company = service.registerCompany({
        name: "Test Company",
        cnpj: "00.000.000/0000-00",
        email: "test@test.com",
        phone: "+55 11 0000-0000",
        routes: ["Route A"],
      });

      const ad = service.createAd(company.id, "pkg-starter", {
        title: "Test Ad",
        description: "Test Description",
        imageUrl: "https://example.com/ad.jpg",
        ctaText: "Click",
        ctaUrl: "https://example.com",
        targetRoutes: ["Route A"],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      });

      // 1000 impressions = R$ 50 revenue (CPM of R$ 50)
      for (let i = 0; i < 1000; i++) {
        service.recordImpression(ad.id);
      }

      const revenue = service.calculateCompanyRevenue(company.id);
      expect(revenue).toBe(50);
    });
  });

  describe("Ad Management", () => {
    it("should pause and resume ads", () => {
      const company = service.registerCompany({
        name: "Test Company",
        cnpj: "00.000.000/0000-00",
        email: "test@test.com",
        phone: "+55 11 0000-0000",
        routes: ["Route A"],
      });

      const ad = service.createAd(company.id, "pkg-starter", {
        title: "Test Ad",
        description: "Test Description",
        imageUrl: "https://example.com/ad.jpg",
        ctaText: "Click",
        ctaUrl: "https://example.com",
        targetRoutes: ["Route A"],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      });

      service.pauseAd(ad.id);
      let ads = service.getCompanyAds(company.id);
      expect(ads[0].status).toBe("paused");

      service.resumeAd(ad.id);
      ads = service.getCompanyAds(company.id);
      expect(ads[0].status).toBe("active");
    });
  });

  describe("Reporting", () => {
    it("should generate monthly report", () => {
      const company = service.registerCompany({
        name: "Test Company",
        cnpj: "00.000.000/0000-00",
        email: "test@test.com",
        phone: "+55 11 0000-0000",
        routes: ["Route A"],
      });

      const ad = service.createAd(company.id, "pkg-starter", {
        title: "Test Ad",
        description: "Test Description",
        imageUrl: "https://example.com/ad.jpg",
        ctaText: "Click",
        ctaUrl: "https://example.com",
        targetRoutes: ["Route A"],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      });

      for (let i = 0; i < 1000; i++) {
        service.recordImpression(ad.id);
      }
      for (let i = 0; i < 50; i++) {
        service.recordClick(ad.id);
      }

      const report = service.generateMonthlyReport(company.id);
      expect(report.totalImpressions).toBe(1000);
      expect(report.totalClicks).toBe(50);
      expect(report.averageCTR).toBe(5);
      expect(report.estimatedRevenue).toBe(50);
    });
  });
});
