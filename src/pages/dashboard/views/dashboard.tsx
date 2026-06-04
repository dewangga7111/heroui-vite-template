import { useState } from "react";
import {
  AlertTriangle,
  Briefcase,
  Star,
  Users,
  Building,
  ShieldAlert,
  ArrowLeft,
  Activity,
  Zap,
  Send,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import {
  BarChart, Bar, ResponsiveContainer, Cell,
  PieChart, Pie, Sector, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@heroui/react";

const COLORS = ['#003d79', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// --- Mock Data ---
const generateData = (
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

const METRICS = [
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

const DETAIL_MOCK_DATA = {
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

// --- Components ---

const ZoomedBar = (props: any) => {
  const { x, y, width, height, fill, radius } = props;
  const r = Array.isArray(radius) ? radius[0] : (radius ?? 4);
  return (
    <motion.rect
      x={x - 1}
      width={width + 2}
      rx={r}
      ry={r}
      fill={fill}
      initial={{ y: y, height: height, filter: `drop-shadow(0px 0px 0px ${fill}00)` }}
      animate={{ y: y - 6, height: height + 6, width: width + 4, filter: `drop-shadow(0px 4px 8px ${fill}bb) drop-shadow(0px 0px 4px ${fill}77)` }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    />
  );
};

const GlowPieSlice = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius - 2}
      outerRadius={outerRadius + 10}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      style={{ filter: `drop-shadow(0px 4px 14px ${fill}bb) drop-shadow(0px 0px 6px ${fill}77)`, transition: "all 0.2s ease" }}
    />
  );
};

const GlowDot = (props: any) => {
  const { cx, cy, stroke } = props;
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      fill={stroke}
      initial={{ r: 4, filter: `drop-shadow(0px 0px 0px ${stroke}00)` }}
      animate={{ r: 7, filter: `drop-shadow(0px 0px 10px ${stroke}cc) drop-shadow(0px 0px 4px ${stroke}88)` }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    />
  );
};

const Sparkline = ({
  data,
  color = "#003d79",
  dangerColor = "#ef4444",
}: {
  data: any[];
  color?: string;
  dangerColor?: string;
}) => {
  return (
    <div className="h-[120px] w-full mt-6">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart barGap={2} data={data}>
          <Bar dataKey="value" radius={[4, 4, 4, 4]}>
            {data.map((entry, index) => {
              const isBad =
                entry.type === "bad" ||
                (entry.type === "mixed" && entry.isHighlighted);
              const barColor = isBad ? dangerColor : color;
              const opacity = entry.type === "good"
                ? 0.3 + (entry.value / 100) * 0.7
                : entry.isHighlighted ? 1 : 0.25;

              return (
                <Cell key={`cell-${index}`} fill={barColor} opacity={opacity} />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const ArrowUpRight = ({ size = 24 }: { size?: number }) => (
  <svg
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={size}
  >
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const MetricCard = ({
  title,
  value,
  subtitle,
  data,
  icon: Icon,
  delay = 0,
  className = "",
  layoutId,
  onClick,
  isBad,
  color,
}: any) => {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-[#1a1c23] rounded-[2rem] p-6 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-lg dark:hover:shadow-none transition-shadow border border-transparent dark:border-white/10 hover:border-blue-100 dark:hover:border-blue-500/40 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      layoutId={layoutId}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
    >
      <div>
        <div className="flex justify-between items-center mb-2 text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 text-sm font-medium">
            {Icon && <Icon size={16} />}
            {title}
          </div>
          <button className="text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-300 transition-colors">
            <ArrowUpRight size={18} />
          </button>
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 mb-4">{subtitle}</div>

        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl font-light text-slate-800 dark:text-white">{value}</h2>
          <div
            className={`w-2 h-2 rounded-full ${isBad ? "bg-red-500" : "bg-green-500"}`}
          />
        </div>
      </div>

      {data && <Sparkline color={color} dangerColor={color} data={data} />}
    </motion.div>
  );
};

const ExpandedDetailCard = ({
  metric,
  onBack,
}: {
  metric: any;
  onBack: () => void;
}) => {
  const detailData = DETAIL_MOCK_DATA[metric.id as keyof typeof DETAIL_MOCK_DATA];

  const renderMetricContent = () => {
    const gridClass = "grid grid-cols-1 lg:grid-cols-2 gap-8";
    const cardClass = "bg-white dark:bg-[#111318] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col w-full";
    const fullWidthCardClass = "bg-white dark:bg-[#111318] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col w-full lg:col-span-2";
    const chartContainerClass = "h-72 w-full mt-4";

    switch (metric.id) {
      case "total-assets":
        return (
          <div className={gridClass}>
            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Composition</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={detailData.composition} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" nameKey="name" activeShape={(props: any) => <GlowPieSlice {...props} />}>
                      {detailData.composition.map((entry: any, index: number) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip cursor={false} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Quarterly Yield Rate (%)</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.yield}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Bar dataKey="rate" fill="#10b981" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={fullWidthCardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">5-Year Growth vs Target</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={detailData.growth}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Legend />
                    <Line type="monotone" dataKey="actual" name="Actual Assets (T)" stroke="#003d79" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="target" name="Target (T)" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">YoY Growth (2023 vs 2024)</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.yoyGrowth}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                    <Tooltip cursor={false} />
                    <Legend />
                    <Bar dataKey="y2023" name="2023" fill="#94a3b8" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                    <Bar dataKey="y2024" name="2024" fill="#003d79" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Currency Composition by Asset</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.currencyComposition} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="category" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip cursor={false} />
                    <Legend />
                    <Bar dataKey="idr" name="IDR (Trillion)" stackId="a" fill="#10b981" />
                    <Bar dataKey="valas" name="Valas (Trillion)" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "priority-customers":
        return (
          <div className={gridClass}>
            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Customers by AUM Tier</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.aum} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="tier" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip cursor={false} />
                    <Bar dataKey="customers" fill="#f59e0b" radius={[0, 4, 4, 0]} activeBar={<ZoomedBar />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Age Demographics (%)</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={detailData.demographics} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" nameKey="name" activeShape={(props: any) => <GlowPieSlice {...props} />}>
                      {detailData.demographics.map((entry: any, index: number) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip cursor={false} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={fullWidthCardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Customer Onboarding vs Churn</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={detailData.flow}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Legend />
                    <Area type="monotone" dataKey="onboarded" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} activeDot={<GlowDot />} />
                    <Area type="monotone" dataKey="churned" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} activeDot={<GlowDot />} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Monthly Acquisition Target vs Actual</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={detailData.acquisition}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Legend />
                    <Line type="monotone" dataKey="actual" name="Actual" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="target" name="Target" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Regional AUM Distribution</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.regionalAum}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="region" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Legend />
                    <Bar dataKey="tier1" name="500M - 1B" fill="#f59e0b" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                    <Bar dataKey="tier2" name="> 1B" fill="#003d79" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "regular-customers":
        return (
          <div className={gridClass}>
            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Livin' App Adoption (Millions)</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={detailData.adoption}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Legend />
                    <Area type="monotone" dataKey="mau" name="Monthly Active Users" stroke="#003d79" fill="#003d79" fillOpacity={0.3} activeDot={<GlowDot />} />
                    <Area type="monotone" dataKey="dormant" name="Dormant" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} activeDot={<GlowDot />} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Daily Volume by Type (Millions)</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.transactions}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="type" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Bar dataKey="vol" fill="#8b5cf6" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Livin vs Kopra Usage (Millions)</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={detailData.appUsage}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Legend />
                    <Line type="monotone" dataKey="livin" name="Livin'" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="kopra" name="Kopra" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Channel Volume: Fin vs Non-Fin</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.channelVolume}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="channel" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Legend />
                    <Bar dataKey="financial" name="Financial" fill="#8b5cf6" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                    <Bar dataKey="nonFinancial" name="Non-Financial" fill="#f472b6" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "wholesale-loans":
        return (
          <div className={gridClass}>
            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Exposure by Sector (Trillion Rp)</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.exposure}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="sector" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Bar dataKey="amount" fill="#003d79" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Loan Maturity Timeline (Trillion Rp)</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.maturity} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="term" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip cursor={false} />
                    <Bar dataKey="amount" fill="#6366f1" radius={[0, 4, 4, 0]} activeBar={<ZoomedBar />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">New Disbursals vs Repayments</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.loanFlow}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="sector" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Legend />
                    <Bar dataKey="new" name="Disbursals" fill="#10b981" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                    <Bar dataKey="repaid" name="Repayments" fill="#ef4444" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Loan Type (KMK vs KI)</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.loanType}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="sector" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Legend />
                    <Bar dataKey="kmk" name="Modal Kerja (KMK)" stackId="a" fill="#003d79" />
                    <Bar dataKey="ki" name="Investasi (KI)" stackId="a" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={fullWidthCardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-4">Top 5 Corporate Borrowers</h4>
              <div className="overflow-x-auto text-sm w-full">
                <table className="w-full text-left min-w-[400px]">
                  <thead className="text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="pb-3 font-medium">Borrower Group</th>
                      <th className="pb-3 font-medium">Internal Rating</th>
                      <th className="pb-3 font-medium">Usage %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailData.topBorrowers.map((item: any, i: number) => (
                      <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-[#1a1c23] transition-colors">
                        <td className="py-4 text-slate-700 dark:text-slate-200 font-medium">{item.name}</td>
                        <td className="py-4"><span className="px-2 py-1 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded text-xs font-semibold">{item.rating}</span></td>
                        <td className="py-4 text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                              <div className="bg-blue-600 h-full" style={{ width: `${item.utilization}%` }} />
                            </div>
                            <span>{item.utilization}%</span>
                          </div>
                        </td>
                        <td className="py-4 text-slate-700 dark:text-slate-200">{item.exposure}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "npl":
        return (
          <div className={gridClass}>
            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">NPL Ratio by Segment (%)</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.segment}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Bar dataKey="rate" fill="#ef4444" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Default Rate by Vintage Year (%)</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={detailData.vintage}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Line type="monotone" dataKey="defaultRate" name="Default Rate (%)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">NPL Balance vs Ratio</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.nplTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 3]} />
                    <Tooltip cursor={false} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="balance" name="Balance (Trillion)" fill="#f87171" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                    <Line yAxisId="right" type="monotone" dataKey="ratio" name="Ratio (%)" stroke="#b91c1c" strokeWidth={3} dot={{ r: 4 }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">NPL Downgrades vs Recoveries</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.nplMovement}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="segment" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Legend />
                    <Bar dataKey="downgrade" name="New NPL" fill="#ef4444" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                    <Bar dataKey="recovery" name="Recovered" fill="#10b981" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={fullWidthCardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-4">Active Recovery Efforts</h4>
              <div className="overflow-x-auto text-sm w-full">
                <table className="w-full text-left min-w-[350px]">
                  <thead className="text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="pb-3 font-medium">Loan ID</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailData.recovery.map((item: any, i: number) => (
                      <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-[#1a1c23] transition-colors">
                        <td className="py-4 text-slate-700 dark:text-slate-200 font-medium">{item.id}</td>
                        <td className="py-4 text-slate-600 dark:text-slate-400">{item.amount}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${item.status === 'Restructured' ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' :
                            item.status === 'Liquidated' ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400' :
                              item.status === 'In Collection' ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                                'bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200'
                            }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 text-slate-700 dark:text-slate-200">{item.progress}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "fraud-alerts":
        return (
          <div className={gridClass}>
            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Incidents by Type</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={detailData.typology} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" label activeShape={(props: any) => <GlowPieSlice {...props} />}>
                      {detailData.typology.map((entry: any, index: number) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip cursor={false} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Incidents by Region</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.hotspots}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="region" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Bar dataKey="alerts" fill="#ef4444" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={fullWidthCardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Resolution Time vs SLA Target (Days)</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={detailData.sla}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Legend />
                    <Line type="monotone" dataKey="actual" name="Avg Resolution (Days)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="target" name="SLA Target" stroke="#10b981" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Reported vs Prevented</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.fraudResolution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Legend />
                    <Bar dataKey="reported" name="Reported" fill="#ef4444" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                    <Bar dataKey="prevented" name="Prevented" fill="#10b981" radius={[4, 4, 0, 0]} activeBar={<ZoomedBar />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Potential vs Actual Loss (Billion Rp)</h4>
              <div className={chartContainerClass}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.fraudImpact}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="type" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} />
                    <Legend />
                    <Bar dataKey="potential" name="Potential Loss" stackId="a" fill="#f87171" />
                    <Bar dataKey="actual" name="Actual Loss" stackId="a" fill="#991b1b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
    }

    return (
      <div className="flex-1 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm bg-slate-50 h-64">
        Coming Soon
      </div>
    );
  };

  return (
    <motion.div
      layoutId={metric.layoutId}
      className="w-full bg-white dark:bg-[#111318] rounded-[2.5rem] p-6 lg:p-10 flex flex-col shadow-sm flex-1 min-h-[800px] z-50 relative"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-6">
          <button
            className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 shrink-0"
            onClick={onBack}
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-1">
              <metric.icon size={20} />
              <span className="font-medium text-lg">{metric.title}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl lg:text-5xl font-light text-slate-800 dark:text-white">
                {metric.value}
              </h2>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-md ${metric.isBad ? "text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400" : "text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400"}`}
              >
                {metric.subtitle}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Hero Chart */}
      <div className="h-64 lg:h-80 w-full mb-8">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart barGap={4} data={metric.data}>
            <Bar dataKey="value" radius={[6, 6, 6, 6]}>
              {metric.data.map((entry: any, index: number) => {
                const isBad =
                  entry.type === "bad" ||
                  (entry.type === "mixed" && entry.isHighlighted);
                const barColor = isBad ? "#ef4444" : "#003d79";
                const opacity = entry.isHighlighted ? 1 : 0.4;

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={barColor}
                    opacity={opacity}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6 no-scrollbar pb-10">

        {/* Render All Charts for this Metric */}
        {renderMetricContent()}

        {/* Global Recent Events Section */}
        <div className="bg-slate-50 dark:bg-[#1a1c23] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 mt-8">
          <h4 className="font-medium mb-1 text-slate-700 dark:text-slate-200">
            Recent Transactions & Events
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
            Latest registered events affecting this metric.
          </p>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-white dark:bg-[#111318] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md dark:hover:shadow-none"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-[#003d79] dark:text-blue-400 shrink-0">
                    <Activity size={16} />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-slate-700 dark:text-slate-200">
                      Event Record #{i}8492
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      Processed today at 10:{i}4 AM
                    </div>
                  </div>
                </div>
                <div
                  className={`font-medium text-sm ${metric.isBad ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-200"}`}
                >
                  {metric.isBad ? "+" : "+ Rp "}{" "}
                  {Math.floor(Math.random() * 500)}{" "}
                  {metric.isBad ? " incidents" : "M"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function DashboardPage() {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const activeMetric = METRICS.find((m) => m.id === selectedMetric);

  return (
    <div className="font-sans text-slate-800 dark:text-slate-200 overflow-hidden relative pt-4 lg:pt-8 -mx-3 -mb-3 -mt-3 min-h-full flex flex-col">
      {/* Decorative Background Blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-300/40 dark:bg-blue-900/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] bg-indigo-200/30 dark:bg-indigo-900/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full mx-auto relative z-10 flex flex-col flex-1">
        {/* Header Section */}
        <AnimatePresence>
          {!selectedMetric && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 32 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="relative px-4 lg:px-8 overflow-hidden"
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">
                Mandiri Analyst Portal
              </p>
              <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-slate-800 dark:text-white">
                Executive Summary
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Dashboard Area */}
        <motion.div layout className="relative mt-4 flex-1 flex flex-col">
          <Card className="w-full flex-1 bg-white dark:bg-[#1a1c23] shadow-xl border-none rounded-t-[2.5rem] rounded-b-none overflow-hidden">
            <Card.Content className="p-4 lg:p-6 flex flex-col relative">
              <AnimatePresence mode="wait">
                {selectedMetric ? (
                  <ExpandedDetailCard
                    key="detail"
                    metric={activeMetric}
                    onBack={() => setSelectedMetric(null)}
                  />
                ) : (
                  <motion.div
                    key="grid"
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {METRICS.map((metric, i) => (
                      <MetricCard
                        key={metric.id}
                        data={metric.data}
                        delay={i * 0.1}
                        icon={metric.icon}
                        isBad={metric.isBad}
                        layoutId={metric.layoutId}
                        subtitle={metric.subtitle}
                        title={metric.title}
                        value={metric.value}
                        onClick={() => setSelectedMetric(metric.id)}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card.Content>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
