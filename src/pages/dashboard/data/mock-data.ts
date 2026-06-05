import {
  AlertTriangle,
  Briefcase,
  Star,
  Users,
  Building,
  ShieldAlert,
} from "lucide-react";

export const COLORS = ['#003d79', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const generateData = (
  count: number,
  min: number,
  max: number,
  type: "good" | "bad" | "mixed" = "good",
) => {
  return Array.from({ length: count }).map(() => {
    let isHighlighted = false;

    if (type === "mixed") {
      isHighlighted = Math.random() > 0.8;
    } else if (type === "bad") {
      isHighlighted = true;
    }

    return {
      type,
      value: Math.floor(Math.random() * (max - min + 1)) + min,
      isHighlighted,
    };
  });
};

export const METRICS = [
  {
    id: "total-assets",
    title: "Total Assets",
    value: "Rp 2,134 T",
    subtitle: "Up 12.4% YoY",
    icon: Briefcase,
    data: generateData(30, 20, 100, "good"),
    layoutId: "card-assets",
    isBad: false,
    color: "#003d79",
  },
  {
    id: "priority-customers",
    title: "Nasabah Prioritas",
    value: "142,501",
    subtitle: "Up 4.2% MoM",
    icon: Star,
    data: generateData(30, 10, 80, "good"),
    layoutId: "card-priority",
    isBad: false,
    color: "#10b981",
  },
  {
    id: "regular-customers",
    title: "Nasabah Biasa",
    value: "31.2 M",
    subtitle: "Up 8.1% YoY",
    icon: Users,
    data: generateData(30, 40, 90, "good"),
    layoutId: "card-regular",
    isBad: false,
    color: "#f59e0b",
  },
  {
    id: "wholesale-loans",
    title: "Wholesale Loans",
    value: "Rp 842 T",
    subtitle: "Up 15.2% YoY",
    icon: Building,
    data: generateData(30, 30, 100, "good"),
    layoutId: "card-wholesale",
    isBad: false,
    color: "#8b5cf6",
  },
  {
    id: "npl",
    title: "Non-Performing Loans",
    value: "1.24%",
    subtitle: "Down 0.1% YoY",
    icon: AlertTriangle,
    data: generateData(30, 10, 60, "bad"),
    layoutId: "card-npl",
    isBad: true,
    color: "#ef4444",
  },
  {
    id: "fraud-alerts",
    title: "Fraud Alerts",
    value: "342",
    subtitle: "Resolved 98%",
    icon: ShieldAlert,
    data: generateData(30, 5, 40, "bad"),
    layoutId: "card-fraud",
    isBad: true,
    color: "#f97316",
  },
];

export const DETAIL_MOCK_DATA: Record<string, any> = {
  "total-assets": {
    tabs: ["Asset Composition", "Yield Analysis", "Growth Trend"],
    composition: [
      { name: "Corporate Loans", value: 800 },
      { name: "Govt Bonds", value: 600 },
      { name: "Retail Loans", value: 400 },
      { name: "Cash & Placements", value: 334 },
    ],
    yield: [
      { name: "Q1", rate: 5.2 },
      { name: "Q2", rate: 5.4 },
      { name: "Q3", rate: 5.6 },
      { name: "Q4", rate: 5.9 },
    ],
    growth: [
      { year: "2020", actual: 1500, target: 1450 },
      { year: "2021", actual: 1650, target: 1600 },
      { year: "2022", actual: 1800, target: 1850 },
      { year: "2023", actual: 2000, target: 1950 },
      { year: "2024", actual: 2134, target: 2100 },
    ],
    yoyGrowth: [
      { quarter: "Q1", y2023: 1950, y2024: 2010 },
      { quarter: "Q2", y2023: 1980, y2024: 2050 },
      { quarter: "Q3", y2023: 2000, y2024: 2080 },
      { quarter: "Q4", y2023: 2000, y2024: 2134 },
    ],
    currencyComposition: [
      { category: "Loans", idr: 1000, valas: 200 },
      { category: "Bonds", idr: 500, valas: 100 },
      { category: "Placements", idr: 250, valas: 84 },
    ]
  },
  "priority-customers": {
    tabs: ["AUM Tiers", "Demographics", "Net Flow"],
    aum: [
      { tier: "500M - 1B", customers: 85000 },
      { tier: "1B - 5B", customers: 45000 },
      { tier: "> 5B", customers: 12501 },
    ],
    demographics: [
      { name: "25-35", value: 15 },
      { name: "36-45", value: 35 },
      { name: "46-55", value: 30 },
      { name: "55+", value: 20 },
    ],
    flow: [
      { month: "Jan", onboarded: 1200, churned: 300 },
      { month: "Feb", onboarded: 1500, churned: 250 },
      { month: "Mar", onboarded: 1100, churned: 400 },
      { month: "Apr", onboarded: 1800, churned: 350 },
    ],
    acquisition: [
      { month: "Jan", target: 1000, actual: 1200 },
      { month: "Feb", target: 1100, actual: 1500 },
      { month: "Mar", target: 1200, actual: 1100 },
      { month: "Apr", target: 1300, actual: 1800 },
      { month: "May", target: 1400, actual: 1600 },
    ],
    regionalAum: [
      { region: "Jakarta", tier1: 45000, tier2: 25000 },
      { region: "Jabar", tier1: 25000, tier2: 15000 },
      { region: "Jatim", tier1: 20000, tier2: 12000 },
      { region: "Sumatra", tier1: 15000, tier2: 8000 },
      { region: "Bali", tier1: 10000, tier2: 5000 },
    ]
  },
  "regular-customers": {
    tabs: ["Digital Adoption", "Transaction Volume"],
    adoption: [
      { month: "Jan", mau: 20, dormant: 11 },
      { month: "Feb", mau: 22, dormant: 10 },
      { month: "Mar", mau: 25, dormant: 9 },
      { month: "Apr", mau: 28, dormant: 7 },
    ],
    transactions: [
      { type: "Transfer", vol: 800 },
      { type: "QRIS", vol: 450 },
      { type: "Top-up", vol: 350 },
      { type: "Payment", vol: 200 },
    ],
    appUsage: [
      { month: "Jan", livin: 18, kopra: 1.2 },
      { month: "Feb", livin: 20, kopra: 1.3 },
      { month: "Mar", livin: 22, kopra: 1.5 },
      { month: "Apr", livin: 25, kopra: 1.8 },
      { month: "May", livin: 28, kopra: 2.1 },
    ],
    channelVolume: [
      { channel: "Livin", financial: 1200, nonFinancial: 800 },
      { channel: "ATM", financial: 400, nonFinancial: 150 },
      { channel: "Branch", financial: 100, nonFinancial: 50 },
    ]
  },
  "wholesale-loans": {
    tabs: ["Sector Exposure", "Top Borrowers", "Maturity Profile"],
    exposure: [
      { sector: "Infrastructure", amount: 300 },
      { sector: "Manufacturing", amount: 250 },
      { sector: "Energy", amount: 180 },
      { sector: "Plantation", amount: 112 },
    ],
    topBorrowers: [
      { name: "PT Adhi Karya", limit: 50, utilized: 45, rating: "AAA" },
      { name: "PT Pertamina", limit: 120, utilized: 100, rating: "AAA" },
      { name: "PT PLN", limit: 150, utilized: 140, rating: "AAA" },
      { name: "PT Waskita", limit: 40, utilized: 38, rating: "BBB" },
      { name: "PT Telkom", limit: 80, utilized: 50, rating: "AAA" },
    ],
    maturity: [
      { term: "< 1 Year", amount: 150 },
      { term: "1-3 Years", amount: 450 },
      { term: "> 3 Years", amount: 242 },
    ],
    loanFlow: [
      { sector: "Infrastruktur", new: 85, repaid: 40 },
      { sector: "Manufaktur", new: 60, repaid: 55 },
      { sector: "Energi", new: 45, repaid: 30 },
      { sector: "Perkebunan", new: 25, repaid: 35 },
    ],
    loanType: [
      { sector: "Infrastruktur", kmk: 100, ki: 200 },
      { sector: "Manufaktur", kmk: 150, ki: 100 },
      { sector: "Energi", kmk: 80, ki: 100 },
      { sector: "Perkebunan", kmk: 72, ki: 40 },
    ]
  },
  "npl": {
    tabs: ["NPL by Segment", "Vintage Analysis", "Recovery Status"],
    segment: [
      { name: "Commercial", rate: 2.1 },
      { name: "Consumer", rate: 1.8 },
      { name: "SME", rate: 1.5 },
      { name: "Micro", rate: 1.2 },
      { name: "Corporate", rate: 0.8 },
    ],
    vintage: [
      { year: "2020", defaultRate: 2.5 },
      { year: "2021", defaultRate: 1.8 },
      { year: "2022", defaultRate: 1.4 },
      { year: "2023", defaultRate: 1.1 },
      { year: "2024", defaultRate: 0.5 },
    ],
    recovery: [
      { id: "L-9021", status: "Restructured", amount: "Rp 50B", date: "2024-05-12" },
      { id: "L-3321", status: "Liquidated", amount: "Rp 12B", date: "2024-05-10" },
      { id: "L-8842", status: "In Collection", amount: "Rp 5B", date: "2024-05-08" },
      { id: "L-1102", status: "Written-off", amount: "Rp 20B", date: "2024-05-01" },
    ],
    nplTrend: [
      { quarter: "Q1", balance: 24.5, ratio: 1.35 },
      { quarter: "Q2", balance: 23.8, ratio: 1.30 },
      { quarter: "Q3", balance: 23.1, ratio: 1.28 },
      { quarter: "Q4", balance: 22.4, ratio: 1.24 },
    ],
    nplMovement: [
      { segment: "Commercial", downgrade: 4.2, recovery: 5.1 },
      { segment: "Consumer", downgrade: 3.5, recovery: 3.8 },
      { segment: "SME", downgrade: 2.1, recovery: 2.4 },
      { segment: "Micro", downgrade: 1.5, recovery: 1.8 },
      { segment: "Corporate", downgrade: 0.8, recovery: 1.2 },
    ]
  },
  "fraud-alerts": {
    tabs: ["Fraud Typology", "Geographic Hotspots", "Resolution SLA"],
    typology: [
      { name: "Phishing", value: 45 },
      { name: "Card Skimming", value: 25 },
      { name: "Account Takeover", value: 20 },
      { name: "Internal", value: 10 },
    ],
    hotspots: [
      { region: "Jabodetabek", alerts: 150 },
      { region: "West Java", alerts: 80 },
      { region: "East Java", alerts: 60 },
      { region: "Sumatra", alerts: 30 },
      { region: "Bali", alerts: 22 },
    ],
    sla: [
      { week: "W1", actual: 4.5, target: 5 },
      { week: "W2", actual: 4.2, target: 5 },
      { week: "W3", actual: 5.5, target: 5 },
      { week: "W4", actual: 3.8, target: 5 },
    ],
    fraudResolution: [
      { month: "Jan", reported: 120, prevented: 110 },
      { month: "Feb", reported: 150, prevented: 142 },
      { month: "Mar", reported: 90, prevented: 85 },
      { month: "Apr", reported: 180, prevented: 175 },
    ],
    fraudImpact: [
      { type: "Phishing", potential: 50, actual: 5 },
      { type: "Card Skim", potential: 30, actual: 12 },
      { type: "Takeover", potential: 80, actual: 15 },
      { type: "Internal", potential: 20, actual: 2 },
    ]
  }
};

// Generic Deep Detail Data for Drill-down
export const DEEP_DETAIL_MOCK_DATA = {
  historicalTrend: [
    { month: "Jan", metric_a: 120, metric_b: 80 },
    { month: "Feb", metric_a: 135, metric_b: 85 },
    { month: "Mar", metric_a: 140, metric_b: 95 },
    { month: "Apr", metric_a: 155, metric_b: 100 },
    { month: "May", metric_a: 170, metric_b: 110 },
    { month: "Jun", metric_a: 185, metric_b: 125 },
  ],
  regionalBreakdown: [
    { region: "Jakarta", value: 45 },
    { region: "West Java", value: 30 },
    { region: "East Java", value: 25 },
    { region: "Sumatra", value: 15 },
    { region: "Bali/Nusa", value: 10 },
    { region: "Kalimantan", value: 8 },
    { region: "Sulawesi", value: 5 },
  ],
  tableData: [
    { id: "TRX-001", date: "2024-05-10", category: "Corporate", amount: "Rp 12.5B", status: "Completed" },
    { id: "TRX-002", date: "2024-05-11", category: "SME", amount: "Rp 2.1B", status: "Pending" },
    { id: "TRX-003", date: "2024-05-12", category: "Retail", amount: "Rp 0.8B", status: "Completed" },
    { id: "TRX-004", date: "2024-05-13", category: "Government", amount: "Rp 45.0B", status: "Processed" },
    { id: "TRX-005", date: "2024-05-14", category: "Corporate", amount: "Rp 8.2B", status: "Pending" },
    { id: "TRX-006", date: "2024-05-15", category: "Retail", amount: "Rp 1.1B", status: "Failed" },
    { id: "TRX-007", date: "2024-05-16", category: "SME", amount: "Rp 3.4B", status: "Completed" },
  ]
};
