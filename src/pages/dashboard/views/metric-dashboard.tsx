import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { METRICS } from "../data/mock-data";
import { MetricCard } from "./components/metric-card";
import ExpandedDetailCard from "./components/expanded-detail-card";
import DeepDetailCard from "./components/deep-detail-card";
import { Card } from "@heroui/react";

export default function MetricDashboard() {
  const { metricId } = useParams();
  const [deepDetailTitle, setDeepDetailTitle] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const activeMetric = METRICS.find((m) => m.id === metricId);

  useEffect(() => {
    if (deepDetailTitle) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [deepDetailTitle]);

  if (!activeMetric) {
    return <div className="p-8 text-center text-slate-500">Metric not found.</div>;
  }

  return (
    <div className="font-sans text-slate-800 dark:text-slate-200 overflow-hidden relative pt-4 lg:pt-8 -mx-3 -mb-3 -mt-3 min-h-full flex flex-col">
      {/* Decorative Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full mx-auto relative z-10 flex flex-col flex-1">

        {/* Header Section */}
        <AnimatePresence>
          {!deepDetailTitle && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 px-4 lg:px-8 pt-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-slate-900 dark:text-white mb-2">
                    {activeMetric.title}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Detailed view for {activeMetric.title.toLowerCase()} metrics and performance.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Content */}
        <motion.div layout className="relative mt-4 flex-1 flex flex-col">
          <Card className="w-full flex-1 bg-white dark:bg-[#1a1c23] shadow-xl border-none rounded-t-[2.5rem] rounded-b-none overflow-hidden">
            <Card.Content className="p-4 lg:p-6 flex flex-col relative">
              <AnimatePresence mode="wait">
                {deepDetailTitle ? (
                  <DeepDetailCard
                    key="deep-detail"
                    layoutId="deep-detail"
                    title={deepDetailTitle}
                    onBack={() => setDeepDetailTitle(null)}
                    isDark={isDark}
                  />
                ) : (
                  <ExpandedDetailCard
                    key="expanded"
                    metric={activeMetric}
                    onBack={() => { }} // No back button needed here since it's static
                    isMetricRoute={true}
                    onChartClick={(title: string) => setDeepDetailTitle(title)}
                  />
                )}
              </AnimatePresence>
            </Card.Content>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
