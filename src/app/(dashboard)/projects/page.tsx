"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Filter,
  Plus,
  Search,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectStatus = "On Track" | "At Risk" | "Delayed" | "Completed" | "Planning"
type ProjectPriority = "High" | "Medium" | "Low"

interface TeamMember {
  name: string
  initials: string
  color: string
}

interface Milestone {
  id: string
  title: string
  date: string
  completed: boolean
}

interface ActivityItem {
  id: string
  actor: string
  action: string
  target: string
  time: string
}

interface Project {
  id: string
  name: string
  description: string
  overview: string
  status: ProjectStatus
  priority: ProjectPriority
  progress: number
  dueDate: string
  startDate: string
  owner: TeamMember
  team: TeamMember[]
  tags: string[]
  milestones: Milestone[]
  activity: ActivityItem[]
}

// ─── Config ───────────────────────────────────────────────────────────────────

const statusConfig: Record<
  ProjectStatus,
  { dot: string; bg: string; text: string; border: string; accentBg: string; progressColor: string }
> = {
  "On Track":  { dot: "bg-emerald-500", bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200/70", accentBg: "bg-emerald-400", progressColor: "bg-emerald-500" },
  "At Risk":   { dot: "bg-amber-500",   bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-200/70",   accentBg: "bg-amber-400",   progressColor: "bg-amber-500"   },
  "Delayed":   { dot: "bg-red-500",     bg: "bg-red-50",      text: "text-red-700",     border: "border-red-200/70",     accentBg: "bg-red-400",     progressColor: "bg-red-500"     },
  "Completed": { dot: "bg-primary",     bg: "bg-primary/10",  text: "text-primary",     border: "border-primary/20",     accentBg: "bg-primary",     progressColor: "bg-primary"     },
  "Planning":  { dot: "bg-slate-400",   bg: "bg-slate-50",    text: "text-slate-600",   border: "border-slate-200/70",   accentBg: "bg-slate-300",   progressColor: "bg-slate-400"   },
}

const priorityConfig: Record<ProjectPriority, { dot: string; label: string }> = {
  High:   { dot: "bg-red-500",     label: "text-red-600"     },
  Medium: { dot: "bg-amber-500",   label: "text-amber-600"   },
  Low:    { dot: "bg-emerald-500", label: "text-emerald-600" },
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Analytics Dashboard v3",
    description: "Complete redesign with real-time data, custom widgets, and advanced filtering for power users.",
    overview: "A ground-up redesign of our core reporting surface. The goal is to reduce time-to-insight for power users by 40% through real-time data pipelines, a customizable widget system, and a new advanced filtering engine. This is our highest-priority product initiative for Q2.",
    status: "On Track",
    priority: "High",
    progress: 68,
    dueDate: "Jul 15, 2026",
    startDate: "Apr 1, 2026",
    owner: { name: "Shahad Qumosani",        initials: "SQ", color: "bg-violet-500" },
    team: [
      { name: "Shahad Qumosani",        initials: "SQ", color: "bg-violet-500"  },
      { name: "Rayan Al-Omari",         initials: "RA", color: "bg-blue-500"    },
      { name: "Sara Attar",             initials: "SA", color: "bg-emerald-500" },
      { name: "Faisal Al-Sudairy",      initials: "FS", color: "bg-amber-500"   },
    ],
    tags: ["Analytics", "Frontend"],
    milestones: [
      { id: "m1", title: "Design system audit complete", date: "Apr 20, 2026", completed: true  },
      { id: "m2", title: "Component library updated",    date: "May 15, 2026", completed: true  },
      { id: "m3", title: "Beta launch to 10% of users", date: "Jun 30, 2026", completed: false },
      { id: "m4", title: "General availability release", date: "Jul 15, 2026", completed: false },
    ],
    activity: [
      { id: "a1", actor: "Shahad Qumosani",   action: "moved",        target: "Beta launch milestone to In Review", time: "2h ago"    },
      { id: "a2", actor: "Rayan Al-Omari",    action: "commented on", target: "Filter architecture PR",             time: "5h ago"    },
      { id: "a3", actor: "Sara Attar",        action: "completed",    target: "Custom widget API",                  time: "Yesterday" },
    ],
  },
  {
    id: "p2",
    name: "Mobile Onboarding Redesign",
    description: "Reduce 67% step-2 drop-off with a soft-ask notification flow and progressive feature disclosure.",
    overview: "Our mobile onboarding has a critical 67% drop-off at the notification permissions step. This project introduces a soft-ask screen pattern, progressive disclosure, and A/B tested copy. Target: recover activation rate from 33% to over 70% within 60 days of launch.",
    status: "At Risk",
    priority: "High",
    progress: 34,
    dueDate: "Jun 28, 2026",
    startDate: "May 12, 2026",
    owner: { name: "Lina Alamri",   initials: "LA", color: "bg-amber-500" },
    team: [
      { name: "Lina Alamri",          initials: "LA", color: "bg-amber-500" },
      { name: "Rayan Al-Omari",       initials: "RA", color: "bg-blue-500"  },
      { name: "Abdulrahman Al-Qahtani", initials: "AQ", color: "bg-rose-500"  },
    ],
    tags: ["Mobile", "Growth"],
    milestones: [
      { id: "m1", title: "User research & interviews", date: "May 22, 2026", completed: true  },
      { id: "m2", title: "Figma prototype complete",   date: "Jun 5, 2026",  completed: true  },
      { id: "m3", title: "iOS implementation done",    date: "Jun 20, 2026", completed: false },
      { id: "m4", title: "A/B test launched",          date: "Jun 28, 2026", completed: false },
    ],
    activity: [
      { id: "a1", actor: "Lina Alamri",            action: "flagged",   target: "iOS implementation as blocked",  time: "3h ago"     },
      { id: "a2", actor: "Abdulrahman Al-Qahtani", action: "updated",   target: "Figma prototype — iteration 3",  time: "Yesterday"  },
      { id: "a3", actor: "Rayan Al-Omari",         action: "opened",    target: "PR: Soft-ask screen component",  time: "2 days ago" },
    ],
  },
  {
    id: "p3",
    name: "CSV Export Feature",
    description: "Export any dashboard view to CSV with one click, respecting all active filters.",
    overview: "CSV export is our most-requested feature over the last two quarters, appearing in 38% of sales calls. The implementation preserves active filters on download. Engineering estimated 2 weeks of low-risk work. Target launch before the Q2 close.",
    status: "On Track",
    priority: "Medium",
    progress: 82,
    dueDate: "Jun 20, 2026",
    startDate: "Jun 2, 2026",
    owner: { name: "Faisal Al-Sudairy", initials: "FS", color: "bg-emerald-500" },
    team: [
      { name: "Faisal Al-Sudairy", initials: "FS", color: "bg-emerald-500" },
      { name: "Shahad Qumosani",   initials: "SQ", color: "bg-violet-500"  },
    ],
    tags: ["Feature", "Quick Win"],
    milestones: [
      { id: "m1", title: "Backend export endpoint live", date: "Jun 9, 2026",  completed: true  },
      { id: "m2", title: "UI implementation complete",   date: "Jun 14, 2026", completed: true  },
      { id: "m3", title: "QA sign-off",                  date: "Jun 18, 2026", completed: false },
      { id: "m4", title: "Production release",            date: "Jun 20, 2026", completed: false },
    ],
    activity: [
      { id: "a1", actor: "Faisal Al-Sudairy", action: "completed", target: "UI implementation",       time: "Today"      },
      { id: "a2", actor: "Shahad Qumosani",   action: "reviewed",  target: "Export filter logic PR",  time: "Yesterday"  },
      { id: "a3", actor: "Faisal Al-Sudairy", action: "merged",    target: "Backend export endpoint", time: "3 days ago" },
    ],
  },
  {
    id: "p4",
    name: "Design System 2.0",
    description: "Unified component library, updated tokens, Figma-to-code pipeline, and comprehensive documentation.",
    overview: "Design System 2.0 establishes a single source of truth for components, tokens, and documentation. The initiative includes a full token audit, a Figma-to-code pipeline via Tokens Studio, and a Storybook documentation site. Estimated 14-week effort spanning Q3.",
    status: "Planning",
    priority: "Medium",
    progress: 12,
    dueDate: "Sep 30, 2026",
    startDate: "Jun 16, 2026",
    owner: { name: "Rayan Al-Omari",  initials: "RA", color: "bg-blue-500" },
    team: [
      { name: "Rayan Al-Omari",         initials: "RA", color: "bg-blue-500"   },
      { name: "Lina Alamri",            initials: "LA", color: "bg-amber-500"  },
      { name: "Abdulrahman Al-Qahtani", initials: "AQ", color: "bg-rose-500"   },
      { name: "Shahad Qumosani",        initials: "SQ", color: "bg-violet-500" },
    ],
    tags: ["Infrastructure", "Design"],
    milestones: [
      { id: "m1", title: "Token audit & inventory",    date: "Jul 4, 2026",  completed: false },
      { id: "m2", title: "Core components migrated",   date: "Aug 1, 2026",  completed: false },
      { id: "m3", title: "Storybook site launched",    date: "Sep 1, 2026",  completed: false },
      { id: "m4", title: "Full handoff to all teams",  date: "Sep 30, 2026", completed: false },
    ],
    activity: [
      { id: "a1", actor: "Rayan Al-Omari",  action: "created", target: "Design System 2.0 project",     time: "2 days ago" },
      { id: "a2", actor: "Lina Alamri",     action: "added",   target: "5 components to the backlog",   time: "2 days ago" },
      { id: "a3", actor: "Rayan Al-Omari",  action: "shared",  target: "Q3 kickoff deck with the team", time: "3 days ago" },
    ],
  },
  {
    id: "p5",
    name: "API v2 Migration",
    description: "Deprecate v1 endpoints and migrate all internal consumers to the new RESTful API with OAuth 2.0.",
    overview: "API v2 replaces the legacy v1 surface with a clean RESTful design, OAuth 2.0 authentication, and improved rate limiting. Currently delayed due to an unexpected dependency on the auth service refactor. Revised estimate: mid-July.",
    status: "Delayed",
    priority: "High",
    progress: 45,
    dueDate: "Jun 1, 2026",
    startDate: "Mar 15, 2026",
    owner: { name: "Abdulrahman Al-Qahtani", initials: "AQ", color: "bg-rose-500" },
    team: [
      { name: "Abdulrahman Al-Qahtani", initials: "AQ", color: "bg-rose-500"   },
      { name: "Faisal Al-Sudairy",      initials: "FS", color: "bg-emerald-500"},
      { name: "Rayan Al-Omari",         initials: "RA", color: "bg-blue-500"   },
    ],
    tags: ["API", "Infrastructure"],
    milestones: [
      { id: "m1", title: "v2 API spec finalized",        date: "Apr 1, 2026",  completed: true  },
      { id: "m2", title: "Auth service integration",     date: "May 1, 2026",  completed: true  },
      { id: "m3", title: "Internal consumer migration",  date: "May 20, 2026", completed: false },
      { id: "m4", title: "v1 deprecation notice sent",  date: "Jun 1, 2026",  completed: false },
    ],
    activity: [
      { id: "a1", actor: "Abdulrahman Al-Qahtani", action: "escalated", target: "auth service dependency as blocker",  time: "1 day ago"  },
      { id: "a2", actor: "Faisal Al-Sudairy",      action: "updated",   target: "revised migration timeline estimate", time: "2 days ago" },
      { id: "a3", actor: "Rayan Al-Omari",         action: "commented", target: "OAuth scope implementation PR",       time: "3 days ago" },
    ],
  },
  {
    id: "p6",
    name: "Customer Portal MVP",
    description: "Self-service portal for enterprise accounts to manage billing, seats, and usage analytics.",
    overview: "The Customer Portal MVP launched ahead of schedule in Q1, giving enterprise accounts a self-service surface for billing, user management, and usage analytics. Currently in a 30-day post-launch observation period with NPS of 72 before moving to phase 2.",
    status: "Completed",
    priority: "Low",
    progress: 100,
    dueDate: "May 31, 2026",
    startDate: "Feb 1, 2026",
    owner: { name: "Lina Alamri",        initials: "LA", color: "bg-amber-500" },
    team: [
      { name: "Lina Alamri",          initials: "LA", color: "bg-amber-500"  },
      { name: "Reem Al-Harbi",        initials: "RH", color: "bg-rose-500"   },
      { name: "Shahad Qumosani",      initials: "SQ", color: "bg-violet-500" },
    ],
    tags: ["Enterprise", "Portal"],
    milestones: [
      { id: "m1", title: "Requirements locked",           date: "Feb 15, 2026", completed: true },
      { id: "m2", title: "Alpha with 3 pilot accounts",  date: "Apr 1, 2026",  completed: true },
      { id: "m3", title: "Beta launch",                  date: "May 10, 2026", completed: true },
      { id: "m4", title: "General availability",         date: "May 31, 2026", completed: true },
    ],
    activity: [
      { id: "a1", actor: "Lina Alamri",   action: "marked",   target: "project as Completed",         time: "3 weeks ago" },
      { id: "a2", actor: "Shahad Qumosani", action: "shared", target: "post-launch report with team", time: "3 weeks ago" },
      { id: "a3", actor: "Reem Al-Harbi", action: "resolved", target: "last outstanding bug report",  time: "4 weeks ago" },
    ],
  },
]

const ALL_MEMBERS = Array.from(new Set(PROJECTS.flatMap((p) => p.team.map((m) => m.name))))

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
  onClick,
  isSelected,
}: {
  project: Project
  index: number
  onClick: () => void
  isSelected: boolean
}) {
  const sc = statusConfig[project.status]
  const pc = priorityConfig[project.priority]
  const visibleTeam = project.team.slice(0, 3)
  const extraTeam = project.team.length - 3

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
        "transition-shadow transition-border duration-200",
        isSelected && "ring-2 ring-primary/30 border-primary/25 bg-primary/[0.025]"
      )}
    >
      {/* Status accent strip */}
      <div className={cn("h-[3px] w-full shrink-0", sc.accentBg)} />

      <div className="flex flex-col gap-4 p-5">
        {/* Name + status */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[14px] font-semibold text-foreground leading-snug">{project.name}</h3>
          <span
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium",
              sc.bg, sc.text, sc.border
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", sc.dot)} />
            {project.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-[12.5px] text-muted-foreground leading-snug line-clamp-2 -mt-1">
          {project.description}
        </p>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-muted-foreground/55">Progress</span>
            <span className="text-[12px] font-semibold text-foreground">{project.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ delay: index * 0.05 + 0.18, duration: 0.55, ease: "easeOut" }}
              className={cn("h-full rounded-full", sc.progressColor)}
            />
          </div>
        </div>

        {/* Priority + due date */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full shrink-0", pc.dot)} />
            <span className={cn("text-[11.5px] font-medium", pc.label)}>{project.priority}</span>
          </div>
          <span className="text-muted-foreground/30 text-[11px]">·</span>
          <div className="flex items-center gap-1 text-muted-foreground/55">
            <Calendar className="h-3 w-3" strokeWidth={1.7} />
            <span className="text-[11.5px]">{project.dueDate}</span>
          </div>
        </div>

        {/* Team avatars + tag */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {visibleTeam.map((member, i) => (
              <div
                key={member.name}
                title={member.name}
                style={{ zIndex: visibleTeam.length - i }}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 border-card text-[9px] font-bold text-white shrink-0",
                  member.color,
                  i > 0 && "-ml-2"
                )}
              >
                {member.initials}
              </div>
            ))}
            {extraTeam > 0 && (
              <div className="-ml-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[9px] font-semibold text-muted-foreground shrink-0">
                +{extraTeam}
              </div>
            )}
          </div>

          {project.tags[0] && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {project.tags[0]}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Project Drawer ───────────────────────────────────────────────────────────

function ProjectDrawer({ project, onClose }: { project: Project; onClose: () => void }) {
  const sc = statusConfig[project.status]
  const pc = priorityConfig[project.priority]
  const completedMilestones = project.milestones.filter((m) => m.completed).length

  return (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 280 }}
      className="fixed right-0 top-14 z-50 flex h-[calc(100vh-3.5rem)] w-[470px] flex-col border-l border-border bg-background shadow-[-6px_0_28px_oklch(0_0_0/0.08)]"
    >
      {/* Header */}
      <div className="shrink-0 border-b border-border px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <span
              className={cn(
                "mb-2 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                sc.bg, sc.text, sc.border
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", sc.dot)} />
              {project.status}
            </span>
            <h2 className="text-[16px] font-semibold text-foreground leading-snug">{project.name}</h2>
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
      <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 space-y-6">

        {/* Overview */}
        <section>
          <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
            Overview
          </p>
          <p className="text-[13px] text-foreground/80 leading-relaxed">{project.overview}</p>
        </section>

        {/* Metadata grid */}
        <section className="grid grid-cols-2 gap-3">
          {/* Owner */}
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Owner
            </p>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white",
                  project.owner.color
                )}
              >
                {project.owner.initials}
              </div>
              <span className="text-[12.5px] font-medium text-foreground truncate">
                {project.owner.name}
              </span>
            </div>
          </div>

          {/* Priority */}
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Priority
            </p>
            <div className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full shrink-0", pc.dot)} />
              <span className={cn("text-[13px] font-semibold", pc.label)}>{project.priority}</span>
            </div>
          </div>

          {/* Start date */}
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Start Date
            </p>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3 w-3 shrink-0" strokeWidth={1.7} />
              <span className="text-[12.5px] font-medium text-foreground">{project.startDate}</span>
            </div>
          </div>

          {/* Due date */}
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Due Date
            </p>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 shrink-0 text-muted-foreground" strokeWidth={1.7} />
              <span className="text-[12.5px] font-medium text-foreground">{project.dueDate}</span>
            </div>
          </div>
        </section>

        {/* Team */}
        <section>
          <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
            Team
          </p>
          <div className="space-y-2.5">
            {project.team.map((member) => (
              <div key={member.name} className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
                    member.color
                  )}
                >
                  {member.initials}
                </div>
                <div>
                  <p className="text-[12.5px] font-medium text-foreground leading-none">
                    {member.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/55">
                    {member.name === project.owner.name ? "Owner" : "Contributor"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Progress */}
        <section>
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Progress
            </p>
            <span className="text-[13px] font-semibold text-foreground">{project.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              style={{ width: `${project.progress}%` }}
              className={cn("h-full rounded-full transition-all duration-700", sc.progressColor)}
            />
          </div>
        </section>

        {/* Milestones */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Milestones
            </p>
            <span className="text-[11px] text-muted-foreground/55">
              {completedMilestones} / {project.milestones.length} complete
            </span>
          </div>
          <div className="space-y-2">
            {project.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={cn(
                  "flex items-start gap-3 rounded-[9px] border px-3.5 py-3",
                  milestone.completed
                    ? "border-emerald-200/60 bg-emerald-50/50"
                    : "border-border bg-muted/30"
                )}
              >
                {milestone.completed ? (
                  <CheckCircle2
                    className="mt-[1px] h-4 w-4 shrink-0 text-emerald-500"
                    strokeWidth={1.85}
                  />
                ) : (
                  <Circle
                    className="mt-[1px] h-4 w-4 shrink-0 text-muted-foreground/35"
                    strokeWidth={1.7}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-[12.5px] font-medium leading-none",
                      milestone.completed ? "text-muted-foreground/65" : "text-foreground"
                    )}
                  >
                    {milestone.title}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground/50">{milestone.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent activity */}
        <section>
          <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
            Recent Activity
          </p>
          <div className="space-y-4">
            {project.activity.map((item) => (
              <div key={item.id} className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
                  <span className="text-[8px] font-semibold text-muted-foreground">
                    {item.actor.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] text-foreground/80 leading-snug">
                    <span className="font-semibold text-foreground">{item.actor}</span>
                    {" "}{item.action}{" "}
                    <span className="text-muted-foreground/80">{item.target}</span>
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-muted-foreground/45">{item.time}</p>
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

// ─── New Project Modal ────────────────────────────────────────────────────────

const OWNER_DEFAULT: TeamMember = { name: "Shahad Qumosani", initials: "SQ", color: "bg-violet-500" }

function NewProjectModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (project: Project) => void
}) {
  const [name, setName]           = useState("")
  const [description, setDesc]    = useState("")
  const [priority, setPriority]   = useState<ProjectPriority>("Medium")
  const [status, setStatus]       = useState<ProjectStatus>("Planning")
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameRef.current?.focus()
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  function handleCreate() {
    const trimmed = name.trim()
    if (!trimmed) { nameRef.current?.focus(); return }
    const id = `new-${Date.now()}`
    onCreate({
      id,
      name: trimmed,
      description: description.trim() || "No description provided.",
      overview: description.trim() || "No description provided.",
      status,
      priority,
      progress: 0,
      dueDate: "No due date",
      startDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      owner: OWNER_DEFAULT,
      team: [OWNER_DEFAULT],
      tags: ["General"],
      milestones: [],
      activity: [
        { id: "a1", actor: OWNER_DEFAULT.name, action: "created", target: "this project", time: "Just now" },
      ],
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-foreground/[0.08]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ duration: 0.18, ease: "easeOut" as const }}
        className="relative z-10 w-full max-w-[480px] rounded-[16px] border border-border bg-background shadow-[0_20px_60px_oklch(0_0_0/0.14)]"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-[15px] font-semibold text-foreground">New Project</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-[7px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal body */}
        <div className="space-y-4 px-6 py-5">
          {/* Project name */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-foreground">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate() }}
              placeholder="e.g. Customer Onboarding v2"
              className="w-full rounded-[9px] border border-border bg-card px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none transition-colors duration-150"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What is this project about?"
              rows={3}
              className="w-full resize-none rounded-[9px] border border-border bg-card px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none transition-colors duration-150"
            />
          </div>

          {/* Priority + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-foreground">Priority</label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ProjectPriority)}
                  className="w-full appearance-none rounded-[9px] border border-border bg-card py-2 pl-3 pr-8 text-[13px] text-foreground focus:border-primary/40 focus:outline-none transition-colors duration-150 cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-foreground">Status</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full appearance-none rounded-[9px] border border-border bg-card py-2 pl-3 pr-8 text-[13px] text-foreground focus:border-primary/40 focus:outline-none transition-colors duration-150 cursor-pointer"
                >
                  <option value="Planning">Planning</option>
                  <option value="On Track">On Track</option>
                  <option value="At Risk">At Risk</option>
                  <option value="Delayed">Delayed</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Owner (read-only display) */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-foreground">Owner</label>
            <div className="flex items-center gap-2 rounded-[9px] border border-border bg-muted/40 px-3 py-2">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500 text-[8px] font-bold text-white">
                SQ
              </div>
              <span className="text-[13px] text-foreground">Shahad Qumosani</span>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-[9px] border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground hover:bg-muted transition-colors duration-150"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCreate}
            className="rounded-[9px] bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors duration-150"
          >
            Create Project
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Select wrapper ───────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const [projects, setProjects]             = useState<Project[]>(PROJECTS)
  const [searchQuery, setSearchQuery]       = useState("")
  const [statusFilter, setStatusFilter]     = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [memberFilter, setMemberFilter]     = useState("All")
  const [sortBy, setSortBy]                 = useState("name")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showModal, setShowModal]           = useState(false)
  const [toastMsg, setToastMsg]             = useState<string | null>(null)

  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(null), 2500)
    return () => clearTimeout(t)
  }, [toastMsg])

  // Close drawer on Escape (modal handles its own Escape)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showModal) setSelectedProject(null)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [showModal])

  function handleCreateProject(project: Project) {
    setProjects((prev) => [project, ...prev])
    setShowModal(false)
    setToastMsg(null)
    requestAnimationFrame(() => setToastMsg("Project created successfully"))
  }

  const filteredProjects = useMemo(() => {
    let result = [...projects]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (statusFilter !== "All") {
      result = result.filter((p) => p.status === statusFilter)
    }

    if (priorityFilter !== "All") {
      result = result.filter((p) => p.priority === priorityFilter)
    }

    if (memberFilter !== "All") {
      result = result.filter((p) => p.team.some((m) => m.name === memberFilter))
    }

    const priorityOrder: Record<ProjectPriority, number> = { High: 0, Medium: 1, Low: 2 }
    if (sortBy === "name")     result.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === "progress") result.sort((a, b) => b.progress - a.progress)
    if (sortBy === "due")      result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    if (sortBy === "priority") result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

    return result
  }, [projects, searchQuery, statusFilter, priorityFilter, memberFilter, sortBy])

  const isFiltered = searchQuery || statusFilter !== "All" || priorityFilter !== "All" || memberFilter !== "All"

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("All")
    setPriorityFilter("All")
    setMemberFilter("All")
  }

  return (
    <div className="space-y-7">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground leading-none mb-2">
            Projects
          </h1>
          <p className="text-[13.5px] text-muted-foreground">
            Manage products, releases, and delivery progress.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors duration-150"
        >
          <Plus className="h-4 w-4" />
          New Project
        </motion.button>
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="flex min-w-[224px] items-center gap-2 rounded-[9px] border border-border bg-card px-3 h-9 focus-within:border-primary/30 transition-colors duration-150">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
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

        {/* Status */}
        <FilterSelect value={statusFilter} onChange={setStatusFilter}>
          <option value="All">All Statuses</option>
          <option value="On Track">On Track</option>
          <option value="At Risk">At Risk</option>
          <option value="Delayed">Delayed</option>
          <option value="Completed">Completed</option>
          <option value="Planning">Planning</option>
        </FilterSelect>

        {/* Priority */}
        <FilterSelect value={priorityFilter} onChange={setPriorityFilter}>
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </FilterSelect>

        {/* Team member */}
        <FilterSelect value={memberFilter} onChange={setMemberFilter}>
          <option value="All">All Members</option>
          {ALL_MEMBERS.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </FilterSelect>

        {/* Sort — right-aligned */}
        <div className="ml-auto">
          <FilterSelect value={sortBy} onChange={setSortBy}>
            <option value="name">Sort: Name</option>
            <option value="progress">Sort: Progress</option>
            <option value="due">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
          </FilterSelect>
        </div>
      </div>

      {/* ── Count + clear ── */}
      <div className="flex items-center gap-2.5 -mt-3">
        <span className="text-[13px] text-muted-foreground">
          {filteredProjects.length}{" "}
          {filteredProjects.length === 1 ? "project" : "projects"}
        </span>
        {isFiltered && (
          <button
            onClick={clearFilters}
            className="text-[12.5px] text-primary hover:underline transition-colors duration-150"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            onClick={() =>
              setSelectedProject((prev) => (prev?.id === project.id ? null : project))
            }
            isSelected={selectedProject?.id === project.id}
          />
        ))}

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Filter className="h-5 w-5 text-muted-foreground/50" />
            </div>
            <p className="mb-1 text-[14px] font-medium text-muted-foreground">No projects found</p>
            <p className="text-[13px] text-muted-foreground/60">
              Try adjusting your search or filters.
            </p>
          </motion.div>
        )}
      </div>

      {/* ── Drawer ── */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-foreground/[0.04]"
              onClick={() => setSelectedProject(null)}
            />
            <ProjectDrawer
              key={selectedProject.id}
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── New Project Modal ── */}
      <AnimatePresence>
        {showModal && (
          <NewProjectModal
            onClose={() => setShowModal(false)}
            onCreate={handleCreateProject}
          />
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            key={toastMsg}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" as const }}
            className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-[10px] bg-foreground px-4 py-2.5 shadow-[0_4px_20px_oklch(0_0_0/0.22)]"
          >
            <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} />
            <span className="text-[13px] font-medium text-background">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
