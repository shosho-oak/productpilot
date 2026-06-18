"use client"

import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

const statusConfig: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  "in-progress": { label: "In Progress", dot: "bg-blue-400",   bg: "bg-blue-50",   text: "text-blue-700"   },
  planning:      { label: "Planning",     dot: "bg-amber-400",  bg: "bg-amber-50",  text: "text-amber-700"  },
  review:        { label: "Review",       dot: "bg-violet-400", bg: "bg-violet-50", text: "text-violet-700" },
}

const priorityConfig: Record<string, { label: string; dot: string }> = {
  high:   { label: "High",   dot: "bg-red-400"     },
  medium: { label: "Medium", dot: "bg-amber-400"   },
  low:    { label: "Low",    dot: "bg-emerald-400" },
}

const projects = [
  { name: "Merchant Dashboard",  status: "in-progress", progress: 75, priority: "high",   avatars: ["JK", "AL", "MR"] },
  { name: "Mobile Banking App",  status: "planning",     progress: 30, priority: "medium", avatars: ["SC", "OA"]       },
  { name: "Analytics Platform",  status: "review",       progress: 90, priority: "low",    avatars: ["TN", "RK", "YP"] },
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
            <div
              key={i}
              className="rounded-[12px] border border-border bg-card px-5 py-4 shadow-[0_1px_4px_oklch(0_0_0/0.05)]"
            >
              <div className="flex items-center justify-between mb-3.5">
                <Skeleton className="h-[17px] w-40" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1.5">
                  {[1, 2, 3].map((j) => <Skeleton key={j} className="h-6 w-6 rounded-full ring-2 ring-card" />)}
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
                whileHover={{
                  y: -1,
                  boxShadow: "0 6px 20px oklch(0_0_0/0.07)",
                  borderColor: "oklch(0.52 0.22 280 / 0.18)",
                }}
                className="group rounded-[12px] border border-border bg-card px-5 py-4 cursor-default shadow-[0_1px_4px_oklch(0_0_0/0.05)] transition-all duration-200"
              >
                {/* Primary row: name + status */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-semibold text-foreground leading-none">{project.name}</p>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-primary/60 transition-colors duration-150" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${s.bg} ${s.text}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                </div>

                {/* Progress — de-emphasised: thin bar, muted label */}
                <div className="mb-3.5">
                  <div className="h-[3px] w-full overflow-hidden rounded-full bg-muted/80">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{
                        duration: 0.9,
                        delay: 0.2,
                        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
                      }}
                      className="h-full rounded-full bg-primary/50"
                    />
                  </div>
                </div>

                {/* Footer row: avatars + priority */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    {project.avatars.map((initials, idx) => (
                      <Avatar key={idx} className="h-6 w-6 ring-2 ring-card">
                        <AvatarFallback
                          className={`bg-gradient-to-br ${avatarGradients[idx % avatarGradients.length]} text-white text-[9px] font-semibold`}
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${p.dot}`} />
                    {p.label} Priority
                    <span className="text-muted-foreground/40 mx-0.5">·</span>
                    <span className="font-medium text-foreground/60">{project.progress}%</span>
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
