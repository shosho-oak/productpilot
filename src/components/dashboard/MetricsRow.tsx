"use client"

import { motion } from "framer-motion"
import { FolderOpen, CheckSquare, Rocket, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const metrics = [
  {
    label: "Active Projects",
    value: "3",
    icon: FolderOpen,
    color: "text-violet-600",
    bg: "bg-violet-50",
    change: "+1 this month",
    up: true,
  },
  {
    label: "Open Tasks",
    value: "28",
    icon: CheckSquare,
    color: "text-blue-600",
    bg: "bg-blue-50",
    change: "6 due today",
    up: false,
  },
  {
    label: "Upcoming Releases",
    value: "2",
    icon: Rocket,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    change: "Next in 5 days",
    up: true,
  },
  {
    label: "Completed This Week",
    value: "14",
    icon: TrendingUp,
    color: "text-amber-600",
    bg: "bg-amber-50",
    change: "+3 vs last week",
    up: true,
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
}

interface MetricsRowProps {
  loading?: boolean
}

export function MetricsRow({ loading }: MetricsRowProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[12px] border border-border bg-card p-5">
            <Skeleton className="h-8 w-8 rounded-[8px] mb-4" />
            <Skeleton className="h-7 w-12 mb-2" />
            <Skeleton className="h-4 w-28 mb-1" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {metrics.map((m) => {
        const Icon = m.icon
        return (
          <motion.div
            key={m.label}
            variants={item}
            whileHover={{ y: -2, boxShadow: "0 8px 24px oklch(0.52 0.22 280 / 0.08)" }}
            className="group relative rounded-[12px] border border-border bg-card p-5 cursor-default transition-shadow duration-200"
          >
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-[9px] ${m.bg} mb-4`}>
              <Icon className={`h-4.5 w-4.5 ${m.color}`} strokeWidth={1.8} />
            </div>
            <p className="text-[28px] font-semibold tracking-tight text-foreground leading-none mb-1">
              {m.value}
            </p>
            <p className="text-[13px] font-medium text-foreground/80 mb-1">{m.label}</p>
            <p className="text-[12px] text-muted-foreground">{m.change}</p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
