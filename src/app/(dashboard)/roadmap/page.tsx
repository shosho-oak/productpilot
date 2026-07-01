"use client"

import React, { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Circle,
  FolderKanban,
  Link2,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type RoadmapStatus   = "Shipped" | "In Progress" | "Planned" | "Exploring" | "Paused"
type RoadmapPriority = "High" | "Medium" | "Low"
type Quarter         = "Q2 2026" | "Q3 2026" | "Q4 2026" | "Future"

interface TeamMember {
  name: string
  initials: string
  color: string
}

interface ActivityEntry {
  id: string
  actor: string
  action: string
  time: string
  ai?: boolean
}

interface Initiative {
  id: string
  title: string
  description: string
  overview: string
  businessGoal: string
  successMetrics: string[]
  dependencies: string[]
  risks: string[]
  status: RoadmapStatus
  priority: RoadmapPriority
  progress: number
  quarter: Quarter
  timeline: { start: string; end: string }
  owner: TeamMember
  linkedProject: string
  activity: ActivityEntry[]
  aiRecommendation: string
}

// ─── Config ───────────────────────────────────────────────────────────────────

const statusConfig: Record<
  RoadmapStatus,
  { dot: string; bg: string; text: string; border: string; accentBg: string; progressColor: string }
> = {
  "Shipped":     { dot: "bg-emerald-500", bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200/70", accentBg: "bg-emerald-400", progressColor: "bg-emerald-500" },
  "In Progress": { dot: "bg-amber-500",   bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-200/70",   accentBg: "bg-amber-400",   progressColor: "bg-amber-500"   },
  "Planned":     { dot: "bg-blue-500",    bg: "bg-blue-50",     text: "text-blue-700",    border: "border-blue-200/70",    accentBg: "bg-blue-400",    progressColor: "bg-blue-500"    },
  "Exploring":   { dot: "bg-primary",     bg: "bg-primary/10",  text: "text-primary",     border: "border-primary/20",     accentBg: "bg-primary/60",  progressColor: "bg-primary"     },
  "Paused":      { dot: "bg-slate-400",   bg: "bg-slate-50",    text: "text-slate-600",   border: "border-slate-200/70",   accentBg: "bg-slate-300",   progressColor: "bg-slate-400"   },
}

const priorityConfig: Record<RoadmapPriority, { dot: string; label: string }> = {
  High:   { dot: "bg-red-500",     label: "text-red-600"     },
  Medium: { dot: "bg-amber-500",   label: "text-amber-600"   },
  Low:    { dot: "bg-emerald-500", label: "text-emerald-600" },
}

const QUARTERS: Quarter[] = ["Q2 2026", "Q3 2026", "Q4 2026", "Future"]

const quarterConfig: Record<
  Quarter,
  { sub: string; badgeBg: string; badgeText: string; badgeBorder: string }
> = {
  "Q2 2026": { sub: "Apr – Jun 2026",  badgeBg: "bg-violet-50", badgeText: "text-violet-700", badgeBorder: "border-violet-200/70" },
  "Q3 2026": { sub: "Jul – Sep 2026",  badgeBg: "bg-blue-50",   badgeText: "text-blue-700",   badgeBorder: "border-blue-200/70"   },
  "Q4 2026": { sub: "Oct – Dec 2026",  badgeBg: "bg-amber-50",  badgeText: "text-amber-700",  badgeBorder: "border-amber-200/70"  },
  "Future":  { sub: "2027 and beyond", badgeBg: "bg-slate-50",  badgeText: "text-slate-600",  badgeBorder: "border-slate-200/70"  },
}

// ─── Team members ─────────────────────────────────────────────────────────────

const SQ: TeamMember = { name: "Shahad Qumosani",        initials: "SQ", color: "bg-violet-500" }
const RA: TeamMember = { name: "Rayan Al-Omari",         initials: "RA", color: "bg-blue-500"   }
const FS: TeamMember = { name: "Faisal Al-Sudairy",      initials: "FS", color: "bg-amber-500"  }
const LA: TeamMember = { name: "Lina Alamri",            initials: "LA", color: "bg-orange-500" }
const AQ: TeamMember = { name: "Abdulrahman Al-Qahtani", initials: "AQ", color: "bg-rose-500"   }

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIATIVES: Initiative[] = [
  // ── Q2 2026 ──────────────────────────────────────────────────────────────────
  {
    id: "i1",
    title: "Analytics Dashboard v3",
    description: "Real-time data, custom widgets, and advanced filtering for power users.",
    overview: "A ground-up redesign of our core reporting surface targeting a 40% reduction in time-to-insight for power users. The initiative introduces real-time data pipelines, a customizable widget system, and a new advanced filtering engine.",
    businessGoal: "Increase weekly active usage of the analytics surface by 35% and reduce time-to-insight for power users by 40%.",
    successMetrics: [
      "Weekly analytics views increase 35% within 60 days of launch",
      "Average time-to-first-insight decreases from 4.2 min to under 2.5 min",
      "Power user NPS segment improves by 15+ points",
    ],
    dependencies: [
      "Design System 2.0 token updates (parallel track)",
      "Real-time data pipeline — Engineering Platform team",
    ],
    risks: [
      "Real-time pipeline may slip, blocking the custom widget system",
      "Power user testing cycle may require a second design iteration",
    ],
    status: "In Progress",
    priority: "High",
    progress: 68,
    quarter: "Q2 2026",
    timeline: { start: "Apr 1, 2026", end: "Jul 15, 2026" },
    owner: SQ,
    linkedProject: "Analytics Dashboard v3",
    activity: [
      { id: "a1", actor: "Shahad Qumosani", action: "moved initiative to In Progress",          time: "Apr 3, 2026"  },
      { id: "a2", actor: "Rayan Al-Omari",  action: "completed component library update",       time: "May 15, 2026" },
      { id: "a3", actor: "AI",              action: "flagged widget system as at risk",          time: "Jun 2, 2026",  ai: true },
      { id: "a4", actor: "Shahad Qumosani", action: "updated progress to 68%",                  time: "Jun 20, 2026" },
    ],
    aiRecommendation: "On track and well-scoped. The custom widget system is the highest-risk sub-feature — consider shipping the core dashboard first and treating widgets as a v3.1 follow-on. This reduces sprint scope and de-risks the Q2 deadline without sacrificing the headline metric.",
  },
  {
    id: "i2",
    title: "Mobile Onboarding Redesign",
    description: "Address the 67% step-2 drop-off with progressive disclosure and soft-ask notification patterns.",
    overview: "A redesign of the mobile onboarding flow to recover the 67% step-2 drop-off rate. The initiative introduces soft-ask screens, progressive feature disclosure, and two A/B tested copy variants, targeting an activation rate recovery from 33% to over 70%.",
    businessGoal: "Recover mobile activation rate from 33% to over 70% within 60 days of launch, directly improving new user LTV.",
    successMetrics: [
      "Step-2 drop-off rate reduces from 67% to under 30%",
      "D1 mobile retention improves by 15 percentage points",
      "App Store rating improves from 4.1 to 4.5 or above",
    ],
    dependencies: [
      "Mobile analytics instrumentation for A/B test measurement",
      "Push notification service update — Infrastructure team",
    ],
    risks: [
      "A/B test instrumentation may not be ready in time to measure the launch cohort",
      "iOS App Store review cycle could delay launch past the Q2 deadline",
    ],
    status: "In Progress",
    priority: "High",
    progress: 34,
    quarter: "Q2 2026",
    timeline: { start: "May 12, 2026", end: "Jun 30, 2026" },
    owner: LA,
    linkedProject: "Mobile Onboarding Redesign",
    activity: [
      { id: "a1", actor: "Lina Alamri", action: "kicked off the initiative",                time: "May 12, 2026" },
      { id: "a2", actor: "AI",          action: "flagged iOS review cycle as a risk",       time: "May 28, 2026", ai: true },
      { id: "a3", actor: "Lina Alamri", action: "flagged iOS implementation as blocked",    time: "Jun 10, 2026" },
    ],
    aiRecommendation: "At risk due to the iOS implementation delay. Resolve the A/B test instrumentation dependency before sprint kickoff. Consider splitting the measurement acceptance criterion into a follow-on task to unblock the core flow from shipping before the Q2 deadline.",
  },
  {
    id: "i3",
    title: "CSV Export Feature",
    description: "One-click export of any filtered data view to CSV with column selection and UTF-8 encoding.",
    overview: "Implementation of a one-click CSV export available on all filtered table views. The feature respects active filters, allows column selection before download, and outputs clean UTF-8 encoded data — eliminating the leading support request category.",
    businessGoal: "Eliminate manual data extraction support requests and unblock users who rely on external analysis workflows in Excel and Google Sheets.",
    successMetrics: [
      "34% of active users exported within the first week ✓",
      "Support tickets for data export reduced by 80% ✓",
      "Feature satisfaction rated 4.6/5 in post-launch survey ✓",
    ],
    dependencies: [],
    risks: [],
    status: "Shipped",
    priority: "Medium",
    progress: 100,
    quarter: "Q2 2026",
    timeline: { start: "Jun 2, 2026", end: "Jun 20, 2026" },
    owner: FS,
    linkedProject: "CSV Export Feature",
    activity: [
      { id: "a1", actor: "Faisal Al-Sudairy", action: "shipped to production",                           time: "Jun 20, 2026" },
      { id: "a2", actor: "Shahad Qumosani",   action: "marked initiative as Shipped",                    time: "Jun 20, 2026" },
      { id: "a3", actor: "AI",                action: "noted strong adoption — 34% of users exported",   time: "Jun 27, 2026", ai: true },
    ],
    aiRecommendation: "Shipped successfully with strong adoption — 34% of active users exported in week one, well above the 15% benchmark for new utility features. Consider scheduled exports as a follow-on initiative for power users who need recurring data extracts without manual intervention.",
  },

  // ── Q3 2026 ──────────────────────────────────────────────────────────────────
  {
    id: "i4",
    title: "AI Workspace Improvements",
    description: "Collaborative artifact editing, improved context management, and task-to-artifact traceability.",
    overview: "A second-generation update to the AI Workspace introducing collaborative artifact editing, improved LLM context management, and a traceability layer linking AI-generated artifacts back to their source tasks. This initiative targets PM adoption as the default workflow for spec generation.",
    businessGoal: "Increase AI Workspace monthly active users by 50% and establish it as the default spec-generation workflow for 80% of active PM workspaces.",
    successMetrics: [
      "AI Workspace MAU increases 50% within 90 days of launch",
      "Spec generation time decreases from ~2 hours to under 30 minutes",
      "PM adoption rate reaches 80% of active workspaces within one quarter",
    ],
    dependencies: [
      "LLM API cost optimization — required before expanding context windows",
      "Artifact storage service — Engineering Platform team",
    ],
    risks: [
      "LLM inference costs may constrain context window expansion without pricing model changes",
      "Collaborative editing requires real-time infrastructure not yet available",
    ],
    status: "Planned",
    priority: "High",
    progress: 5,
    quarter: "Q3 2026",
    timeline: { start: "Jul 1, 2026", end: "Sep 15, 2026" },
    owner: SQ,
    linkedProject: "Analytics Dashboard v3",
    activity: [
      { id: "a1", actor: "Shahad Qumosani", action: "created this initiative",                         time: "Jun 14, 2026" },
      { id: "a2", actor: "AI",              action: "identified LLM cost as a blocking dependency",    time: "Jun 15, 2026", ai: true },
    ],
    aiRecommendation: "High potential but two unresolved blockers. Treat the LLM cost optimization as a prerequisite track starting now. Scope collaborative editing more narrowly for the first iteration — shared view-only access rather than real-time co-editing reduces the infrastructure dependency significantly.",
  },
  {
    id: "i5",
    title: "API v2 Migration",
    description: "Deprecate v1 endpoints and migrate all consumers to the new RESTful API with OAuth 2.0.",
    overview: "Full deprecation of the v1 API surface and migration of all internal and external consumers to v2 with OAuth 2.0, improved rate limiting, and structured error responses. This is a prerequisite for Customer Portal Phase 2 and Enterprise Permissions.",
    businessGoal: "Eliminate v1 technical debt, enable new enterprise integrations, and unblock the Feature Flags and Enterprise Permissions initiatives planned for Q4.",
    successMetrics: [
      "100% of internal consumers migrated to v2 endpoints",
      "v1 endpoints deprecated with a formal 90-day external consumer notice",
      "v2 API error rate below 0.1% at general availability",
    ],
    dependencies: [
      "Auth service refactor — currently delayed, revised estimate mid-July",
    ],
    risks: [
      "Auth service delay risks slipping the Q3 target by 4–6 weeks",
      "External consumers may require extended support beyond the 90-day deprecation window",
    ],
    status: "In Progress",
    priority: "High",
    progress: 45,
    quarter: "Q3 2026",
    timeline: { start: "Mar 15, 2026", end: "Jul 31, 2026" },
    owner: AQ,
    linkedProject: "API v2 Migration",
    activity: [
      { id: "a1", actor: "Abdulrahman Al-Qahtani", action: "completed v2 API spec",                            time: "Apr 1, 2026"  },
      { id: "a2", actor: "Abdulrahman Al-Qahtani", action: "completed auth service integration",               time: "May 1, 2026"  },
      { id: "a3", actor: "AI",                     action: "flagged auth service delay as a timeline risk",    time: "Jun 5, 2026",  ai: true },
      { id: "a4", actor: "Abdulrahman Al-Qahtani", action: "escalated auth service dependency as a blocker",   time: "Jun 22, 2026" },
    ],
    aiRecommendation: "Q3 target is achievable if the auth service refactor resolves by mid-July. Issue the v1 deprecation notice as soon as v2 reaches feature-complete — this starts the external consumer clock regardless of internal migration progress and creates a forcing function for stragglers.",
  },
  {
    id: "i6",
    title: "Customer Portal Phase 2",
    description: "Billing management, usage-based alerting, and self-service SSO configuration for enterprise accounts.",
    overview: "Expansion of the Customer Portal to cover billing management, usage-based alerting, and a self-service SSO configuration flow for enterprise accounts. Phase 2 targets the two remaining enterprise onboarding pain points: billing setup time and manual SSO provisioning.",
    businessGoal: "Reduce enterprise onboarding time from 3 weeks to under 5 days and eliminate manual billing support requests entirely.",
    successMetrics: [
      "Enterprise onboarding time reduces from 21 days to under 5 business days",
      "Billing-related support tickets reduce by 70%",
      "Self-service SSO setup completion rate exceeds 85%",
    ],
    dependencies: [
      "API v2 Migration — SSO configuration requires new OAuth 2.0 auth endpoints",
      "Enterprise Permissions — billing visibility depends on the new permission model",
    ],
    risks: [
      "Double dependency on API v2 and Enterprise Permissions creates a compounded late-Q3 risk",
      "SSO configuration complexity varies significantly across enterprise IdP implementations",
    ],
    status: "Planned",
    priority: "Medium",
    progress: 0,
    quarter: "Q3 2026",
    timeline: { start: "Aug 1, 2026", end: "Sep 30, 2026" },
    owner: LA,
    linkedProject: "Customer Portal MVP",
    activity: [
      { id: "a1", actor: "Lina Alamri", action: "created initiative based on enterprise feedback",     time: "Jun 10, 2026" },
      { id: "a2", actor: "AI",          action: "identified double dependency as a late-Q3 risk",      time: "Jun 12, 2026", ai: true },
    ],
    aiRecommendation: "Two upstream dependencies — API v2 and Enterprise Permissions — both carry schedule risk. Treat billing management as a standalone track to ship early value, decoupled from the SSO work. Billing is lower-dependency and directly addresses the top enterprise onboarding complaint.",
  },

  // ── Q4 2026 ──────────────────────────────────────────────────────────────────
  {
    id: "i7",
    title: "Design System 2.0",
    description: "Unified component library, token audit, Figma-to-code pipeline, and Storybook documentation.",
    overview: "A unified component library with a full token audit, a Figma-to-code pipeline via Tokens Studio, and a comprehensive Storybook documentation site. Design System 2.0 establishes a single source of truth for components, tokens, and accessibility standards across all product surfaces.",
    businessGoal: "Reduce frontend development time by 30%, eliminate UI inconsistencies across product surfaces, and achieve WCAG 2.1 AA compliance across all core components.",
    successMetrics: [
      "All product surfaces migrated to v2 design tokens",
      "Frontend PR cycle time decreases by 30%",
      "Storybook achieves 100% core component coverage",
      "WCAG 2.1 AA compliance across all UI components",
    ],
    dependencies: [
      "Token audit completion — in progress with Design team",
      "Figma library update — Design team milestone",
    ],
    risks: [
      "14-week scope carries significant underestimation risk across all product surfaces",
      "Dark mode implementation may conflict with the current token architecture",
    ],
    status: "Planned",
    priority: "Medium",
    progress: 12,
    quarter: "Q4 2026",
    timeline: { start: "Jun 16, 2026", end: "Sep 30, 2026" },
    owner: RA,
    linkedProject: "Design System 2.0",
    activity: [
      { id: "a1", actor: "Rayan Al-Omari", action: "started token audit phase",                      time: "Jun 16, 2026" },
      { id: "a2", actor: "AI",             action: "flagged 14-week scope as underestimation risk",   time: "Jun 18, 2026", ai: true },
    ],
    aiRecommendation: "The all-at-once 14-week scope is high risk. Recommend phasing: ship core tokens and primitive components in Q4, then migrate product surfaces in Q1 2027. Attempting full surface migration in one quarter risks degrading team velocity and introducing regressions across multiple products simultaneously.",
  },
  {
    id: "i8",
    title: "Enterprise Permissions",
    description: "Granular role-based access control, custom permission sets, and admin audit visibility.",
    overview: "A granular permission system replacing the current Admin/Member binary with custom role definitions, per-feature visibility controls, and a permissions audit view. Enterprise Permissions is a direct blocker for several active enterprise sales opportunities.",
    businessGoal: "Unlock enterprise deals blocked by the lack of granular permissions, targeting $2M+ in pipeline conversion within 60 days of launch.",
    successMetrics: [
      "Custom permission sets available for all workspace roles",
      "3+ blocked enterprise deals convert within 60 days of launch",
      "100% of permission changes visible in the audit log",
    ],
    dependencies: [
      "API v2 Migration — permission endpoints require v2 infrastructure",
      "Customer Portal Phase 2 — permission UI shares portal infrastructure",
    ],
    risks: [
      "Permission model complexity may require a second engineering design review cycle",
      "Downstream impact on existing integrations is not fully mapped",
    ],
    status: "Planned",
    priority: "High",
    progress: 0,
    quarter: "Q4 2026",
    timeline: { start: "Oct 1, 2026", end: "Nov 30, 2026" },
    owner: AQ,
    linkedProject: "Customer Portal MVP",
    activity: [
      { id: "a1", actor: "Shahad Qumosani",        action: "added to Q4 roadmap based on sales input",   time: "Jun 5, 2026"  },
      { id: "a2", actor: "Abdulrahman Al-Qahtani", action: "began data model design",                    time: "Jun 20, 2026" },
    ],
    aiRecommendation: "Revenue-critical but dependent on two Q3 initiatives. Start the permission data model design now — in parallel with API v2 — so engineering can begin implementation immediately when dependencies clear. This is a well-understood problem space; the primary risk is schedule, not technical uncertainty.",
  },

  // ── Future ────────────────────────────────────────────────────────────────────
  {
    id: "i9",
    title: "AI Sprint Planning",
    description: "AI-assisted sprint composition using backlog analysis, velocity data, and dependency graphs.",
    overview: "An AI-assisted sprint planning tool that analyzes backlog health, historical team velocity, and dependency graphs to recommend optimal sprint compositions. The tool aims to reduce planning overhead and improve sprint predictability across all product teams.",
    businessGoal: "Reduce sprint planning time by 50% and improve sprint completion rate from 72% to over 85% through AI-assisted scope optimization.",
    successMetrics: [
      "Sprint planning meeting time reduces from 2 hours to under 1 hour on average",
      "Sprint completion rate improves from 72% to 85%+",
      "AI sprint recommendations accepted >60% of the time after 3-sprint calibration",
    ],
    dependencies: [
      "AI Workspace Improvements — sprint planning is built on AI Workspace infrastructure",
      "Backlog data model stabilization",
      "Historical velocity data pipeline — Data Engineering team",
    ],
    risks: [
      "AI recommendation quality is highly dependent on backlog data quality",
      "PM trust in AI recommendations requires multiple calibration sprint cycles",
    ],
    status: "Exploring",
    priority: "High",
    progress: 0,
    quarter: "Future",
    timeline: { start: "Q1 2027", end: "Q2 2027" },
    owner: SQ,
    linkedProject: "Analytics Dashboard v3",
    activity: [
      { id: "a1", actor: "Shahad Qumosani", action: "added to Future roadmap for exploration",    time: "Jun 1, 2026"  },
      { id: "a2", actor: "AI",              action: "generated an initial scope proposal",         time: "Jun 3, 2026",  ai: true },
    ],
    aiRecommendation: "High long-term value but three upstream dependencies. Start with a lightweight version — AI-generated sprint briefs based on backlog priority scores — before building the full recommendation engine. This delivers early value and builds PM trust iteratively without requiring the velocity data pipeline.",
  },
  {
    id: "i10",
    title: "Feature Flags Dashboard",
    description: "Centralized UI for managing feature flags across environments, workspaces, and user segments.",
    overview: "A centralized feature flag management UI enabling Product and Engineering to collaborate on gradual rollouts, per-segment toggles, and environment overrides without code deployments. Reduces deployment risk and enables faster, controlled experimentation cycles.",
    businessGoal: "Enable zero-downtime feature rollouts and reduce production incidents related to broad releases by 40% through controlled, flag-based deployments.",
    successMetrics: [
      "100% of new feature launches use flag-controlled rollout strategies",
      "Production incidents related to broad releases reduce by 40%",
      "Flag change cycle time drops from days to under 10 minutes",
    ],
    dependencies: [
      "API v2 Migration — flag management API requires v2 infrastructure",
      "Engineering platform team buy-in and long-term ownership",
    ],
    risks: [
      "Build vs. buy decision not yet finalized — LaunchDarkly and Statsig remain alternatives",
      "Without engineering platform team ownership, long-term adoption will be limited",
    ],
    status: "Exploring",
    priority: "Medium",
    progress: 0,
    quarter: "Future",
    timeline: { start: "Q2 2027", end: "Q3 2027" },
    owner: RA,
    linkedProject: "API v2 Migration",
    activity: [
      { id: "a1", actor: "Rayan Al-Omari", action: "opened RFC for build vs. buy evaluation",          time: "Jun 15, 2026" },
      { id: "a2", actor: "AI",             action: "analyzed alternatives: LaunchDarkly, Statsig, Unleash", time: "Jun 16, 2026", ai: true },
    ],
    aiRecommendation: "Resolve build vs. buy before any engineering investment. LaunchDarkly's startup tier covers current needs at low cost with minimal setup time. If building in-house, scope strictly to flag CRUD with audit logging — avoid building an analytics layer until adoption is proven.",
  },
]

// ─── Filter Select ────────────────────────────────────────────────────────────

function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-[9px] border border-border bg-card py-2 pl-3 pr-8 text-[13px] text-foreground focus:border-primary/30 focus:outline-none transition-colors duration-150 cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

// ─── Initiative Card ──────────────────────────────────────────────────────────

function InitiativeCard({
  initiative,
  index,
  onClick,
  isSelected,
}: {
  initiative: Initiative
  index: number
  onClick: () => void
  isSelected: boolean
}) {
  const sc = statusConfig[initiative.status]
  const pc = priorityConfig[initiative.priority]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" as const }}
      whileHover={{ y: -2, transition: { duration: 0.15, ease: "easeOut" } }}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col rounded-[14px] border border-border bg-card cursor-pointer overflow-hidden",
        "shadow-[0_1px_4px_oklch(0_0_0/0.05)]",
        "hover:shadow-[0_6px_24px_oklch(0_0_0/0.1)] hover:border-primary/20",
        "transition-shadow transition-[border-color] duration-200",
        isSelected && "ring-2 ring-primary/30 border-primary/25 bg-primary/[0.025]"
      )}
    >
      {/* Status accent strip */}
      <div className={cn("h-[3px] w-full shrink-0", sc.accentBg)} />

      <div className="flex flex-col gap-4 p-5">
        {/* Title + status badge */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[14px] font-semibold text-foreground leading-snug">{initiative.title}</h3>
          <span
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium",
              sc.bg, sc.text, sc.border
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", sc.dot)} />
            {initiative.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-[12.5px] text-muted-foreground leading-snug line-clamp-2 -mt-1">
          {initiative.description}
        </p>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-muted-foreground/55">Progress</span>
            <span className="text-[12px] font-semibold text-foreground">{initiative.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${initiative.progress}%` }}
              transition={{ delay: index * 0.05 + 0.18, duration: 0.55, ease: "easeOut" as const }}
              className={cn("h-full rounded-full", sc.progressColor)}
            />
          </div>
        </div>

        {/* Footer: priority + linked project + owner */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={cn("h-2 w-2 rounded-full shrink-0", pc.dot)} />
              <span className={cn("text-[11.5px] font-medium", pc.label)}>{initiative.priority}</span>
            </div>
            <span className="text-muted-foreground/30 text-[11px]">·</span>
            <div className="flex items-center gap-1 text-muted-foreground/50 min-w-0">
              <FolderKanban className="h-3 w-3 shrink-0" strokeWidth={1.7} />
              <span className="text-[11.5px] truncate max-w-[110px]">{initiative.linkedProject}</span>
            </div>
          </div>
          <div
            title={initiative.owner.name}
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white",
              initiative.owner.color
            )}
          >
            {initiative.owner.initials}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Initiative Drawer ────────────────────────────────────────────────────────

function InitiativeDrawer({
  initiative,
  onClose,
}: {
  initiative: Initiative
  onClose: () => void
}) {
  const sc = statusConfig[initiative.status]
  const pc = priorityConfig[initiative.priority]
  const qc = quarterConfig[initiative.quarter]

  return (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 280 }}
      className="fixed right-0 top-14 z-50 flex h-[calc(100vh-3.5rem)] w-[490px] flex-col border-l border-border bg-background shadow-[-6px_0_28px_oklch(0_0_0/0.08)]"
    >
      {/* Header */}
      <div className="shrink-0 border-b border-border px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                  sc.bg, sc.text, sc.border
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", sc.dot)} />
                {initiative.status}
              </span>
              <span
                className={cn(
                  "inline-flex items-center rounded-[6px] border px-2 py-0.5 text-[10px] font-semibold",
                  qc.badgeBg, qc.badgeText, qc.badgeBorder
                )}
              >
                {initiative.quarter}
              </span>
            </div>
            <h2 className="text-[16px] font-semibold text-foreground leading-snug">{initiative.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

        {/* Overview */}
        <section>
          <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
            Overview
          </p>
          <p className="text-[13px] text-foreground/80 leading-relaxed">{initiative.overview}</p>
        </section>

        {/* Business Goal */}
        <section>
          <div className="mb-2 flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-primary/60" strokeWidth={1.7} />
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Business Goal
            </p>
          </div>
          <p className="text-[13px] text-foreground/80 leading-relaxed">{initiative.businessGoal}</p>
        </section>

        {/* Success Metrics */}
        <section>
          <div className="mb-3 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-primary/60" strokeWidth={1.7} />
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Success Metrics
            </p>
          </div>
          <div className="space-y-2">
            {initiative.successMetrics.map((metric, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-[9px] border border-border bg-muted/30 px-3.5 py-2.5"
              >
                <div className="mt-[5px] h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                <p className="text-[12.5px] text-foreground/80 leading-snug">{metric}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Metadata grid */}
        <section className="grid grid-cols-2 gap-3">
          {/* Related Project */}
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Related Project
            </p>
            <div className="flex items-center gap-1.5">
              <FolderKanban className="h-3.5 w-3.5 shrink-0 text-primary/60" strokeWidth={1.7} />
              <span className="text-[12.5px] font-medium text-foreground truncate">{initiative.linkedProject}</span>
            </div>
          </div>

          {/* Owner */}
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Owner
            </p>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white",
                  initiative.owner.color
                )}
              >
                {initiative.owner.initials}
              </div>
              <span className="text-[12.5px] font-medium text-foreground truncate">{initiative.owner.name}</span>
            </div>
          </div>

          {/* Target Quarter */}
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Target Quarter
            </p>
            <p className="text-[12.5px] font-medium text-foreground">{initiative.quarter}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground/55">{qc.sub}</p>
          </div>

          {/* Priority */}
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Priority
            </p>
            <div className="flex items-center gap-1.5">
              <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", pc.dot)} />
              <span className={cn("text-[13px] font-semibold", pc.label)}>{initiative.priority}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="col-span-2 rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Timeline
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 shrink-0 text-muted-foreground/50" strokeWidth={1.7} />
                <span className="text-[12.5px] font-medium text-foreground">{initiative.timeline.start}</span>
              </div>
              <div className="flex-1 flex items-center gap-1.5">
                <div className="flex-1 h-px bg-border" />
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 shrink-0" />
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12.5px] font-medium text-foreground">{initiative.timeline.end}</span>
                <Calendar className="h-3 w-3 shrink-0 text-muted-foreground/50" strokeWidth={1.7} />
              </div>
            </div>
          </div>
        </section>

        {/* Dependencies */}
        {initiative.dependencies.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5 text-blue-500/70" strokeWidth={1.7} />
              <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
                Dependencies
              </p>
            </div>
            <div className="space-y-2">
              {initiative.dependencies.map((dep, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-[9px] border border-blue-200/60 bg-blue-50/50 px-3.5 py-2.5"
                >
                  <div className="mt-[5px] h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                  <p className="text-[12.5px] text-foreground/80 leading-snug">{dep}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Risks */}
        {initiative.risks.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.7} />
              <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
                Risks
              </p>
            </div>
            <div className="space-y-2">
              {initiative.risks.map((risk, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-[9px] border border-amber-200/60 bg-amber-50/50 px-3.5 py-2.5"
                >
                  <div className="mt-[5px] h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                  <p className="text-[12.5px] text-foreground/80 leading-snug">{risk}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AI Recommendation */}
        <section>
          <div className="rounded-[12px] border border-primary/25 bg-primary/[0.04] p-4">
            <div className="mb-2.5 flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                <Sparkles className="h-3 w-3 text-primary" strokeWidth={2} />
              </div>
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-primary/80">
                AI Recommendation
              </span>
            </div>
            <p className="text-[12.5px] leading-relaxed text-foreground/75 italic">
              {initiative.aiRecommendation}
            </p>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
            Recent Activity
          </p>
          <div className="space-y-4">
            {initiative.activity.map((entry) => (
              <div key={entry.id} className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[7.5px] font-bold",
                    entry.ai ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                  )}
                >
                  {entry.ai ? (
                    <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
                  ) : (
                    entry.actor.split(" ").map((n) => n[0]).join("").slice(0, 2)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] text-foreground/80 leading-snug">
                    <span className={cn("font-semibold", entry.ai ? "text-primary" : "text-foreground")}>
                      {entry.ai ? "ProductPilot AI" : entry.actor}
                    </span>
                    {" "}{entry.action}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-muted-foreground/45">{entry.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="h-2" />
      </div>
    </motion.aside>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RoadmapPage() {
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null)
  const [searchQuery, setSearchQuery]               = useState("")
  const [statusFilter, setStatusFilter]             = useState("All")
  const [quarterFilter, setQuarterFilter]           = useState("All")

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedInitiative(null)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const filteredInitiatives = useMemo(() => {
    let result = [...INITIATIVES]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.linkedProject.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== "All") {
      result = result.filter((i) => i.status === statusFilter)
    }

    if (quarterFilter !== "All") {
      result = result.filter((i) => i.quarter === quarterFilter)
    }

    return result
  }, [searchQuery, statusFilter, quarterFilter])

  const groupedByQuarter = useMemo(
    () =>
      QUARTERS.map((quarter) => ({
        quarter,
        qc: quarterConfig[quarter],
        initiatives: filteredInitiatives.filter((i) => i.quarter === quarter),
      })).filter((group) => group.initiatives.length > 0),
    [filteredInitiatives]
  )

  const isFiltered = searchQuery || statusFilter !== "All" || quarterFilter !== "All"

  return (
    <div className="space-y-7">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground leading-none mb-2">
            Roadmap
          </h1>
          <p className="text-[13.5px] text-muted-foreground">
            Plan product strategy, communicate priorities, and track upcoming initiatives.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="flex min-w-[200px] items-center gap-2 rounded-[9px] border border-border bg-card px-3 h-9 focus-within:border-primary/30 transition-colors duration-150">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search initiatives..."
              className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/55 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <FilterSelect value={statusFilter} onChange={setStatusFilter}>
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Planned">Planned</option>
            <option value="Exploring">Exploring</option>
            <option value="Shipped">Shipped</option>
            <option value="Paused">Paused</option>
          </FilterSelect>

          {/* Quarter filter */}
          <FilterSelect value={quarterFilter} onChange={setQuarterFilter}>
            <option value="All">All Quarters</option>
            <option value="Q2 2026">Q2 2026</option>
            <option value="Q3 2026">Q3 2026</option>
            <option value="Q4 2026">Q4 2026</option>
            <option value="Future">Future</option>
          </FilterSelect>
        </div>
      </div>

      {/* ── Count + clear ── */}
      <div className="flex items-center gap-2.5 -mt-3">
        <span className="text-[13px] text-muted-foreground">
          {filteredInitiatives.length}{" "}
          {filteredInitiatives.length === 1 ? "initiative" : "initiatives"}
        </span>
        {isFiltered && (
          <button
            onClick={() => {
              setSearchQuery("")
              setStatusFilter("All")
              setQuarterFilter("All")
            }}
            className="text-[12.5px] text-primary hover:underline transition-colors duration-150"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Grouped roadmap ── */}
      {groupedByQuarter.length > 0 ? (
        <div className="space-y-12">
          {groupedByQuarter.map(({ quarter, qc, initiatives }) => (
            <section key={quarter}>
              {/* Section header */}
              <div className="mb-5 flex items-center gap-4">
                <div className="flex items-baseline gap-2.5">
                  <span
                    className={cn(
                      "rounded-[7px] border px-2.5 py-1 text-[12px] font-semibold",
                      qc.badgeBg, qc.badgeText, qc.badgeBorder
                    )}
                  >
                    {quarter}
                  </span>
                  <span className="text-[12px] text-muted-foreground/55">{qc.sub}</span>
                </div>
                <div className="flex-1 h-px bg-border/70" />
                <span className="text-[12px] text-muted-foreground/55 shrink-0">
                  {initiatives.length}{" "}
                  {initiatives.length === 1 ? "initiative" : "initiatives"}
                </span>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {initiatives.map((initiative, i) => (
                  <InitiativeCard
                    key={initiative.id}
                    initiative={initiative}
                    index={i}
                    onClick={() =>
                      setSelectedInitiative((prev) =>
                        prev?.id === initiative.id ? null : initiative
                      )
                    }
                    isSelected={selectedInitiative?.id === initiative.id}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Search className="h-5 w-5 text-muted-foreground/50" />
          </div>
          <p className="mb-1 text-[14px] font-medium text-muted-foreground">No initiatives found</p>
          <p className="text-[13px] text-muted-foreground/60">
            Try adjusting your search or filters.
          </p>
        </motion.div>
      )}

      {/* ── Drawer ── */}
      <AnimatePresence>
        {selectedInitiative && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-foreground/[0.04]"
              onClick={() => setSelectedInitiative(null)}
            />
            <InitiativeDrawer
              key={selectedInitiative.id}
              initiative={selectedInitiative}
              onClose={() => setSelectedInitiative(null)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
