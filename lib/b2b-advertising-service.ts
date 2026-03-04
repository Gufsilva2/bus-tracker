/**
 * B2B Advertising Service
 * Manages advertising packages for bus companies and transportation providers
 * 
 * Features:
 * - Premium ad packages for bus companies
 * - Contextual ads based on user routes
 * - Performance tracking and ROI calculation
 * - Payment integration for B2B clients
 */

export interface BusCompany {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  website?: string;
  logo?: string;
  routes: string[];
  createdAt: string;
}

export interface AdvertisingPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // days
  impressions: number; // guaranteed impressions
  features: string[];
  adTypes: ("banner" | "interstitial" | "featured")[];
}

export interface CompanyAd {
  id: string;
  companyId: string;
  packageId: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  targetRoutes: string[]; // Show ads only for these routes
  startDate: string;
  endDate: string;
  status: "active" | "paused" | "expired";
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface AdPerformance {
  adId: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number; // Click-through rate
  conversionRate: number;
  revenue: number;
}

/**
 * Predefined advertising packages for bus companies
 */
export const ADVERTISING_PACKAGES: AdvertisingPackage[] = [
  {
    id: "pkg-starter",
    name: "Pacote Iniciante",
    description: "Perfeito para pequenas transportadoras",
    price: 299,
    currency: "BRL",
    duration: 30,
    impressions: 10000,
    features: [
      "Anúncios em banner",
      "Segmentação por rota",
      "Relatório básico",
      "Suporte por email",
    ],
    adTypes: ["banner"],
  },
  {
    id: "pkg-professional",
    name: "Pacote Profissional",
    description: "Para transportadoras em crescimento",
    price: 799,
    currency: "BRL",
    duration: 30,
    impressions: 50000,
    features: [
      "Anúncios em banner e intersticiais",
      "Segmentação avançada",
      "Relatório detalhado",
      "Suporte prioritário",
      "API de integração",
    ],
    adTypes: ["banner", "interstitial"],
  },
  {
    id: "pkg-premium",
    name: "Pacote Premium",
    description: "Para grandes operadoras",
    price: 1999,
    currency: "BRL",
    duration: 30,
    impressions: 200000,
    features: [
      "Todos os tipos de anúncios",
      "Segmentação ultra-avançada",
      "Relatório em tempo real",
      "Suporte 24/7",
      "API completa",
      "Gerente de conta dedicado",
      "A/B testing",
    ],
    adTypes: ["banner", "interstitial", "featured"],
  },
];

export class B2BAdvertisingService {
  private companies: BusCompany[] = [];
  private ads: CompanyAd[] = [];
  private performance: AdPerformance[] = [];

  /**
   * Register a new bus company
   */
  registerCompany(company: Omit<BusCompany, "id" | "createdAt">): BusCompany {
    const newCompany: BusCompany = {
      ...company,
      id: `company-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    this.companies.push(newCompany);
    return newCompany;
  }

  /**
   * Get company by ID
   */
  getCompany(companyId: string): BusCompany | undefined {
    return this.companies.find((c) => c.id === companyId);
  }

  /**
   * Get all companies
   */
  getAllCompanies(): BusCompany[] {
    return [...this.companies];
  }

  /**
   * Create ad for a company
   */
  createAd(
    companyId: string,
    packageId: string,
    adData: Omit<CompanyAd, "id" | "impressions" | "clicks" | "conversions" | "companyId" | "packageId">
  ): CompanyAd {
    const pkg = ADVERTISING_PACKAGES.find((p) => p.id === packageId);
    if (!pkg) throw new Error("Package not found");

    const newAd: CompanyAd = {
      ...adData,
      id: `ad-${Date.now()}`,
      companyId,
      packageId,
      impressions: 0,
      clicks: 0,
      conversions: 0,
    };

    this.ads.push(newAd);
    return newAd;
  }

  /**
   * Get ads for a specific route (for displaying to users)
   */
  getAdsForRoute(route: string): CompanyAd[] {
    return this.ads.filter(
      (ad) =>
        ad.status === "active" &&
        ad.targetRoutes.includes(route) &&
        new Date(ad.endDate) > new Date()
    );
  }

  /**
   * Record ad impression
   */
  recordImpression(adId: string): void {
    const ad = this.ads.find((a) => a.id === adId);
    if (ad) {
      ad.impressions++;
    }
  }

  /**
   * Record ad click
   */
  recordClick(adId: string): void {
    const ad = this.ads.find((a) => a.id === adId);
    if (ad) {
      ad.clicks++;
    }
  }

  /**
   * Record ad conversion (e.g., user booked a ticket)
   */
  recordConversion(adId: string): void {
    const ad = this.ads.find((a) => a.id === adId);
    if (ad) {
      ad.conversions++;
    }
  }

  /**
   * Get performance metrics for an ad
   */
  getAdPerformance(adId: string): {
    ctr: number;
    conversionRate: number;
    estimatedRevenue: number;
  } {
    const ad = this.ads.find((a) => a.id === adId);
    if (!ad) throw new Error("Ad not found");

    const ctr = ad.impressions > 0 ? (ad.clicks / ad.impressions) * 100 : 0;
    const conversionRate =
      ad.clicks > 0 ? (ad.conversions / ad.clicks) * 100 : 0;

    // Estimate revenue based on impressions
    // Assuming CPM of R$ 50 (R$ 0.05 per impression)
    const estimatedRevenue = (ad.impressions / 1000) * 50;

    return { ctr, conversionRate, estimatedRevenue };
  }

  /**
   * Get all ads for a company
   */
  getCompanyAds(companyId: string): CompanyAd[] {
    return this.ads.filter((a) => a.companyId === companyId);
  }

  /**
   * Calculate total revenue for a company
   */
  calculateCompanyRevenue(companyId: string): number {
    const companyAds = this.getCompanyAds(companyId);
    return companyAds.reduce((total, ad) => {
      const revenue = (ad.impressions / 1000) * 50; // CPM of R$ 50
      return total + revenue;
    }, 0);
  }

  /**
   * Get advertising packages
   */
  getPackages(): AdvertisingPackage[] {
    return [...ADVERTISING_PACKAGES];
  }

  /**
   * Get package by ID
   */
  getPackage(packageId: string): AdvertisingPackage | undefined {
    return ADVERTISING_PACKAGES.find((p) => p.id === packageId);
  }

  /**
   * Pause an ad
   */
  pauseAd(adId: string): void {
    const ad = this.ads.find((a) => a.id === adId);
    if (ad) {
      ad.status = "paused";
    }
  }

  /**
   * Resume an ad
   */
  resumeAd(adId: string): void {
    const ad = this.ads.find((a) => a.id === adId);
    if (ad) {
      ad.status = "active";
    }
  }

  /**
   * Get top performing ads
   */
  getTopPerformingAds(limit: number = 5): CompanyAd[] {
    return [...this.ads]
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);
  }

  /**
   * Get ads expiring soon (within 7 days)
   */
  getExpiringAds(): CompanyAd[] {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    return this.ads.filter(
      (ad) =>
        ad.status === "active" &&
        new Date(ad.endDate) <= sevenDaysFromNow &&
        new Date(ad.endDate) > new Date()
    );
  }

  /**
   * Generate monthly report for a company
   */
  generateMonthlyReport(companyId: string): {
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    averageCTR: number;
    estimatedRevenue: number;
    topAd: CompanyAd | null;
  } {
    const companyAds = this.getCompanyAds(companyId);

    const totalImpressions = companyAds.reduce((sum, ad) => sum + ad.impressions, 0);
    const totalClicks = companyAds.reduce((sum, ad) => sum + ad.clicks, 0);
    const totalConversions = companyAds.reduce((sum, ad) => sum + ad.conversions, 0);

    const averageCTR =
      totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const estimatedRevenue = (totalImpressions / 1000) * 50;

    const topAd =
      companyAds.length > 0
        ? companyAds.reduce((top, ad) =>
            ad.clicks > top.clicks ? ad : top
          )
        : null;

    return {
      totalImpressions,
      totalClicks,
      totalConversions,
      averageCTR,
      estimatedRevenue,
      topAd,
    };
  }
}

/**
 * Export singleton instance
 */
export const b2bAdvertisingService = new B2BAdvertisingService();
