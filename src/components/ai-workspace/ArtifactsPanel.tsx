"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  BarChart2,
  Zap,
  Copy,
  Check,
  Pencil,
  Download,
  MoreHorizontal,
  History,
  ArrowDownToLine,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Artifact card shell ──────────────────────────────────────────────────────

interface ArtifactCardProps {
  index: number
  icon: React.ElementType
  iconBg: string
  iconColor: string
  accentClass: string
  title: string
  version?: string
  timestamp: string
  children: React.ReactNode
}

function ArtifactCard({
  index,
  icon: Icon,
  iconBg,
  iconColor,
  accentClass,
  title,
  version = "v1",
  timestamp,
  children,
}: ArtifactCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.35,
        ease: "easeOut" as const,
      }}
      className={cn(
        "rounded-[12px] border border-border border-l-[3px] bg-card overflow-hidden",
        "shadow-[0_1px_4px_oklch(0_0_0/0.05)] hover:shadow-[0_4px_16px_oklch(0_0_0/0.08)]",
        "transition-shadow duration-200",
        accentClass
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px]",
            iconBg
          )}
        >
          <Icon className={cn("h-[14px] w-[14px]", iconColor)} strokeWidth={1.85} />
        </div>
        <h3 className="flex-1 text-[13px] font-semibold text-foreground">{title}</h3>
        {/* Version badge */}
        <button className="flex items-center gap-1 rounded-md border border-border/60 bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150">
          <History className="h-2.5 w-2.5" />
          {version}
        </button>
        <button className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mx-4 border-t border-border/60" />

      {/* Content */}
      <div className="px-4 py-4">{children}</div>

      <div className="mx-4 border-t border-border/60" />

      {/* Footer actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[11px] font-medium transition-all duration-150",
              copied
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200/70"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {copied ? (
              <Check className="h-3 w-3" strokeWidth={2.5} />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>

          <button className="flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[11px] font-medium bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150">
            <Pencil className="h-3 w-3" />
            Edit
          </button>

          <button className="flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[11px] font-medium bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150">
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>

        <span className="text-[10.5px] text-muted-foreground/50">{timestamp}</span>
      </div>
    </motion.div>
  )
}

// ─── Individual artifact contents ─────────────────────────────────────────────

function UserStoryContent() {
  return (
    <div className="space-y-2">
      <div className="rounded-[8px] bg-violet-50/70 border border-violet-100 px-3.5 py-3">
        <p className="text-[13px] text-foreground/85 leading-[1.65]">
          <span className="text-muted-foreground">As a </span>
          <span className="font-semibold text-foreground">marketing manager,</span>
          <br />
          <span className="text-muted-foreground">I want to </span>
          <span className="font-semibold text-foreground">export dashboard data to CSV</span>
          <br />
          <span className="text-muted-foreground">so that I can </span>
          <span className="font-semibold text-foreground">
            analyze campaign performance offline.
          </span>
        </p>
      </div>
    </div>
  )
}

function AcceptanceCriteriaContent() {
  const items = [
    "User can export CSV from any dashboard view.",
    "Export respects currently active filters.",
    "File downloads successfully within 5 seconds.",
  ]
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <CheckCircle2
            className="h-4 w-4 shrink-0 text-blue-500 mt-[1px]"
            strokeWidth={1.85}
          />
          <span className="text-[12.5px] text-foreground/80 leading-snug">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function EdgeCasesContent() {
  const items = [
    "No data available — show an empty state message.",
    "Export interrupted mid-download — prompt retry.",
    "Invalid filters applied — validate before export.",
  ]
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <AlertTriangle
            className="h-3.5 w-3.5 shrink-0 text-amber-500 mt-[2px]"
            strokeWidth={1.85}
          />
          <span className="text-[12.5px] text-foreground/80 leading-snug">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function KPIsContent() {
  const items = [
    { label: "Export usage rate", sub: "% of active users who export per week" },
    { label: "Feature adoption", sub: "Time-to-first-export after onboarding" },
    { label: "Retention impact", sub: "Churn delta: exporters vs. non-exporters" },
  ]
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <BarChart2
            className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-[2px]"
            strokeWidth={1.85}
          />
          <div>
            <p className="text-[12.5px] font-medium text-foreground leading-none mb-0.5">
              {item.label}
            </p>
            <p className="text-[11.5px] text-muted-foreground">{item.sub}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

function PriorityContent() {
  return (
    <div className="space-y-4">
      {/* Score */}
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200/70 px-3 py-1 text-[12px] font-semibold text-red-600">
          <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
          High Priority
        </span>
      </div>

      {/* Impact / Effort grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[9px] bg-muted/50 border border-border/60 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1">
            Impact
          </p>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-[13px] font-semibold text-foreground">High</span>
          </div>
        </div>
        <div className="rounded-[9px] bg-muted/50 border border-border/60 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1">
            Effort
          </p>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-400 shrink-0" />
            <span className="text-[13px] font-semibold text-foreground">Low</span>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="rounded-[9px] bg-primary/5 border border-primary/15 px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/60 mb-1">
          Recommendation
        </p>
        <p className="text-[12.5px] text-foreground/80 leading-snug">
          Implement in the next sprint. High ROI with minimal engineering investment.
        </p>
      </div>
    </div>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function ArtifactsPanel() {
  const artifacts = [
    {
      icon: BookOpen,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-500",
      accentClass: "border-l-violet-300",
      title: "User Story",
      content: <UserStoryContent />,
      timestamp: "3 min ago",
    },
    {
      icon: CheckCircle2,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      accentClass: "border-l-blue-300",
      title: "Acceptance Criteria",
      content: <AcceptanceCriteriaContent />,
      timestamp: "3 min ago",
    },
    {
      icon: AlertTriangle,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      accentClass: "border-l-amber-300",
      title: "Edge Cases",
      content: <EdgeCasesContent />,
      timestamp: "3 min ago",
    },
    {
      icon: BarChart2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      accentClass: "border-l-emerald-300",
      title: "KPIs",
      content: <KPIsContent />,
      timestamp: "3 min ago",
    },
    {
      icon: Zap,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      accentClass: "border-l-red-300",
      title: "Priority Score",
      content: <PriorityContent />,
      timestamp: "3 min ago",
    },
  ]

  return (
    <aside className="w-[372px] shrink-0 border-l border-border flex flex-col overflow-hidden">
      {/* Panel header */}
      <div className="shrink-0 flex items-center justify-between border-b border-border px-5 py-[18px] bg-[oklch(0.985_0.004_265)]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[14px] font-semibold text-foreground">Generated Artifacts</h2>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            5
          </span>
        </div>
        <button className="flex items-center gap-1.5 rounded-[8px] border border-border bg-card px-2.5 py-1.5 text-[11.5px] font-medium text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-muted/50 transition-all duration-150 shadow-[0_1px_3px_oklch(0_0_0/0.05)]">
          <ArrowDownToLine className="h-3 w-3" />
          Export all
        </button>
      </div>

      {/* Artifact cards */}
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-[oklch(0.975_0.003_265)] p-4 space-y-3">
        {artifacts.map((artifact, i) => (
          <ArtifactCard
            key={artifact.title}
            index={i}
            icon={artifact.icon}
            iconBg={artifact.iconBg}
            iconColor={artifact.iconColor}
            accentClass={artifact.accentClass}
            title={artifact.title}
            version="v1"
            timestamp={artifact.timestamp}
          >
            {artifact.content}
          </ArtifactCard>
        ))}
      </div>
    </aside>
  )
}
