"use client"

import { motion } from "framer-motion"
import { AlertCircle, Clock, TrendingUp, Sparkles, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const insights = [
  {
    icon: AlertCircle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    accentBorder: "border-l-red-300",
    text: "Mobile Banking App has 3 high-priority tasks without owners.",
    tag: "Action needed",
    tagBg: "bg-red-50",
    tagText: "text-red-600",
  },
  {
    icon: Clock,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    accentBorder: "border-l-amber-300",
    text: "Merchant Dashboard release is approaching in 5 days.",
    tag: "Deadline",
    tagBg: "bg-amber-50",
    tagText: "text-amber-600",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    accentBorder: "border-l-emerald-300",
    text: "Export CSV is one of the most requested features.",
    tag: "Trending",
    tagBg: "bg-emerald-50",
    tagText: "text-emerald-600",
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
}

interface AiInsightsProps {
  loading?: boolean
}

export function AiInsights({ loading }: AiInsightsProps) {
  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-primary">
            <Sparkles className="h-3 w-3 text-primary-foreground" />
          </div>
          <h2 className="text-[15px] font-semibold text-foreground">AI Insights</h2>
        </div>
        <button className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-primary transition-colors duration-150">
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[12px] border border-border border-l-2 bg-card p-5 shadow-[0_1px_4px_oklch(0_0_0/0.05)]"
            >
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="h-10 w-10 rounded-[10px]" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {insights.map((insight, i) => {
            const Icon = insight.icon
            return (
              <motion.div
                key={i}
                variants={item}
                whileHover={{
                  y: -2,
                  boxShadow: "0 6px 20px oklch(0_0_0/0.07)",
                }}
                className={`group relative rounded-[12px] border border-border border-l-2 ${insight.accentBorder} bg-card p-5 cursor-default overflow-hidden shadow-[0_1px_4px_oklch(0_0_0/0.05)] hover:border-t-border/80 transition-all duration-200`}
              >
                {/* Hover wash */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Top row: icon + tag */}
                <div className="relative flex items-start justify-between mb-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${insight.iconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${insight.iconColor}`} strokeWidth={1.75} />
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${insight.tagBg} ${insight.tagText}`}
                  >
                    {insight.tag}
                  </span>
                </div>

                {/* Insight text — primary content */}
                <p className="relative text-[13.5px] font-medium text-foreground/85 leading-[1.55]">
                  {insight.text}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </section>
  )
}
