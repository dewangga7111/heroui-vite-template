import { motion } from "framer-motion";
import { ArrowLeft, Activity } from "lucide-react";
import {
  BarChart, Bar, ResponsiveContainer, Cell,
  PieChart, Pie, Sector, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { DETAIL_MOCK_DATA, COLORS } from "../../data/mock-data";

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

export default function ExpandedDetailCard({
  metric,
  onBack,
  isMetricRoute,
  onChartClick,
}: {
  metric: any;
  onBack: () => void;
  isMetricRoute?: boolean;
  onChartClick?: (title: string) => void;
}) {
  const detailData = DETAIL_MOCK_DATA[metric.id as keyof typeof DETAIL_MOCK_DATA];

  const renderMetricContent = () => {
    const gridClass = "grid grid-cols-1 lg:grid-cols-2 gap-8";
    const baseCardClass = "chart-card-wrapper bg-white dark:bg-[#111318] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col w-full";
    const interactiveClass = isMetricRoute ? " cursor-pointer hover:border-blue-500/40 transition-colors" : "";
    const cardClass = baseCardClass + interactiveClass;
    const fullWidthCardClass = baseCardClass + " lg:col-span-2" + interactiveClass;
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col flex-1 min-h-[800px] z-50 relative"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-6">
          {!isMetricRoute && (
            <button
              className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 shrink-0"
              onClick={onBack}
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-1">
              {metric.icon && <metric.icon size={20} />}
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
      <div className="flex-1 pr-4 space-y-6">

        {/* Render All Charts for this Metric */}
        <div
          onClick={(e) => {
            if (!isMetricRoute || !onChartClick) return;
            const target = e.target as HTMLElement;
            const card = target.closest('.chart-card-wrapper');
            if (card) {
              const title = card.querySelector('h4')?.textContent;
              if (title) onChartClick(title);
            }
          }}
        >
          {renderMetricContent()}
        </div>

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
}
