"use client"

import React, { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  Clock,
  FileText,
  FolderKanban,
  ListTodo,
  Search,
  Star,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type DocStatus   = "Published" | "Draft" | "Archived"
type DocCategory = "PRD" | "Spec" | "Release Notes" | "Guide" | "Research" | "Meeting Notes" | "Planning"
type FileType    = "PDF" | "DOC" | "MD"

interface DocOwner {
  name: string
  initials: string
  color: string
}

interface DocActivity {
  id: string
  actor: string
  action: string
  time: string
}

interface Document {
  id: string
  title: string
  description: string
  summary: string
  category: DocCategory
  status: DocStatus
  fileType: FileType
  lastUpdated: string
  owner: DocOwner
  linkedProject: string
  linkedTasks: string[]
  activity: DocActivity[]
}

// ─── Config ───────────────────────────────────────────────────────────────────

const statusConfig: Record<
  DocStatus,
  { dot: string; bg: string; text: string; border: string }
> = {
  Published: { dot: "bg-emerald-500", bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200/70" },
  Draft:     { dot: "bg-amber-500",   bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-200/70"   },
  Archived:  { dot: "bg-slate-400",   bg: "bg-slate-50",    text: "text-slate-600",   border: "border-slate-200/70"   },
}

const categoryConfig: Record<
  DocCategory,
  { bg: string; text: string; border: string; accentBg: string }
> = {
  "PRD":           { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200/70",  accentBg: "bg-violet-400"  },
  "Spec":          { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200/70",    accentBg: "bg-blue-400"    },
  "Release Notes": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/70", accentBg: "bg-emerald-400" },
  "Guide":         { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200/70",   accentBg: "bg-amber-400"   },
  "Research":      { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200/70",    accentBg: "bg-rose-400"    },
  "Meeting Notes": { bg: "bg-slate-50",   text: "text-slate-600",   border: "border-slate-200/70",   accentBg: "bg-slate-300"   },
  "Planning":      { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200/70",  accentBg: "bg-orange-400"  },
}

const fileTypeConfig: Record<FileType, { bg: string; text: string }> = {
  PDF: { bg: "bg-red-100",   text: "text-red-700"   },
  DOC: { bg: "bg-blue-100",  text: "text-blue-700"  },
  MD:  { bg: "bg-slate-100", text: "text-slate-600" },
}

const ALL_CATEGORIES: DocCategory[] = ["PRD", "Spec", "Release Notes", "Guide", "Research", "Meeting Notes", "Planning"]

// ─── Team members ─────────────────────────────────────────────────────────────

const SQ: DocOwner = { name: "Shahad Qumosani",        initials: "SQ", color: "bg-violet-500" }
const RA: DocOwner = { name: "Rayan Al-Omari",         initials: "RA", color: "bg-blue-500"   }
const SA: DocOwner = { name: "Sara Attar",             initials: "SA", color: "bg-teal-500"   }
const FS: DocOwner = { name: "Faisal Al-Sudairy",      initials: "FS", color: "bg-amber-500"  }
const LA: DocOwner = { name: "Lina Alamri",            initials: "LA", color: "bg-orange-500" }
const AQ: DocOwner = { name: "Abdulrahman Al-Qahtani", initials: "AQ", color: "bg-rose-500"   }

// ─── Mock data ────────────────────────────────────────────────────────────────

const DOCUMENTS: Document[] = [
  {
    id: "d1",
    title: "PRD — Analytics Dashboard v3",
    description: "Full product requirements for the Analytics Dashboard v3 redesign, including real-time data, custom widgets, and advanced filtering.",
    summary: "This PRD covers the complete scope of the Analytics Dashboard v3 initiative. It defines the problem statement (40% of power users report time-to-insight as their top pain point), success criteria, user stories, edge cases, and acceptance criteria for each major feature area. Includes references to supporting Figma designs and Q1 user research.",
    category: "PRD",
    status: "Published",
    fileType: "DOC",
    lastUpdated: "Jun 18, 2026",
    owner: SQ,
    linkedProject: "Analytics Dashboard v3",
    linkedTasks: ["Export Dashboard to PDF", "Mobile Analytics", "User Permissions v2"],
    activity: [
      { id: "a1", actor: "Shahad Qumosani", action: "published this document",           time: "Jun 18, 2026" },
      { id: "a2", actor: "Rayan Al-Omari",  action: "added acceptance criteria section", time: "Jun 15, 2026" },
      { id: "a3", actor: "Sara Attar",      action: "reviewed Figma design references",  time: "Jun 12, 2026" },
    ],
  },
  {
    id: "d2",
    title: "CSV Export Specification",
    description: "Technical specification for the one-click CSV export feature, covering filter handling, column selection, and UTF-8 encoding.",
    summary: "Technical specification covering the implementation requirements for CSV export across all filterable table views. Includes the expected output format (UTF-8 with BOM for Excel compatibility), column selection UX, filter propagation rules, and error handling for large datasets. Links to the backend schema for the export job queue.",
    category: "Spec",
    status: "Published",
    fileType: "MD",
    lastUpdated: "Jun 2, 2026",
    owner: FS,
    linkedProject: "CSV Export Feature",
    linkedTasks: ["CSV Export Feature", "API Rate Limiting"],
    activity: [
      { id: "a1", actor: "Faisal Al-Sudairy", action: "published this spec",          time: "Jun 2, 2026"  },
      { id: "a2", actor: "Shahad Qumosani",   action: "approved and signed off",      time: "Jun 1, 2026"  },
      { id: "a3", actor: "Rayan Al-Omari",    action: "added encoding requirements",  time: "May 28, 2026" },
    ],
  },
  {
    id: "d3",
    title: "Release Notes v2.1",
    description: "Official release notes for ProductPilot v2.1, covering CSV export, API rate limiting, and team member invites.",
    summary: "Release notes for the v2.1 product update shipped in Sprint 10. Covers three major features: CSV Export (one-click data extraction), API Rate Limiting (per-endpoint limits with configurable thresholds), and Team Member Invites (email-based invite flow with role pre-assignment). Includes known issues and workarounds.",
    category: "Release Notes",
    status: "Published",
    fileType: "MD",
    lastUpdated: "Jun 20, 2026",
    owner: SQ,
    linkedProject: "CSV Export Feature",
    linkedTasks: ["CSV Export Feature", "API Rate Limiting", "Team Member Invites"],
    activity: [
      { id: "a1", actor: "Shahad Qumosani",   action: "published release notes",      time: "Jun 20, 2026" },
      { id: "a2", actor: "Faisal Al-Sudairy", action: "reviewed technical accuracy",  time: "Jun 19, 2026" },
    ],
  },
  {
    id: "d4",
    title: "API Integration Guide",
    description: "Developer guide for integrating with the ProductPilot REST API v2, including OAuth 2.0, rate limits, and example requests.",
    summary: "End-to-end developer guide for the ProductPilot API v2. Covers authentication flows (OAuth 2.0 and API key), endpoint reference, rate limit headers, pagination patterns, webhook setup, and a quickstart tutorial with code examples in JavaScript, Python, and cURL. Intended for both internal teams and external integration partners.",
    category: "Guide",
    status: "Published",
    fileType: "MD",
    lastUpdated: "May 15, 2026",
    owner: RA,
    linkedProject: "API v2 Migration",
    linkedTasks: ["API Rate Limiting", "User Permissions v2"],
    activity: [
      { id: "a1", actor: "Rayan Al-Omari",         action: "published the guide",         time: "May 15, 2026" },
      { id: "a2", actor: "Abdulrahman Al-Qahtani", action: "added OAuth 2.0 section",     time: "May 10, 2026" },
      { id: "a3", actor: "Rayan Al-Omari",         action: "added Python code examples",  time: "May 8, 2026"  },
    ],
  },
  {
    id: "d5",
    title: "Design System 2.0 Guidelines",
    description: "Component usage guidelines, design token documentation, and contribution process for Design System 2.0.",
    summary: "Comprehensive usage guidelines for Design System 2.0, covering token naming conventions, component composition patterns, accessibility requirements, and the contribution process for new components. Includes a migration guide from v1 tokens to the new oklch-based color palette and a compatibility matrix for existing surfaces.",
    category: "Guide",
    status: "Draft",
    fileType: "DOC",
    lastUpdated: "Jun 21, 2026",
    owner: RA,
    linkedProject: "Design System 2.0",
    linkedTasks: ["Design System 2.0", "Add Dark Mode"],
    activity: [
      { id: "a1", actor: "Rayan Al-Omari", action: "created draft",                       time: "Jun 21, 2026" },
      { id: "a2", actor: "Sara Attar",     action: "added component composition section", time: "Jun 20, 2026" },
    ],
  },
  {
    id: "d6",
    title: "Q2 User Research Summary",
    description: "Summary of 12 user interviews covering analytics workflows, export needs, and mobile onboarding friction.",
    summary: "Summary of 12 in-depth user interviews conducted between April and May 2026. Key findings: 67% of mobile users drop off at the permissions step, 42% cite CSV export as their top missing feature, and power users average 4.2 minutes time-to-first-insight in the current analytics dashboard. Includes full affinity map and interview transcripts in the appendix.",
    category: "Research",
    status: "Published",
    fileType: "PDF",
    lastUpdated: "May 30, 2026",
    owner: SA,
    linkedProject: "Mobile Onboarding Redesign",
    linkedTasks: ["Improve Onboarding Completion", "Mobile Analytics"],
    activity: [
      { id: "a1", actor: "Sara Attar",      action: "published research summary",      time: "May 30, 2026" },
      { id: "a2", actor: "Shahad Qumosani", action: "reviewed and shared with team",   time: "Jun 1, 2026"  },
      { id: "a3", actor: "Lina Alamri",     action: "linked to onboarding initiative", time: "Jun 3, 2026"  },
    ],
  },
  {
    id: "d7",
    title: "Design Sync — Jun 18 Notes",
    description: "Meeting notes from the June 18 design sync covering Analytics Dashboard v3 components and Design System 2.0 token progress.",
    summary: "Notes from the June 18 design sync. Key decisions: (1) Widget cards will use 12px corner radius consistent with the card system. (2) Dark mode token work deferred to Q4 to avoid blocking the v3 launch. (3) Sara to produce three animation options for the progress bar micro-interaction by June 23. Action items listed in the appendix.",
    category: "Meeting Notes",
    status: "Published",
    fileType: "MD",
    lastUpdated: "Jun 18, 2026",
    owner: LA,
    linkedProject: "Design System 2.0",
    linkedTasks: ["Design System 2.0", "Add Dark Mode"],
    activity: [
      { id: "a1", actor: "Lina Alamri", action: "published meeting notes",     time: "Jun 18, 2026" },
      { id: "a2", actor: "Sara Attar",  action: "added action items section",  time: "Jun 19, 2026" },
    ],
  },
  {
    id: "d8",
    title: "Sprint 11 Planning Document",
    description: "Sprint 11 scope, capacity, goals, and risk register for the two-week sprint beginning June 16.",
    summary: "Sprint 11 planning document for the sprint beginning June 16. Committed scope: Improve Onboarding Completion (13 pts) and Audit Logs (8 pts), totalling 21 of 24 available points. Key risk: iOS implementation delay may cause the Onboarding task to roll over. Stretch goal: begin User Permissions v2 data model design.",
    category: "Planning",
    status: "Published",
    fileType: "DOC",
    lastUpdated: "Jun 16, 2026",
    owner: SQ,
    linkedProject: "Mobile Onboarding Redesign",
    linkedTasks: ["Improve Onboarding Completion", "Audit Logs"],
    activity: [
      { id: "a1", actor: "Shahad Qumosani",   action: "published sprint plan",       time: "Jun 16, 2026" },
      { id: "a2", actor: "Faisal Al-Sudairy", action: "confirmed capacity estimate", time: "Jun 15, 2026" },
    ],
  },
  {
    id: "d9",
    title: "Mobile Onboarding Flow",
    description: "Annotated specification for the redesigned mobile onboarding flow, including soft-ask patterns and A/B test copy variants.",
    summary: "Detailed specification for the mobile onboarding redesign. Covers the full 5-step flow with annotated wireframes, the soft-ask notification permission pattern, progressive disclosure rules, and two A/B tested copy variants (Value-First vs. Trust-First). Includes edge cases for system-level permission denial and the rollback flag behavior.",
    category: "Spec",
    status: "Draft",
    fileType: "PDF",
    lastUpdated: "Jun 16, 2026",
    owner: LA,
    linkedProject: "Mobile Onboarding Redesign",
    linkedTasks: ["Improve Onboarding Completion"],
    activity: [
      { id: "a1", actor: "Lina Alamri", action: "created draft",                   time: "Jun 12, 2026" },
      { id: "a2", actor: "Sara Attar",  action: "added wireframe annotations",      time: "Jun 14, 2026" },
      { id: "a3", actor: "Lina Alamri", action: "added A/B test copy variants",    time: "Jun 16, 2026" },
    ],
  },
  {
    id: "d10",
    title: "Enterprise Permission Matrix",
    description: "Role-to-feature permission mapping for the Enterprise Permissions initiative, covering all workspace roles and access levels.",
    summary: "Comprehensive permission matrix covering all workspace roles (Owner, Admin, Member, Viewer, Custom) mapped against every product feature and action. Used as the engineering source of truth for the Enterprise Permissions implementation. Includes the custom role builder UX rules and the migration path for existing Admin/Member accounts.",
    category: "Spec",
    status: "Draft",
    fileType: "DOC",
    lastUpdated: "Jun 21, 2026",
    owner: AQ,
    linkedProject: "Customer Portal MVP",
    linkedTasks: ["User Permissions v2", "Audit Logs"],
    activity: [
      { id: "a1", actor: "Abdulrahman Al-Qahtani", action: "created the permission matrix", time: "Jun 20, 2026" },
      { id: "a2", actor: "Shahad Qumosani",        action: "reviewed custom role section",  time: "Jun 21, 2026" },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Document Card ────────────────────────────────────────────────────────────

function DocumentCard({
  doc,
  index,
  isFavorited,
  onToggleFavorite,
  onClick,
  isSelected,
}: {
  doc: Document
  index: number
  isFavorited: boolean
  onToggleFavorite: (e: React.MouseEvent) => void
  onClick: () => void
  isSelected: boolean
}) {
  const sc = statusConfig[doc.status]
  const cc = categoryConfig[doc.category]
  const fc = fileTypeConfig[doc.fileType]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.28, ease: "easeOut" as const }}
      whileHover={{ y: -2, transition: { duration: 0.14, ease: "easeOut" } }}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col rounded-[14px] border border-border bg-card cursor-pointer overflow-hidden",
        "shadow-[0_1px_4px_oklch(0_0_0/0.05)]",
        "hover:shadow-[0_6px_24px_oklch(0_0_0/0.1)] hover:border-primary/20",
        "transition-shadow transition-[border-color] duration-200",
        isSelected && "ring-2 ring-primary/30 border-primary/25 bg-primary/[0.025]"
      )}
    >
      {/* Category accent strip */}
      <div className={cn("h-[3px] w-full shrink-0", cc.accentBg)} />

      <div className="flex flex-col gap-3.5 p-5">
        {/* Title row + file type badge */}
        <div className="flex items-start gap-2">
          <h3 className="flex-1 text-[14px] font-semibold text-foreground leading-snug">{doc.title}</h3>
          <span className={cn("shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide", fc.bg, fc.text)}>
            {doc.fileType}
          </span>
        </div>

        {/* Description */}
        <p className="text-[12.5px] text-muted-foreground leading-snug line-clamp-2 -mt-1">
          {doc.description}
        </p>

        {/* Status + category chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium",
              sc.bg, sc.text, sc.border
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", sc.dot)} />
            {doc.status}
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
              cc.bg, cc.text, cc.border
            )}
          >
            {doc.category}
          </span>
        </div>

        {/* Footer: owner + date + star */}
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <div
              title={doc.owner.name}
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white",
                doc.owner.color
              )}
            >
              {doc.owner.initials}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground/50 min-w-0">
              <Clock className="h-3 w-3 shrink-0" strokeWidth={1.7} />
              <span className="text-[11px] truncate">{doc.lastUpdated}</span>
            </div>
          </div>
          <button
            onClick={onToggleFavorite}
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] transition-colors duration-150",
              isFavorited
                ? "text-amber-500 hover:text-amber-400"
                : "text-muted-foreground/30 hover:text-amber-400 opacity-0 group-hover:opacity-100"
            )}
          >
            <Star className="h-3.5 w-3.5" fill={isFavorited ? "currentColor" : "none"} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Document Drawer ──────────────────────────────────────────────────────────

function DocumentDrawer({ doc, onClose }: { doc: Document; onClose: () => void }) {
  const sc = statusConfig[doc.status]
  const cc = categoryConfig[doc.category]
  const fc = fileTypeConfig[doc.fileType]

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
                {doc.status}
              </span>
              <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", cc.bg, cc.text, cc.border)}>
                {doc.category}
              </span>
              <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide", fc.bg, fc.text)}>
                {doc.fileType}
              </span>
            </div>
            <h2 className="text-[16px] font-semibold text-foreground leading-snug">{doc.title}</h2>
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

        {/* Summary */}
        <section>
          <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
            Summary
          </p>
          <p className="text-[13px] text-foreground/80 leading-relaxed">{doc.summary}</p>
        </section>

        {/* Metadata grid */}
        <section className="grid grid-cols-2 gap-3">
          {/* Owner */}
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">Owner</p>
            <div className="flex items-center gap-2">
              <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white", doc.owner.color)}>
                {doc.owner.initials}
              </div>
              <span className="text-[12.5px] font-medium text-foreground truncate">{doc.owner.name}</span>
            </div>
          </div>

          {/* Last updated */}
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">Last Updated</p>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" strokeWidth={1.7} />
              <span className="text-[12.5px] font-medium text-foreground">{doc.lastUpdated}</span>
            </div>
          </div>

          {/* Related project */}
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">Related Project</p>
            <div className="flex items-center gap-1.5">
              <FolderKanban className="h-3.5 w-3.5 shrink-0 text-primary/60" strokeWidth={1.7} />
              <span className="text-[12.5px] font-medium text-foreground truncate">{doc.linkedProject}</span>
            </div>
          </div>

          {/* File type */}
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">File Type</p>
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" strokeWidth={1.7} />
              <span className={cn("rounded-md px-1.5 py-0.5 text-[11px] font-bold tracking-wide", fc.bg, fc.text)}>
                {doc.fileType}
              </span>
            </div>
          </div>
        </section>

        {/* Linked tasks */}
        <section>
          <div className="mb-3 flex items-center gap-1.5">
            <ListTodo className="h-3.5 w-3.5 text-primary/60" strokeWidth={1.7} />
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">Linked Tasks</p>
          </div>
          <div className="space-y-2">
            {doc.linkedTasks.map((task, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-[9px] border border-border bg-muted/30 px-3.5 py-2.5"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                <p className="text-[12.5px] text-foreground/80">{task}</p>
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
            {doc.activity.map((entry) => (
              <div key={entry.id} className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[7.5px] font-bold text-muted-foreground">
                  {entry.actor.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] text-foreground/80 leading-snug">
                    <span className="font-semibold text-foreground">{entry.actor}</span>
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

export default function DocumentsPage() {
  const [selectedDoc, setSelectedDoc]       = useState<Document | null>(null)
  const [searchQuery, setSearchQuery]       = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [sortBy, setSortBy]                 = useState("updated")
  const [favoritedIds, setFavoritedIds]     = useState<Set<string>>(new Set(["d1", "d6"]))

  const filteredDocs = useMemo(() => {
    let result = [...DOCUMENTS]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.owner.name.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      )
    }

    if (categoryFilter !== "All") {
      result = result.filter((d) => d.category === categoryFilter)
    }

    if (sortBy === "name")    result.sort((a, b) => a.title.localeCompare(b.title))
    if (sortBy === "updated") result.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    if (sortBy === "owner")   result.sort((a, b) => a.owner.name.localeCompare(b.owner.name))
    if (sortBy === "category") result.sort((a, b) => a.category.localeCompare(b.category))
    if (sortBy === "favorites") {
      result.sort((a, b) => {
        const af = favoritedIds.has(a.id) ? 0 : 1
        const bf = favoritedIds.has(b.id) ? 0 : 1
        return af - bf
      })
    }

    return result
  }, [searchQuery, categoryFilter, sortBy, favoritedIds])

  const isFiltered = searchQuery || categoryFilter !== "All"

  function toggleFavorite(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    setFavoritedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-7">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground leading-none mb-2">
            Documents
          </h1>
          <p className="text-[13.5px] text-muted-foreground">
            Central knowledge base for product specs, research, and planning.
          </p>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="flex min-w-[220px] items-center gap-2 rounded-[9px] border border-border bg-card px-3 h-9 focus-within:border-primary/30 transition-colors duration-150">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
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

        {/* Category filter */}
        <FilterSelect value={categoryFilter} onChange={setCategoryFilter}>
          <option value="All">All Categories</option>
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </FilterSelect>

        {/* Sort */}
        <div className="ml-auto">
          <FilterSelect value={sortBy} onChange={setSortBy}>
            <option value="updated">Sort: Most Recent</option>
            <option value="name">Sort: Name A–Z</option>
            <option value="category">Sort: Category</option>
            <option value="owner">Sort: Owner</option>
            <option value="favorites">Sort: Favorites First</option>
          </FilterSelect>
        </div>
      </div>

      {/* ── Count + clear ── */}
      <div className="flex items-center gap-2.5 -mt-3">
        <span className="text-[13px] text-muted-foreground">
          {filteredDocs.length} {filteredDocs.length === 1 ? "document" : "documents"}
        </span>
        {isFiltered && (
          <button
            onClick={() => { setSearchQuery(""); setCategoryFilter("All") }}
            className="text-[12.5px] text-primary hover:underline transition-colors duration-150"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredDocs.map((doc, i) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              index={i}
              isFavorited={favoritedIds.has(doc.id)}
              onToggleFavorite={(e) => toggleFavorite(e, doc.id)}
              onClick={() => setSelectedDoc((prev) => (prev?.id === doc.id ? null : doc))}
              isSelected={selectedDoc?.id === doc.id}
            />
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
          <p className="mb-1 text-[14px] font-medium text-muted-foreground">No documents found</p>
          <p className="text-[13px] text-muted-foreground/60">Try adjusting your search or category filter.</p>
        </motion.div>
      )}

      {/* ── Drawer ── */}
      <AnimatePresence>
        {selectedDoc && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-foreground/[0.04]"
              onClick={() => setSelectedDoc(null)}
            />
            <DocumentDrawer
              key={selectedDoc.id}
              doc={selectedDoc}
              onClose={() => setSelectedDoc(null)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
