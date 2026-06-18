"use client"

import { motion } from "framer-motion"
import { Rocket } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const releases = [
  { name: "Merchant Dashboard", date: "July 12", daysLeft: 5, urgency: "high" },
  { name: "Mobile Banking App", date: "July 28", daysLeft: 21, urgency: "medium" },
  { name: "Analytics Platform", date: "August 3", daysLeft: 27, urgency: "low" },
]

const urgencyBar: Record<string, string> = {
  high: "bg-red-400",
  medium: "bg-amber-400",
  low: "bg-emerald-400",
}

const urgencyText: Record<string, string> = {
  high: "text-red-600",
  medium: "text-amber-600",
  low: "text-emerald-600",
}

interface UpcomingReleasesProps {
  loading?: boolean
}

export function UpcomingReleases({ loading }: UpcomingReleasesProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
        <h2 className="text-[15px] font-semibold text-foreground">Upcoming Releases</h2>
      </div>

      <div className="rounded-[12px] border border-border bg-card overflow-hidden">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3.5 ${i < 2 ? "border-b border-border" : ""}`}
              >
                <Skeleton className="h-2 w-2 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-36 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            ))
          : releases.map((release, i) => (
              <motion.div
                key={release.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.28, ease: "easeOut" }}
                whileHover={{ backgroundColor: "oklch(0.97 0.005 265)" }}
                className={`group flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors duration-150 ${
                  i < releases.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <span className={`h-2 w-2 rounded-full shrink-0 ${urgencyBar[release.urgency]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{release.name}</p>
                  <p className="text-[11px] text-muted-foreground">{release.date}</p>
                </div>
                <span className={`text-[11px] font-semibold ${urgencyText[release.urgency]}`}>
                  {release.daysLeft}d left
                </span>
              </motion.div>
            ))}
      </div>
    </section>
  )
}
