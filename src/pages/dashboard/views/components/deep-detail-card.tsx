import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DEEP_DETAIL_MOCK_DATA, COLORS } from "../../data/mock-data";

interface DeepDetailCardProps {
  layoutId: string;
  title: string;
  onBack: () => void;
  isDark: boolean;
}

export default function DeepDetailCard({ layoutId, title, onBack, isDark }: DeepDetailCardProps) {
  const { historicalTrend, regionalBreakdown, tableData } = DEEP_DETAIL_MOCK_DATA;

  const cardClass = "bg-slate-50 dark:bg-[#1a1c23] p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm";
  const chartContainerClass = "h-64 mt-6 w-full";

  return (
    <motion.div
      layoutId={layoutId}
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
              <Activity size={20} />
              <span className="font-medium text-lg">Deep Detail</span>
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl lg:text-4xl font-light text-slate-800 dark:text-white">
                {title}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6 no-scrollbar pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Historical Trend */}
          <div className={cardClass}>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Historical Trend</h4>
              <span className="text-xs text-slate-400">Monthly</span>
            </div>
            <div className={chartContainerClass}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalTrend}>
                  <defs>
                    <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" }} dx={-10} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                    labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="metric_a" stroke={COLORS[0]} fillOpacity={1} fill="url(#colorA)" strokeWidth={2} />
                  <Area type="monotone" dataKey="metric_b" stroke={COLORS[1]} fillOpacity={1} fill="url(#colorB)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Breakdown */}
          <div className={cardClass}>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Regional Breakdown</h4>
            </div>
            <div className={chartContainerClass}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalBreakdown} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" }} />
                  <YAxis type="category" dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" }} />
                  <Tooltip
                    cursor={{ fill: isDark ? '#334155' : '#f1f5f9' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {regionalBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-[#1a1c23] p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm mt-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-medium text-slate-700 dark:text-slate-200">Raw Data</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">Transaction level detail</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-[#003d79] dark:text-blue-400 font-medium hover:underline">
              View All <ArrowUpRight size={16} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-[#111318] dark:text-slate-300">
                <tr>
                  <th scope="col" className="px-6 py-4 rounded-l-lg">ID</th>
                  <th scope="col" className="px-6 py-4">Date</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Amount</th>
                  <th scope="col" className="px-6 py-4 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.id} className="bg-white dark:bg-[#1a1c23] border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#111318]/50 transition-colors">
                    <th scope="row" className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {row.id}
                    </th>
                    <td className="px-6 py-4">{row.date}</td>
                    <td className="px-6 py-4">{row.category}</td>
                    <td className="px-6 py-4 font-medium">{row.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        row.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' :
                        row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400' :
                        row.status === 'Failed' ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
