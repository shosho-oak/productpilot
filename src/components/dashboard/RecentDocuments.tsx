"use client"

import { motion } from "framer-motion"
import { FileText, FileBarChart, FileVideo, BookOpen, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const documents = [
  {
    title: "Q3 Roadmap",
    icon: BookOpen,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
    updated: "2 hours ago",
    tag: "Roadmap",
    tagColor: "text-violet-600",
    tagBg: "bg-violet-50 border border-violet-100",
  },
  {
    title: "Release Notes v2.1",
    icon: FileText,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    updated: "Yesterday",
    tag: "Release",
    tagColor: "text-blue-600",
    tagBg: "bg-blue-50 border border-blue-100",
  },
  {
    title: "User Interview Summary",
    icon: FileVideo,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    updated: "3 days ago",
    tag: "Research",
    tagColor: "text-emerald-600",
    tagBg: "bg-emerald-50 border border-emerald-100",
  },
  {
    title: "Checkout Redesign PRD",
    icon: FileBarChart,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    updated: "1 week ago",
    tag: "PRD",
    tagColor: "text-amber-600",
    tagBg: "bg-amber-50 border border-amber-100",
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
        <div className="rounded-[12px] border border-border bg-card overflow-hidden shadow-[0_1px_4px_oklch(0_0_0/0.05)] divide-y divide-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <Skeleton className="h-9 w-9 rounded-[10px] shrink-0" />
              <div className="flex-1 min-w-0 space-y-1.5">
                <Skeleton className="h-[14px] w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full shrink-0" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="rounded-[12px] border border-border bg-card overflow-hidden shadow-[0_1px_4px_oklch(0_0_0/0.05)]"
        >
          {documents.map((doc, i) => {
            const Icon = doc.icon
            return (
              <motion.div
                key={doc.title}
                variants={item}
                whileHover={{ backgroundColor: "oklch(0.975 0.006 280)" }}
                className={`group flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors duration-150 ${
                  i < documents.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${doc.iconBg} transition-transform duration-150 group-hover:scale-105`}
                >
                  <Icon className={`h-[17px] w-[17px] ${doc.iconColor}`} strokeWidth={1.7} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-foreground truncate leading-snug group-hover:text-primary transition-colors duration-150">
                    {doc.title}
                  </p>
                  <p className="text-[11.5px] text-muted-foreground mt-0.5">
                    Updated {doc.updated}
                  </p>
                </div>

                <span
                  className={`shrink-0 text-[11px] font-medium rounded-full px-2.5 py-0.5 ${doc.tagBg} ${doc.tagColor}`}
                >
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
