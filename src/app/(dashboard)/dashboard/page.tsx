"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MetricsRow } from "@/components/dashboard/MetricsRow"
import { AiInsights } from "@/components/dashboard/AiInsights"
import { ActiveProjects } from "@/components/dashboard/ActiveProjects"
import { RecentDocuments } from "@/components/dashboard/RecentDocuments"
import { UpcomingReleases } from "@/components/dashboard/UpcomingReleases"
import { RecentActivity } from "@/components/dashboard/RecentActivity"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="mx-auto max-w-[1280px]">
      {/* Page header — more vertical air so the greeting breathes */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-10"
      >
        <h1 className="text-[24px] font-semibold tracking-tight text-foreground mb-1.5">
          Welcome back, Shahad 👋
        </h1>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Here&apos;s what&apos;s happening across your products.
        </p>
      </motion.div>

      {/* Metrics */}
      <div className="mb-10">
        <MetricsRow loading={loading} />
      </div>

      {/* AI Insights */}
      <div className="mb-10">
        <AiInsights loading={loading} />
      </div>

      {/* Main two-column grid — wider gap, columns breathe */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_336px] gap-8">
        <div className="space-y-8">
          <ActiveProjects loading={loading} />
          <RecentDocuments loading={loading} />
        </div>
        <div className="space-y-8">
          <UpcomingReleases loading={loading} />
          <RecentActivity loading={loading} />
        </div>
      </div>
    </div>
  )
}
