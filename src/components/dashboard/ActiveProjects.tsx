"use client"

import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

const statusConfig: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  "in-progress": { label: "In Progress", dot: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-700" },
  planning: { label: "Planning", dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
  review: { label: "Review", dot: "bg-violet-500", bg: "bg-violet-50", text: "text-violet-700" },
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  high: { label: "High", color: "text-red-600" },
  medium: { label: "Medium", color: "text-amber-600" },
  low: { label: "Low", color: "text-emerald-600" },
}

const projects = [
  {
    name: "Merchant Dashboard",
    status: "in-progress",
    progress: 75,
    priority: "high",
    avatars: ["JK", "AL", "MR"],
  },
  {
    name: "Mobile Banking App",
    status: "planning",
    progress: 30,
    priority: "medium",
    avatars: ["SC", "OA"],
  },
  {
    name: "Analytics Platform",
    status: "review",
    progress: 90,
    priority: "low",
    avatars: ["TN", "RK", "YP"],
  },
]

const avatarGradients = [
  "from-violet-400 to-purple-500",
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" as const } },
}

interface ActiveProjectsProps {
  loading?: boolean
}

export function ActiveProjects({ loading }: ActiveProjectsProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-semibold text-foreground">Active Projects</h2>
        <button className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-primary transition-colors duration-150">
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-[12px] border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full mb-3" />
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1.5">
                  {[1, 2, 3].map((j) => <Skeleton key={j} className="h-6 w-6 rounded-full" />)}
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3"
        >
          {projects.map((project) => {
            const s = statusConfig[project.status]
            const p = priorityConfig[project.priority]
            return (
              <motion.div
                key={project.name}
                variants={item}
                whileHover={{ y: -1 }}
                className="group rounded-[12px] border border-border bg-card p-5 cursor-default hover:border-primary/20 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <p className="text-[14px] font-semibold text-foreground">{project.name}</p>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors duration-150" />
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${s.bg} ${s.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                </div>

                <div className="mb-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-muted-foreground">Progress</span>
                    <span className="text-[12px] font-semibold text-foreground">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    {project.avatars.map((initials, idx) => (
                      <Avatar key={idx} className="h-6 w-6 ring-2 ring-card text-[10px]">
                        <AvatarFallback className={`bg-gradient-to-br ${avatarGradients[idx % avatarGradients.length]} text-white text-[9px] font-semibold`}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className={`text-[11px] font-medium ${p.color}`}>
                    {p.label} Priority
                  </span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </section>
  )
}
