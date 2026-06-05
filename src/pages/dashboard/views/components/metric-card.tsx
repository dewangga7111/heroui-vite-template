import { motion } from "framer-motion";
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";

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

export const MetricCard = ({
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
