"use client"

import React, { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Eye,
  EyeOff,
  FileCode,
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

type PreviewBlock =
  | { type: "h"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; lines: string[] }
  | { type: "divider" }

interface Document {
  id: string
  title: string
  filename: string
  fileSize: string
  description: string
  category: DocCategory
  status: DocStatus
  fileType: FileType
  lastUpdated: string
  owner: DocOwner
  linkedProject: string
  linkedTasks: string[]
  activity: DocActivity[]
  preview: PreviewBlock[]
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
  { bg: string; text: string; border: string }
> = {
  "PRD":           { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200/70"  },
  "Spec":          { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200/70"    },
  "Release Notes": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/70" },
  "Guide":         { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200/70"   },
  "Research":      { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200/70"    },
  "Meeting Notes": { bg: "bg-slate-50",   text: "text-slate-600",   border: "border-slate-200/70"   },
  "Planning":      { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200/70"  },
}

const fileTypeConfig: Record<
  FileType,
  { bg: string; text: string; iconBg: string; iconText: string; ext: string }
> = {
  PDF: { bg: "bg-red-50",    text: "text-red-700",   iconBg: "bg-red-100",   iconText: "text-red-600",   ext: "PDF"  },
  DOC: { bg: "bg-blue-50",   text: "text-blue-700",  iconBg: "bg-blue-100",  iconText: "text-blue-600",  ext: "DOCX" },
  MD:  { bg: "bg-slate-50",  text: "text-slate-600", iconBg: "bg-slate-100", iconText: "text-slate-500", ext: "MD"   },
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
    filename: "PRD-Analytics-Dashboard-v3.docx",
    fileSize: "324 KB",
    description: "Full product requirements for the Analytics Dashboard v3 redesign, including real-time data, custom widgets, and advanced filtering.",
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
    preview: [
      { type: "h", text: "Goal" },
      { type: "p", text: "Redesign the Analytics Dashboard to reduce time-to-insight for power users from 4.2 minutes to under 60 seconds, with real-time data refresh and customisable widget layouts." },
      { type: "h", text: "Problem Statement" },
      { type: "p", text: "40% of power users cite time-to-insight as their top pain point. The current dashboard requires 5–7 manual steps and refreshes only on page load. Mobile users have zero analytics access." },
      { type: "h", text: "Requirements" },
      { type: "ul", items: ["Real-time refresh (30s / 2min / 5min intervals)", "Drag-and-drop widget canvas with saved presets", "8 widget types: Line, Bar, KPI tile, Funnel, Table, Heatmap, Cohort, Custom", "Advanced filtering with date range and segment comparison", "Export to PDF and CSV from any saved view"] },
      { type: "h", text: "Success Metrics" },
      { type: "ul", items: ["Time-to-insight < 60s for 80% of power users", "Dashboard creation rate +35% in 30 days post-launch", "Mobile session share reaches 15% within 60 days"] },
    ],
  },
  {
    id: "d2",
    title: "CSV Export Specification",
    filename: "CSV-Export-Spec-v1.md",
    fileSize: "48 KB",
    description: "Technical specification for the one-click CSV export feature, covering filter handling, column selection, and UTF-8 encoding.",
    category: "Spec",
    status: "Published",
    fileType: "MD",
    lastUpdated: "Jun 2, 2026",
    owner: FS,
    linkedProject: "CSV Export Feature",
    linkedTasks: ["CSV Export Feature", "API Rate Limiting"],
    activity: [
      { id: "a1", actor: "Faisal Al-Sudairy", action: "published this spec",         time: "Jun 2, 2026"  },
      { id: "a2", actor: "Shahad Qumosani",   action: "approved and signed off",     time: "Jun 1, 2026"  },
      { id: "a3", actor: "Rayan Al-Omari",    action: "added encoding requirements", time: "May 28, 2026" },
    ],
    preview: [
      { type: "h", text: "Overview" },
      { type: "p", text: "Defines implementation requirements for one-click CSV export across all filterable table views. The export button appears in the table toolbar and must respect active filter and sort state." },
      { type: "h", text: "Output Format" },
      { type: "ul", items: ["Encoding: UTF-8 with BOM (Excel compatibility)", "Delimiter: comma — no alternate delimiter in v1", "Date format: ISO 8601 (YYYY-MM-DD)", "Empty cells: empty string, not NULL"] },
      { type: "h", text: "Export Endpoint" },
      { type: "code", lines: ["POST /api/v2/export/csv", "Content-Type: application/json", "", "{ \"filters\": { ... }, \"columns\": [...] }"] },
      { type: "h", text: "Error Handling" },
      { type: "ul", items: ["≤ 10k rows: synchronous download", "10k–50k rows: background job + estimated wait", "> 50k rows: async, email notification on complete"] },
    ],
  },
  {
    id: "d3",
    title: "Release Notes v2.1",
    filename: "Release-Notes-v2.1.md",
    fileSize: "32 KB",
    description: "Official release notes for ProductPilot v2.1, covering CSV export, API rate limiting, and team member invites.",
    category: "Release Notes",
    status: "Published",
    fileType: "MD",
    lastUpdated: "Jun 20, 2026",
    owner: SQ,
    linkedProject: "CSV Export Feature",
    linkedTasks: ["CSV Export Feature", "API Rate Limiting", "Team Member Invites"],
    activity: [
      { id: "a1", actor: "Shahad Qumosani",   action: "published release notes",     time: "Jun 20, 2026" },
      { id: "a2", actor: "Faisal Al-Sudairy", action: "reviewed technical accuracy", time: "Jun 19, 2026" },
    ],
    preview: [
      { type: "h", text: "ProductPilot v2.1 — Released Jun 20, 2026" },
      { type: "h", text: "New Features" },
      { type: "ul", items: ["CSV Export — one-click export from any filtered table view, async for large datasets", "API Rate Limiting — per-endpoint limits with X-RateLimit headers; HTTP 429 on breach", "Team Member Invites — email-based invite flow with role pre-assignment, 7-day expiry"] },
      { type: "h", text: "Bug Fixes" },
      { type: "ul", items: ["Backlog column counts incorrect after filtering", "Race condition causing duplicate project cards on creation", "Date sorting inconsistency across timezones"] },
      { type: "h", text: "Known Issues" },
      { type: "ul", items: ["Roadmap CSV missing Timeline column — fix in v2.1.1", "Invite emails may be delayed up to 5 minutes on first send"] },
    ],
  },
  {
    id: "d4",
    title: "API Integration Guide",
    filename: "API-Integration-Guide-v2.md",
    fileSize: "112 KB",
    description: "Developer guide for integrating with the ProductPilot REST API v2, including OAuth 2.0, rate limits, and example requests.",
    category: "Guide",
    status: "Published",
    fileType: "MD",
    lastUpdated: "May 15, 2026",
    owner: RA,
    linkedProject: "API v2 Migration",
    linkedTasks: ["API Rate Limiting", "User Permissions v2"],
    activity: [
      { id: "a1", actor: "Rayan Al-Omari",         action: "published the guide",        time: "May 15, 2026" },
      { id: "a2", actor: "Abdulrahman Al-Qahtani", action: "added OAuth 2.0 section",    time: "May 10, 2026" },
      { id: "a3", actor: "Rayan Al-Omari",         action: "added Python code examples", time: "May 8, 2026"  },
    ],
    preview: [
      { type: "h", text: "Base URL" },
      { type: "code", lines: ["https://api.productpilot.io/v2"] },
      { type: "h", text: "Authentication" },
      { type: "p", text: "Supports OAuth 2.0 (user-delegated) and API Keys (server-to-server). Pass tokens in the Authorization header as Bearer <token>." },
      { type: "h", text: "Key Endpoints" },
      { type: "code", lines: ["GET  /projects          — list projects (paginated)", "POST /projects          — create project", "GET  /projects/:id/tasks — list tasks", "GET  /team/members      — list members", "POST /export/csv        — queue export"] },
      { type: "h", text: "Rate Limits" },
      { type: "ul", items: ["Read: 60 req/min", "Write: 20 req/min", "Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset", "HTTP 429 with Retry-After on breach"] },
    ],
  },
  {
    id: "d5",
    title: "Design System 2.0 Guidelines",
    filename: "Design-System-2.0-Guidelines.docx",
    fileSize: "218 KB",
    description: "Component usage guidelines, design token documentation, and contribution process for Design System 2.0.",
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
    preview: [
      { type: "h", text: "Color Tokens" },
      { type: "code", lines: ["--color-primary:          oklch(0.52 0.22 280)", "--color-foreground:       oklch(0.14 0 0)", "--color-muted-foreground: oklch(0.55 0 0)", "--color-border:           oklch(0.88 0 0)", "--color-background:       oklch(0.99 0 0)"] },
      { type: "h", text: "Radius Scale" },
      { type: "ul", items: ["Cards / panels: 14px", "Inputs / dropdowns: 9px", "Chips / badges: full", "Icon buttons: 8px", "Metadata tiles: 10px"] },
      { type: "h", text: "Typography Scale" },
      { type: "ul", items: ["Page headings: 22px / semibold / tracking-tight", "Body: 13–13.5px / regular / leading-relaxed", "Labels: 10–11px / semibold / uppercase"] },
    ],
  },
  {
    id: "d6",
    title: "Q2 User Research Summary",
    filename: "Q2-User-Research-Summary.pdf",
    fileSize: "1.4 MB",
    description: "Summary of 12 user interviews covering analytics workflows, export needs, and mobile onboarding friction.",
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
    preview: [
      { type: "h", text: "Methodology" },
      { type: "p", text: "12 in-depth interviews, April–May 2026. Mix: 6 power users, 4 mobile-first, 2 new users. 45–60 min sessions via video call." },
      { type: "h", text: "Key Findings" },
      { type: "ul", items: ["67% of mobile users drop off at the notification permissions step", "42% cite CSV export as their most-wanted missing feature", "Power users average 4.2 min time-to-first-insight", "83% would use a mobile app at 70% web feature parity"] },
      { type: "h", text: "Top Recommendations" },
      { type: "ul", items: ["Defer notification permission request until after first project is created", "Add soft-ask screen with value prop before system permission dialog", "Prioritise dashboard preset saving and URL-shareable filter state", "Add CSV export to all table views as a quick win"] },
    ],
  },
  {
    id: "d7",
    title: "Design Sync — Jun 18 Notes",
    filename: "Design-Sync-Jun18-Notes.md",
    fileSize: "18 KB",
    description: "Meeting notes from the June 18 design sync covering Analytics Dashboard v3 components and Design System 2.0 token progress.",
    category: "Meeting Notes",
    status: "Published",
    fileType: "MD",
    lastUpdated: "Jun 18, 2026",
    owner: LA,
    linkedProject: "Design System 2.0",
    linkedTasks: ["Design System 2.0", "Add Dark Mode"],
    activity: [
      { id: "a1", actor: "Lina Alamri", action: "published meeting notes",    time: "Jun 18, 2026" },
      { id: "a2", actor: "Sara Attar",  action: "added action items section", time: "Jun 19, 2026" },
    ],
    preview: [
      { type: "h", text: "Attendees" },
      { type: "p", text: "Rayan Al-Omari, Sara Attar, Mohammed Al-Otaibi, Lina Alamri (notetaker) — 50 min." },
      { type: "h", text: "Decisions" },
      { type: "ul", items: ["Widget cards: 12px corner radius (consistent with DS 2.0 card system)", "Dark mode deferred to Q4 — shipping partial dark mode is worse than none", "KPI tile minimum height: 120px"] },
      { type: "h", text: "Action Items" },
      { type: "ul", items: ["Sara — 3 progress bar animation options in Figma by Jun 23", "Mohammed — Update dark mode token matrix with deferred status", "Rayan — Update widget card spec with radius and height constraint", "Lina — Publish notes and link to initiative tracker"] },
    ],
  },
  {
    id: "d8",
    title: "Sprint 11 Planning Document",
    filename: "Sprint-11-Planning.docx",
    fileSize: "76 KB",
    description: "Sprint 11 scope, capacity, goals, and risk register for the two-week sprint beginning June 16.",
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
    preview: [
      { type: "h", text: "Sprint 11 — Jun 16–27, 2026" },
      { type: "p", text: "Team capacity: 24 story points. Goal: ship Onboarding Completion and complete Audit Logs backend." },
      { type: "h", text: "Committed Scope" },
      { type: "ul", items: ["Improve Onboarding Completion — 13 pts (Lina, Sara)", "Audit Logs backend — 8 pts (Faisal, Abdulrahman)", "Total: 21 of 24 pts committed"] },
      { type: "h", text: "Risks" },
      { type: "ul", items: ["iOS soft-ask may require App Store review — risk of Onboarding rolling over", "Audit Logs requires new DB migration — validate by Jun 17", "DS 2.0 token changes may affect Onboarding screens mid-sprint"] },
    ],
  },
  {
    id: "d9",
    title: "Mobile Onboarding Flow",
    filename: "Mobile-Onboarding-Flow-Spec.pdf",
    fileSize: "892 KB",
    description: "Annotated specification for the redesigned mobile onboarding flow, including soft-ask patterns and A/B test copy variants.",
    category: "Spec",
    status: "Draft",
    fileType: "PDF",
    lastUpdated: "Jun 16, 2026",
    owner: LA,
    linkedProject: "Mobile Onboarding Redesign",
    linkedTasks: ["Improve Onboarding Completion"],
    activity: [
      { id: "a1", actor: "Lina Alamri", action: "created draft",                time: "Jun 12, 2026" },
      { id: "a2", actor: "Sara Attar",  action: "added wireframe annotations",  time: "Jun 14, 2026" },
      { id: "a3", actor: "Lina Alamri", action: "added A/B test copy variants", time: "Jun 16, 2026" },
    ],
    preview: [
      { type: "h", text: "5-Step Flow Overview" },
      { type: "ul", items: ["Step 1 — Welcome: value prop + Get Started CTA", "Step 2 — Create first project: name, icon, goal", "Step 3 — Invite team: email input, skip offered", "Step 4 — Notification soft-ask: value prop before system dialog", "Step 5 — Dashboard intro: 3-step animated tooltip walkthrough"] },
      { type: "h", text: "A/B Copy Variants (Step 4)" },
      { type: "ul", items: ["Variant A (Value-First): \"Never miss a project update.\"", "Variant B (Trust-First): \"You control what you hear.\""] },
      { type: "h", text: "Edge Cases" },
      { type: "ul", items: ["Permission denied: show dismissible banner with Settings deep link", "Rollback flag: feature_mobile_onboarding_v2"] },
    ],
  },
  {
    id: "d10",
    title: "Enterprise Permission Matrix",
    filename: "Enterprise-Permission-Matrix.docx",
    fileSize: "156 KB",
    description: "Role-to-feature permission mapping for the Enterprise Permissions initiative, covering all workspace roles and access levels.",
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
    preview: [
      { type: "h", text: "Workspace Roles" },
      { type: "ul", items: ["Owner — full access, cannot be removed", "Admin — full features + member management", "Member — create/edit projects and tasks", "Viewer — read-only, no export access", "Custom — granular flags configured by Admin/Owner"] },
      { type: "h", text: "Key Boundaries" },
      { type: "ul", items: ["Only Owner/Admin can invite or remove members", "Viewer cannot trigger CSV exports or view raw analytics", "Audit Logs visible to Owner and Admin only", "Custom roles inherit from Member by default"] },
      { type: "h", text: "Migration Path" },
      { type: "p", text: "Existing Admin and Member accounts are unchanged. Custom role type is available for new assignments only — cannot be retroactively applied without re-invite." },
    ],
  },
]

// ─── File type icon ───────────────────────────────────────────────────────────

function FileIcon({ type, size = "md" }: { type: FileType; size?: "sm" | "md" | "lg" }) {
  const fc = fileTypeConfig[type]
  // sm: compact row icon; md: drawer attachment; lg: unused but kept for safety
  const sizes = { sm: "h-[30px] w-[30px] text-[8px]", md: "h-8 w-8 text-[9px]", lg: "h-10 w-10 text-[10px]" }
  const Icon = type === "MD" ? FileCode : FileText
  return (
    <div className={cn("flex shrink-0 flex-col items-center justify-center rounded-[7px]", fc.iconBg, sizes[size])}>
      <Icon className={cn("mb-[1px]", size === "lg" ? "h-4 w-4" : size === "md" ? "h-3 w-3" : "h-2.5 w-2.5", fc.iconText)} strokeWidth={2} />
      <span className={cn("font-bold leading-none tracking-wide", fc.iconText)}>{fc.ext}</span>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FilterSelect({ value, onChange, children }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode
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

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2400)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease: "easeOut" as const }}
      className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-[10px] border border-border bg-foreground px-4 py-2.5 shadow-lg"
    >
      <p className="text-[13px] font-medium text-background">{message}</p>
    </motion.div>
  )
}

// ─── Document Row ─────────────────────────────────────────────────────────────

function DocumentRow({
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.22, ease: "easeOut" as const }}
      onClick={onClick}
      className={cn(
        "group grid cursor-pointer items-center border-b border-border last:border-b-0 px-4 py-3 transition-colors duration-100",
        "grid-cols-[30px_1fr_140px_160px_110px_110px_56px]",
        "gap-x-5",
        "hover:bg-muted/40",
        isSelected && "bg-primary/[0.04] hover:bg-primary/[0.06]"
      )}
    >
      {/* File icon */}
      <FileIcon type={doc.fileType} size="sm" />

      {/* Title + description */}
      <div className="min-w-0">
        <p className={cn(
          "text-[13px] font-semibold leading-snug truncate",
          isSelected ? "text-primary" : "text-foreground"
        )}>
          {doc.title}
        </p>
        <p className="mt-0.5 text-[11.5px] text-muted-foreground/50 truncate leading-snug font-normal">{doc.description}</p>
      </div>

      {/* Category */}
      <div className="hidden xl:flex items-center">
        <span className={cn(
          "rounded-full border px-2 py-[3px] text-[10.5px] font-medium whitespace-nowrap",
          cc.bg, cc.text, cc.border
        )}>
          {doc.category}
        </span>
      </div>

      {/* Owner */}
      <div className="hidden md:flex items-center gap-2">
        <div
          title={doc.owner.name}
          className={cn(
            "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[7px] font-bold text-white",
            doc.owner.color
          )}
        >
          {doc.owner.initials}
        </div>
        <span className="text-[12px] text-muted-foreground/70 truncate whitespace-nowrap">
          {doc.owner.name}
        </span>
      </div>

      {/* Last updated */}
      <div className="hidden lg:flex items-center gap-1.5">
        <span className="text-[12px] text-muted-foreground/55 whitespace-nowrap tabular-nums">{doc.lastUpdated}</span>
      </div>

      {/* Status */}
      <div className="flex items-center">
        <span className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2 py-[3px] text-[10.5px] font-medium whitespace-nowrap",
          sc.bg, sc.text, sc.border
        )}>
          <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", sc.dot)} />
          {doc.status}
        </span>
      </div>

      {/* Favorite + chevron */}
      <div className="flex items-center justify-end gap-0.5">
        <button
          onClick={onToggleFavorite}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-[6px] transition-colors duration-150",
            isFavorited
              ? "text-amber-500 hover:text-amber-400"
              : "text-muted-foreground/20 opacity-0 group-hover:opacity-100 hover:text-amber-400"
          )}
        >
          <Star className="h-3.5 w-3.5" fill={isFavorited ? "currentColor" : "none"} strokeWidth={1.8} />
        </button>
        <ChevronRight className={cn(
          "h-3.5 w-3.5 transition-colors duration-150",
          isSelected ? "text-primary" : "text-muted-foreground/20 group-hover:text-muted-foreground/40"
        )} />
      </div>
    </motion.div>
  )
}

// ─── Preview renderer ─────────────────────────────────────────────────────────

function PreviewContent({ blocks }: { blocks: PreviewBlock[] }) {
  return (
    <div className="space-y-0">
      {blocks.map((block, i) => {
        if (block.type === "h")
          return <p key={i} className="mb-1.5 mt-4 text-[11px] font-semibold uppercase tracking-wider text-foreground/50 first:mt-0">{block.text}</p>
        if (block.type === "p")
          return <p key={i} className="mb-2 text-[12.5px] leading-relaxed text-foreground/75">{block.text}</p>
        if (block.type === "ul")
          return (
            <ul key={i} className="mb-2 space-y-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2">
                  <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/20" />
                  <span className="text-[12px] leading-snug text-foreground/70">{item}</span>
                </li>
              ))}
            </ul>
          )
        if (block.type === "code")
          return (
            <div key={i} className="mb-2 rounded-[8px] bg-muted/60 border border-border px-3.5 py-3">
              {block.lines.map((line, j) => (
                <p key={j} className={cn(
                  "font-mono text-[11.5px] leading-[1.7]",
                  line === "" ? "h-3" : "text-foreground/70"
                )}>{line}</p>
              ))}
            </div>
          )
        if (block.type === "divider")
          return <hr key={i} className="my-3 border-border/60" />
        return null
      })}
    </div>
  )
}

// ─── Document Drawer ──────────────────────────────────────────────────────────

function DocumentDrawer({
  doc,
  onClose,
  onDownload,
}: {
  doc: Document
  onClose: () => void
  onDownload: (filename: string) => void
}) {
  const [previewOpen, setPreviewOpen] = useState(true)
  const sc = statusConfig[doc.status]
  const cc = categoryConfig[doc.category]
  const fc = fileTypeConfig[doc.fileType]

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 280 }}
      className="fixed right-0 top-14 z-50 flex h-[calc(100vh-3.5rem)] w-[460px] flex-col border-l border-border bg-background shadow-[-6px_0_28px_oklch(0_0_0/0.08)]"
    >
      {/* ── Header ── */}
      <div className="shrink-0 border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <FileIcon type={doc.fileType} size="sm" />
          <div className="flex-1 min-w-0">
            <h2 className="text-[14px] font-semibold text-foreground leading-snug truncate">{doc.title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2 py-[3px] text-[10.5px] font-medium",
                sc.bg, sc.text, sc.border
              )}>
                <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", sc.dot)} />
                {doc.status}
              </span>
              <span className={cn("rounded-full border px-2 py-[3px] text-[10.5px] font-medium", cc.bg, cc.text, cc.border)}>
                {doc.category}
              </span>
              <span className={cn("rounded-md px-1.5 py-[3px] text-[10px] font-bold tracking-wide", fc.iconBg, fc.iconText)}>
                {fc.ext}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto">

        {/* 1 — Description */}
        <div className="border-b border-border px-5 py-3.5">
          <p className="text-[12.5px] text-muted-foreground/75 leading-relaxed">{doc.description}</p>
        </div>

        {/* 2 — Attachment block */}
        <div className="border-b border-border px-5 py-4">
          <p className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/40">Attachment</p>
          {/* File card */}
          <div className="flex items-center gap-3 rounded-[9px] border border-border bg-card px-3.5 py-2.5 shadow-[0_1px_3px_oklch(0_0_0/0.04)]">
            <FileIcon type={doc.fileType} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-medium text-foreground truncate">{doc.filename}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground/50 tabular-nums">
                {fc.ext} · {doc.fileSize} · {doc.lastUpdated}
              </p>
            </div>
          </div>
          {/* Actions */}
          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={() => onDownload(doc.filename)}
              className="flex h-[30px] items-center gap-1.5 rounded-[7px] bg-primary px-3 text-[12px] font-medium text-white hover:bg-primary/90 transition-colors duration-150"
            >
              <Download className="h-3 w-3" strokeWidth={2.2} />
              Download
            </button>
            <button
              onClick={() => setPreviewOpen((p) => !p)}
              className="flex h-[30px] items-center gap-1.5 rounded-[7px] border border-border bg-card px-3 text-[12px] font-medium text-foreground/60 hover:bg-muted transition-colors duration-150"
            >
              {previewOpen
                ? <><EyeOff className="h-3 w-3" strokeWidth={1.8} /> Hide Preview</>
                : <><Eye className="h-3 w-3" strokeWidth={1.8} /> Show Preview</>
              }
            </button>
          </div>
        </div>

        {/* 3 — Preview panel */}
        <AnimatePresence initial={false}>
          {previewOpen && (
            <motion.div
              key="preview"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" as const }}
              className="overflow-hidden border-b border-border"
            >
              <div className="px-5 py-3.5">
                <p className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/40">Preview</p>
                <div className="max-h-[220px] overflow-y-auto rounded-[9px] border border-border bg-muted/[0.25] px-4 py-3.5 shadow-[inset_0_1px_3px_oklch(0_0_0/0.03)]">
                  <PreviewContent blocks={doc.preview} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4 — Metadata */}
        <div className="px-5 py-4 space-y-5">

          {/* Owner + project */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-[9px] border border-border bg-muted/30 px-3 py-2.5">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Owner</p>
              <div className="flex items-center gap-2">
                <div className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white", doc.owner.color)}>
                  {doc.owner.initials}
                </div>
                <span className="text-[12px] font-medium text-foreground truncate">{doc.owner.name}</span>
              </div>
            </div>
            <div className="rounded-[9px] border border-border bg-muted/30 px-3 py-2.5">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Project</p>
              <div className="flex items-center gap-1.5">
                <FolderKanban className="h-3 w-3 shrink-0 text-primary/50" strokeWidth={1.8} />
                <span className="text-[12px] font-medium text-foreground truncate">{doc.linkedProject}</span>
              </div>
            </div>
          </div>

          {/* Linked tasks */}
          <section>
            <div className="mb-2 flex items-center gap-1.5">
              <ListTodo className="h-3 w-3 text-muted-foreground/40" strokeWidth={1.8} />
              <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/40">Linked Tasks</p>
            </div>
            <div className="space-y-1.5">
              {doc.linkedTasks.map((task, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-[8px] border border-border bg-muted/25 px-3 py-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/30 shrink-0" />
                  <p className="text-[12px] text-foreground/70">{task}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Activity */}
          <section>
            <p className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/40">Recent Activity</p>
            <div className="space-y-3">
              {doc.activity.map((entry) => (
                <div key={entry.id} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted/80 text-[7px] font-bold text-muted-foreground">
                    {entry.actor.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-foreground/75 leading-snug">
                      <span className="font-medium text-foreground/90">{entry.actor}</span>{" "}{entry.action}
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-muted-foreground/40">{entry.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="h-1" />
        </div>
      </div>
    </motion.aside>
  )
}

// ─── List header ──────────────────────────────────────────────────────────────

function ListHeader() {
  return (
    <div className={cn(
      "grid items-center border-b border-border bg-muted/[0.35] px-4 py-2",
      "grid-cols-[30px_1fr_140px_160px_110px_110px_56px]",
      "gap-x-5"
    )}>
      <div />
      <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/40">Name</p>
      <p className="hidden text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/40 xl:block">Category</p>
      <p className="hidden text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/40 md:block">Owner</p>
      <p className="hidden text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/40 lg:block">Updated</p>
      <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/40">Status</p>
      <div />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DocumentsPage() {
  const [selectedDoc, setSelectedDoc]       = useState<Document | null>(null)
  const [searchQuery, setSearchQuery]       = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [sortBy, setSortBy]                 = useState("updated")
  const [favoritedIds, setFavoritedIds]     = useState<Set<string>>(new Set(["d1", "d6"]))
  const [toast, setToast]                   = useState<string | null>(null)

  const filteredDocs = useMemo(() => {
    let result = [...DOCUMENTS]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((d) =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.owner.name.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      )
    }
    if (categoryFilter !== "All") result = result.filter((d) => d.category === categoryFilter)
    if (sortBy === "name")      result.sort((a, b) => a.title.localeCompare(b.title))
    if (sortBy === "updated")   result.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    if (sortBy === "owner")     result.sort((a, b) => a.owner.name.localeCompare(b.owner.name))
    if (sortBy === "category")  result.sort((a, b) => a.category.localeCompare(b.category))
    if (sortBy === "favorites") result.sort((a, b) => (favoritedIds.has(a.id) ? 0 : 1) - (favoritedIds.has(b.id) ? 0 : 1))
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

  function handleDownload(filename: string) {
    setToast(`Downloading ${filename}…`)
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground leading-none mb-2">Documents</h1>
        <p className="text-[13.5px] text-muted-foreground">Central knowledge base for product specs, research, and planning.</p>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex min-w-[220px] items-center gap-2 rounded-[9px] border border-border bg-card px-3 h-9 focus-within:border-primary/30 transition-colors duration-150">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents…"
            className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/55 outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-150">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <FilterSelect value={categoryFilter} onChange={setCategoryFilter}>
          <option value="All">All Categories</option>
          {ALL_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </FilterSelect>
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

      {/* ── Count ── */}
      <div className="flex items-center gap-2.5 -mt-2">
        <span className="text-[13px] text-muted-foreground">
          {filteredDocs.length} {filteredDocs.length === 1 ? "document" : "documents"}
        </span>
        {isFiltered && (
          <button
            onClick={() => { setSearchQuery(""); setCategoryFilter("All") }}
            className="text-[12.5px] text-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── List ── */}
      {filteredDocs.length > 0 ? (
        <div className="overflow-hidden rounded-[12px] border border-border bg-card shadow-[0_1px_4px_oklch(0_0_0/0.05)]">
          <ListHeader />
          {filteredDocs.map((doc, i) => (
            <DocumentRow
              key={doc.id}
              doc={doc}
              index={i}
              isFavorited={favoritedIds.has(doc.id)}
              onToggleFavorite={(e) => toggleFavorite(e, doc.id)}
              onClick={() => setSelectedDoc((prev) => prev?.id === doc.id ? null : doc)}
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
              onDownload={handleDownload}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && <Toast key="toast" message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  )
}
