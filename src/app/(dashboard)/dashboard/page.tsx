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
    <div className="mx-auto max-w-[1280px] space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground mb-1">
          Welcome back, Sarah 👋
        </h1>
        <p className="text-[14px] text-muted-foreground">
          Here&apos;s what&apos;s happening across your products.
        </p>
      </motion.div>

      {/* Metrics */}
      <MetricsRow loading={loading} />

      {/* AI Insights */}
      <AiInsights loading={loading} />

      {/* Main two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <ActiveProjects loading={loading} />
          <RecentDocuments loading={loading} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <UpcomingReleases loading={loading} />
          <RecentActivity loading={loading} />
        </div>
      </div>
    </div>
  )
}
