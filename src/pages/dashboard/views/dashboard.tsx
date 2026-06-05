import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "next-themes";
import { METRICS } from "../data/mock-data";
import {
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@heroui/react";
import DeepDetailCard from "./components/deep-detail-card";
import { MetricCard } from "./components/metric-card";
import ExpandedDetailCard from "./components/expanded-detail-card";

export default function DashboardPage() {
  const { metricId } = useParams();
  const isMetricRoute = !!metricId;

  const [selectedMetric, setSelectedMetric] = useState<string | null>(metricId || null);
  const [deepDetailTitle, setDeepDetailTitle] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (metricId) {
      setSelectedMetric(metricId);
    }
  }, [metricId]);

  useEffect(() => {
    if (deepDetailTitle || selectedMetric) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [deepDetailTitle, selectedMetric]);

  const activeMetric = METRICS.find((m) => m.id === selectedMetric);

  return (
    <div className="font-sans text-slate-800 dark:text-slate-200 overflow-hidden relative pt-4 lg:pt-8 -mx-3 -mb-3 -mt-3 min-h-full flex flex-col">
      {/* Decorative Background Blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-300/40 dark:bg-blue-900/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] bg-indigo-200/30 dark:bg-indigo-900/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full mx-auto relative z-10 flex flex-col flex-1">
        {/* Header Section */}
        <AnimatePresence>
          {!selectedMetric && !isMetricRoute && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 lg:px-8 mb-6 lg:mb-10 pt-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800 dark:text-white tracking-tight mb-2">
                      Executive Summary
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                      Comprehensive overview of key performance indicators.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Last Updated
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        Today, 09:41 AM
                      </span>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1c23] shadow-sm flex items-center justify-center text-[#003d79] dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-[#003d79] dark:bg-blue-600 text-white shadow-md flex items-center justify-center hover:bg-[#002b5e] dark:hover:bg-blue-700 transition-colors">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Dashboard Area */}
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
                ) : selectedMetric && activeMetric ? (
                  <ExpandedDetailCard
                    key="expanded"
                    metric={activeMetric}
                    onBack={() => {
                      if (!isMetricRoute) {
                        setSelectedMetric(null);
                      }
                    }}
                  />
                ) : (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
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
