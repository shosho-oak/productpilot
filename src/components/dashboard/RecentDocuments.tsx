"use client"

import { motion } from "framer-motion"
import { FileText, FileBarChart, FileVideo, BookOpen, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const documents = [
  {
    title: "Q3 Roadmap",
    icon: BookOpen,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
    updated: "2 hours ago",
    tag: "Roadmap",
  },
  {
    title: "Release Notes v2.1",
    icon: FileText,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    updated: "Yesterday",
    tag: "Release",
  },
  {
    title: "User Interview Summary",
    icon: FileVideo,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    updated: "3 days ago",
    tag: "Research",
  },
  {
    title: "Checkout Redesign PRD",
    icon: FileBarChart,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    updated: "1 week ago",
    tag: "PRD",
  },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" as const } },
}

interface RecentDocumentsProps {
  loading?: boolean
}

export function RecentDocuments({ loading }: RecentDocumentsProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-semibold text-foreground">Recent Documents</h2>
        <button className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-primary transition-colors duration-150">
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {loading ? (
        <div className="rounded-[12px] border border-border bg-card overflow-hidden divide-y divide-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <Skeleton className="h-8 w-8 rounded-[8px] shrink-0" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-40 mb-1.5" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="rounded-[12px] border border-border bg-card overflow-hidden"
        >
          {documents.map((doc, i) => {
            const Icon = doc.icon
            return (
              <motion.div
                key={doc.title}
                variants={item}
                whileHover={{ backgroundColor: "oklch(0.97 0.005 265)" }}
                className={`group flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors duration-150 ${
                  i < documents.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] ${doc.iconBg}`}>
                  <Icon className={`h-4 w-4 ${doc.iconColor}`} strokeWidth={1.7} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate group-hover:text-primary transition-colors duration-150">
                    {doc.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Updated {doc.updated}</p>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-muted-foreground bg-muted/80 rounded-full px-2 py-0.5">
                  {doc.tag}
                </span>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </section>
  )
}
