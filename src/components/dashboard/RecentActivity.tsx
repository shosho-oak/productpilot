"use client"

import { motion } from "framer-motion"
import { Activity } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

const activities = [
  {
    initials: "SC",
    gradient: "from-violet-400 to-purple-500",
    user: "Sarah",
    action: "updated",
    target: "Export CSV",
    time: "5 min ago",
  },
  {
    initials: "AH",
    gradient: "from-blue-400 to-indigo-500",
    user: "Ahmed",
    action: "completed",
    target: "User Roles",
    time: "1 hour ago",
  },
  {
    initials: "OM",
    gradient: "from-emerald-400 to-teal-500",
    user: "Omar",
    action: "commented on",
    target: "Analytics Filters",
    time: "3 hours ago",
  },
]

const actionColor: Record<string, string> = {
  updated: "text-blue-600",
  completed: "text-emerald-600",
  "commented on": "text-amber-600",
}

interface RecentActivityProps {
  loading?: boolean
}

export function RecentActivity({ loading }: RecentActivityProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
        <h2 className="text-[15px] font-semibold text-foreground">Recent Activity</h2>
      </div>

      <div className="rounded-[12px] border border-border bg-card overflow-hidden">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3.5 ${i < 2 ? "border-b border-border" : ""}`}
              >
                <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-3.5 w-16 shrink-0" />
              </div>
            ))
          : activities.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.28, ease: "easeOut" }}
                whileHover={{ backgroundColor: "oklch(0.97 0.005 265)" }}
                className={`flex items-center gap-3 px-4 py-3.5 transition-colors duration-150 ${
                  i < activities.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback
                    className={`bg-gradient-to-br ${activity.gradient} text-white text-[9px] font-semibold`}
                  >
                    {activity.initials}
                  </AvatarFallback>
                </Avatar>
                <p className="flex-1 text-[13px] text-foreground/80 min-w-0">
                  <span className="font-medium text-foreground">{activity.user}</span>{" "}
                  <span className={`font-medium ${actionColor[activity.action] ?? ""}`}>
                    {activity.action}
                  </span>{" "}
                  <span className="font-medium text-foreground">{activity.target}</span>
                </p>
                <span className="text-[11px] text-muted-foreground shrink-0">{activity.time}</span>
              </motion.div>
            ))}
      </div>
    </section>
  )
}
