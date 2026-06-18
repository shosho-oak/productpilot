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
  },
  {
    label: "Open Tasks",
    value: "28",
    icon: CheckSquare,
    color: "text-blue-600",
    bg: "bg-blue-50",
    change: "6 due today",
  },
  {
    label: "Upcoming Releases",
    value: "2",
    icon: Rocket,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    change: "Next in 5 days",
  },
  {
    label: "Completed This Week",
    value: "14",
    icon: TrendingUp,
    color: "text-amber-600",
    bg: "bg-amber-50",
    change: "+3 vs last week",
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

interface MetricsRowProps {
  loading?: boolean
}

export function MetricsRow({ loading }: MetricsRowProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[12px] border border-border bg-card p-5 shadow-[0_1px_4px_oklch(0_0_0/0.05)]"
          >
            <Skeleton className="h-9 w-9 rounded-[10px] mb-5" />
            <Skeleton className="h-8 w-10 mb-2" />
            <Skeleton className="h-4 w-28 mb-1.5" />
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
            whileHover={{
              y: -2,
              boxShadow: "0 8px 24px oklch(0.52 0.22 280 / 0.09)",
              borderColor: "oklch(0.52 0.22 280 / 0.2)",
            }}
            className="group relative rounded-[12px] border border-border bg-card p-5 cursor-default shadow-[0_1px_4px_oklch(0_0_0/0.05)] transition-all duration-200"
          >
            <div
              className={`inline-flex h-9 w-9 items-center justify-center rounded-[10px] ${m.bg} mb-5`}
            >
              <Icon className={`h-[18px] w-[18px] ${m.color}`} strokeWidth={1.75} />
            </div>
            <p className="text-[30px] font-semibold tracking-tight text-foreground leading-none mb-1.5">
              {m.value}
            </p>
            <p className="text-[13px] font-medium text-foreground/75 mb-1">{m.label}</p>
            <p className="text-[12px] text-muted-foreground">{m.change}</p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
