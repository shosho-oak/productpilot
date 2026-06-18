"use client"

import { motion } from "framer-motion"
import { AlertCircle, Clock, TrendingUp, Sparkles, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const insights = [
  {
    icon: AlertCircle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    text: "Mobile Banking App has 3 high-priority tasks without owners.",
    tag: "Action needed",
    tagColor: "bg-red-50 text-red-600",
  },
  {
    icon: Clock,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    text: "Merchant Dashboard release is approaching in 5 days.",
    tag: "Deadline",
    tagColor: "bg-amber-50 text-amber-600",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    text: "Export CSV is one of the most requested features.",
    tag: "Trending",
    tagColor: "bg-emerald-50 text-emerald-600",
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
            <div key={i} className="rounded-[12px] border border-border bg-card p-4">
              <Skeleton className="h-8 w-8 rounded-[8px] mb-3" />
              <Skeleton className="h-4 w-full mb-1.5" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <Skeleton className="h-5 w-20 rounded-full" />
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
                whileHover={{ y: -2 }}
                className="group relative rounded-[12px] border border-border bg-card p-4 cursor-default overflow-hidden hover:border-primary/20 hover:shadow-sm transition-all duration-200"
              >
                {/* Subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className={`inline-flex h-8 w-8 items-center justify-center rounded-[8px] ${insight.iconBg} mb-3`}>
                  <Icon className={`h-4 w-4 ${insight.iconColor}`} strokeWidth={1.8} />
                </div>
                <p className="text-[13px] text-foreground/85 leading-[1.5] mb-3 relative">
                  {insight.text}
                </p>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${insight.tagColor}`}>
                  {insight.tag}
                </span>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </section>
  )
}
