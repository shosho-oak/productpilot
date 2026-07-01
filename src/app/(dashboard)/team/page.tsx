"use client"

import React, { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Briefcase,
  ChevronDown,
  FolderKanban,
  Mail,
  Search,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type MemberStatus     = "Active" | "On Leave" | "Part-time"
type MemberRole       = "Owner" | "Engineering Lead" | "UX Designer" | "Senior Engineer" | "Product Manager" | "Data Analyst" | "Product Designer"
type MemberDepartment = "Product" | "Engineering" | "Design" | "Data"

interface MemberActivity {
  id: string
  action: string
  time: string
}

interface TeamMember {
  id: string
  name: string
  initials: string
  avatarColor: string
  role: MemberRole
  department: MemberDepartment
  status: MemberStatus
  email: string
  responsibilities: string[]
  assignedProjects: string[]
  workload: number
  bio: string
  activity: MemberActivity[]
}

// ─── Config ───────────────────────────────────────────────────────────────────

const statusConfig: Record<
  MemberStatus,
  { dot: string; bg: string; text: string; border: string }
> = {
  Active:      { dot: "bg-emerald-500", bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200/70" },
  "On Leave":  { dot: "bg-amber-500",   bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-200/70"   },
  "Part-time": { dot: "bg-blue-500",    bg: "bg-blue-50",     text: "text-blue-700",    border: "border-blue-200/70"    },
}

const departmentConfig: Record<
  MemberDepartment,
  { bg: string; text: string; border: string; accentBg: string }
> = {
  Product:     { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200/70",  accentBg: "bg-violet-400"  },
  Engineering: { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200/70",    accentBg: "bg-blue-400"    },
  Design:      { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200/70",    accentBg: "bg-rose-400"    },
  Data:        { bg: "bg-teal-50",    text: "text-teal-700",    border: "border-teal-200/70",    accentBg: "bg-teal-400"    },
}

const ALL_ROLES: MemberRole[] = [
  "Owner",
  "Engineering Lead",
  "UX Designer",
  "Senior Engineer",
  "Product Manager",
  "Data Analyst",
  "Product Designer",
]

// ─── Mock data ────────────────────────────────────────────────────────────────

const TEAM: TeamMember[] = [
  {
    id: "m1",
    name: "Shahad Qumosani",
    initials: "SQ",
    avatarColor: "bg-violet-500",
    role: "Owner",
    department: "Product",
    status: "Active",
    email: "shahad@productpilot.io",
    bio: "Shahad founded ProductPilot after 8 years in product leadership at two scale-ups. She drives overall product vision, stakeholder alignment, and go-to-market strategy.",
    responsibilities: [
      "Set and maintain product vision and strategy",
      "Stakeholder alignment and exec communication",
      "Prioritization and roadmap ownership",
      "Hiring and team growth",
    ],
    assignedProjects: [
      "Analytics Dashboard v3",
      "Mobile Onboarding Redesign",
      "Customer Portal MVP",
    ],
    workload: 88,
    activity: [
      { id: "a1", action: "published PRD — Analytics Dashboard v3",      time: "Jun 18, 2026" },
      { id: "a2", action: "approved Sprint 11 plan",                     time: "Jun 16, 2026" },
      { id: "a3", action: "reviewed Enterprise Permission Matrix",        time: "Jun 21, 2026" },
    ],
  },
  {
    id: "m2",
    name: "Rayan Al-Omari",
    initials: "RA",
    avatarColor: "bg-blue-500",
    role: "Engineering Lead",
    department: "Engineering",
    status: "Active",
    email: "rayan@productpilot.io",
    bio: "Rayan leads the engineering team with a focus on platform reliability and developer velocity. He has 10 years of experience across distributed systems and mobile platforms.",
    responsibilities: [
      "Technical architecture and design reviews",
      "Engineering team capacity and sprint delivery",
      "API design and platform scalability",
      "Developer experience and tooling",
    ],
    assignedProjects: [
      "API v2 Migration",
      "Design System 2.0",
      "CSV Export Feature",
    ],
    workload: 76,
    activity: [
      { id: "a1", action: "published API Integration Guide",           time: "May 15, 2026" },
      { id: "a2", action: "added OAuth 2.0 section to API Guide",      time: "May 10, 2026" },
      { id: "a3", action: "created Design System 2.0 draft",           time: "Jun 21, 2026" },
    ],
  },
  {
    id: "m3",
    name: "Sara Attar",
    initials: "SA",
    avatarColor: "bg-teal-500",
    role: "UX Designer",
    department: "Design",
    status: "Active",
    email: "sara@productpilot.io",
    bio: "Sara leads user research and end-to-end experience design. She conducted the Q2 user interviews and owns the design language for all customer-facing surfaces.",
    responsibilities: [
      "User research and synthesis",
      "End-to-end UX design for customer-facing flows",
      "Usability testing and iteration",
      "Figma component library maintenance",
    ],
    assignedProjects: [
      "Mobile Onboarding Redesign",
      "Analytics Dashboard v3",
      "Design System 2.0",
    ],
    workload: 68,
    activity: [
      { id: "a1", action: "published Q2 User Research Summary",         time: "May 30, 2026" },
      { id: "a2", action: "added wireframe annotations to Onboarding Flow", time: "Jun 14, 2026" },
      { id: "a3", action: "added component composition section to Design System", time: "Jun 20, 2026" },
    ],
  },
  {
    id: "m4",
    name: "Faisal Al-Sudairy",
    initials: "FS",
    avatarColor: "bg-amber-500",
    role: "Senior Engineer",
    department: "Engineering",
    status: "Active",
    email: "faisal@productpilot.io",
    bio: "Faisal specializes in backend systems and data pipelines. He authored the CSV Export Specification and leads the technical implementation for data-heavy features.",
    responsibilities: [
      "Backend feature development",
      "Data export and pipeline design",
      "Code reviews and mentoring junior engineers",
      "Performance profiling and optimization",
    ],
    assignedProjects: [
      "CSV Export Feature",
      "API v2 Migration",
    ],
    workload: 72,
    activity: [
      { id: "a1", action: "published CSV Export Specification",         time: "Jun 2, 2026"  },
      { id: "a2", action: "confirmed Sprint 11 capacity estimate",      time: "Jun 15, 2026" },
      { id: "a3", action: "reviewed Release Notes v2.1",               time: "Jun 19, 2026" },
    ],
  },
  {
    id: "m5",
    name: "Lina Alamri",
    initials: "LA",
    avatarColor: "bg-orange-500",
    role: "Product Manager",
    department: "Product",
    status: "Active",
    email: "lina@productpilot.io",
    bio: "Lina manages day-to-day delivery for the Mobile and Growth squads. She is the primary author of Sprint planning documents and owns the Mobile Onboarding initiative.",
    responsibilities: [
      "Sprint planning and delivery tracking",
      "Mobile squad day-to-day ownership",
      "Stakeholder updates and risk escalation",
      "User story writing and backlog refinement",
    ],
    assignedProjects: [
      "Mobile Onboarding Redesign",
    ],
    workload: 62,
    activity: [
      { id: "a1", action: "published Sprint 11 Planning Document",      time: "Jun 16, 2026" },
      { id: "a2", action: "published meeting notes — Design Sync Jun 18", time: "Jun 18, 2026" },
      { id: "a3", action: "added A/B copy variants to Onboarding Flow", time: "Jun 16, 2026" },
    ],
  },
  {
    id: "m6",
    name: "Abdulrahman Al-Qahtani",
    initials: "AQ",
    avatarColor: "bg-rose-500",
    role: "Senior Engineer",
    department: "Engineering",
    status: "Active",
    email: "abdulrahman@productpilot.io",
    bio: "Abdulrahman focuses on security, access control, and platform infrastructure. He leads the Enterprise Permissions initiative and the OAuth 2.0 implementation.",
    responsibilities: [
      "Security and access control implementation",
      "Enterprise permissions and role systems",
      "OAuth 2.0 and authentication flows",
      "Infrastructure and deployment pipelines",
    ],
    assignedProjects: [
      "Customer Portal MVP",
      "API v2 Migration",
    ],
    workload: 81,
    activity: [
      { id: "a1", action: "created Enterprise Permission Matrix",       time: "Jun 20, 2026" },
      { id: "a2", action: "added OAuth 2.0 section to API Guide",      time: "May 10, 2026" },
      { id: "a3", action: "updated Customer Portal access model",      time: "Jun 18, 2026" },
    ],
  },
  {
    id: "m7",
    name: "Noura Al-Harbi",
    initials: "NH",
    avatarColor: "bg-pink-500",
    role: "Data Analyst",
    department: "Data",
    status: "Part-time",
    email: "noura@productpilot.io",
    bio: "Noura analyzes product usage data, builds dashboards, and translates metrics into actionable insights. She partners closely with the Product team on success metric definitions.",
    responsibilities: [
      "Product analytics and event tracking",
      "Success metric definition and monitoring",
      "Data dashboards and reporting",
      "A/B test analysis and interpretation",
    ],
    assignedProjects: [
      "Analytics Dashboard v3",
    ],
    workload: 45,
    activity: [
      { id: "a1", action: "updated retention metrics dashboard",        time: "Jun 17, 2026" },
      { id: "a2", action: "defined success metrics for Analytics v3",   time: "Jun 10, 2026" },
      { id: "a3", action: "completed Q2 cohort analysis",              time: "Jun 4, 2026"  },
    ],
  },
  {
    id: "m8",
    name: "Mohammed Al-Otaibi",
    initials: "MO",
    avatarColor: "bg-indigo-500",
    role: "Product Designer",
    department: "Design",
    status: "Active",
    email: "mohammed@productpilot.io",
    bio: "Mohammed crafts UI components and visual design systems. He owns the Design System 2.0 component library and drives dark mode exploration.",
    responsibilities: [
      "UI component design and documentation",
      "Design system token management",
      "Visual QA and brand consistency",
      "Dark mode and accessibility exploration",
    ],
    assignedProjects: [
      "Design System 2.0",
      "Analytics Dashboard v3",
    ],
    workload: 58,
    activity: [
      { id: "a1", action: "shipped new card components to design system", time: "Jun 19, 2026" },
      { id: "a2", action: "updated dark mode token explorations",         time: "Jun 14, 2026" },
      { id: "a3", action: "published icon set v3",                       time: "Jun 8, 2026"  },
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

function workloadColor(pct: number) {
  if (pct < 50) return "bg-emerald-500"
  if (pct < 75) return "bg-amber-500"
  return "bg-red-500"
}

// ─── Member Card ──────────────────────────────────────────────────────────────

function MemberCard({
  member,
  index,
  onClick,
  isSelected,
}: {
  member: TeamMember
  index: number
  onClick: () => void
  isSelected: boolean
}) {
  const sc = statusConfig[member.status]
  const dc = departmentConfig[member.department]

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
      {/* Department accent strip */}
      <div className={cn("h-[3px] w-full shrink-0", dc.accentBg)} />

      <div className="flex flex-col items-center px-5 pb-5 pt-6 text-center">
        {/* Avatar */}
        <div
          className={cn(
            "mb-3 flex h-14 w-14 items-center justify-center rounded-full text-[18px] font-bold text-white shadow-sm",
            member.avatarColor
          )}
        >
          {member.initials}
        </div>

        {/* Name + role */}
        <h3 className="text-[14px] font-semibold text-foreground leading-tight mb-0.5">{member.name}</h3>
        <p className="text-[12px] text-muted-foreground mb-3">{member.role}</p>

        {/* Status + department chips */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap mb-4">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium",
              sc.bg, sc.text, sc.border
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", sc.dot)} />
            {member.status}
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
              dc.bg, dc.text, dc.border
            )}
          >
            {member.department}
          </span>
        </div>

        {/* Projects count */}
        <div className="mb-3.5 flex items-center gap-1.5 text-muted-foreground/60">
          <FolderKanban className="h-3.5 w-3.5 shrink-0" strokeWidth={1.7} />
          <span className="text-[12px]">
            {member.assignedProjects.length} project{member.assignedProjects.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Email */}
        <div className="flex items-center gap-1.5 text-muted-foreground/50 max-w-full">
          <Mail className="h-3 w-3 shrink-0" strokeWidth={1.7} />
          <span className="text-[11px] truncate">{member.email}</span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Member Drawer ────────────────────────────────────────────────────────────

function MemberDrawer({
  member,
  onClose,
}: {
  member: TeamMember
  onClose: () => void
}) {
  const sc = statusConfig[member.status]
  const dc = departmentConfig[member.department]
  const wc = workloadColor(member.workload)

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
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[16px] font-bold text-white shadow-sm",
              member.avatarColor
            )}
          >
            {member.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                  sc.bg, sc.text, sc.border
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", sc.dot)} />
                {member.status}
              </span>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                  dc.bg, dc.text, dc.border
                )}
              >
                {member.department}
              </span>
            </div>
            <h2 className="text-[16px] font-semibold text-foreground leading-snug">{member.name}</h2>
            <p className="text-[13px] text-muted-foreground">{member.role}</p>
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

        {/* Bio */}
        <section>
          <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">About</p>
          <p className="text-[13px] text-foreground/80 leading-relaxed">{member.bio}</p>
        </section>

        {/* Metadata: email + department */}
        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">Email</p>
            <div className="flex items-center gap-1.5 min-w-0">
              <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" strokeWidth={1.7} />
              <span className="text-[12px] font-medium text-foreground truncate">{member.email}</span>
            </div>
          </div>
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">Department</p>
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" strokeWidth={1.7} />
              <span className="text-[12.5px] font-medium text-foreground">{member.department}</span>
            </div>
          </div>
        </section>

        {/* Responsibilities */}
        <section>
          <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
            Responsibilities
          </p>
          <div className="space-y-2">
            {member.responsibilities.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-[9px] border border-border bg-muted/30 px-3.5 py-2.5"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                <p className="text-[12.5px] text-foreground/80">{r}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Assigned projects */}
        <section>
          <div className="mb-3 flex items-center gap-1.5">
            <FolderKanban className="h-3.5 w-3.5 text-primary/60" strokeWidth={1.7} />
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Assigned Projects
            </p>
          </div>
          <div className="space-y-2">
            {member.assignedProjects.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-[9px] border border-border bg-muted/30 px-3.5 py-2.5"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                <p className="text-[12.5px] text-foreground/80">{p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Workload */}
        <section>
          <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
            Workload
          </p>
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12.5px] font-medium text-foreground">Current capacity</span>
              <span
                className={cn(
                  "text-[12px] font-semibold",
                  member.workload < 50
                    ? "text-emerald-600"
                    : member.workload < 75
                    ? "text-amber-600"
                    : "text-red-600"
                )}
              >
                {member.workload}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${member.workload}%` }}
                transition={{ duration: 0.6, ease: "easeOut" as const, delay: 0.15 }}
                className={cn("h-full rounded-full", wc)}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground/50">
              {member.workload < 50
                ? "Has bandwidth for additional work"
                : member.workload < 75
                ? "Moderate load — monitor closely"
                : "Near capacity — avoid new assignments"}
            </p>
          </div>
        </section>

        {/* Recent activity */}
        <section>
          <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
            Recent Activity
          </p>
          <div className="space-y-4">
            {member.activity.map((entry) => (
              <div key={entry.id} className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[7.5px] font-bold text-white",
                    member.avatarColor
                  )}
                >
                  {member.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] text-foreground/80 leading-snug">
                    <span className="font-semibold text-foreground">{member.name}</span>{" "}
                    {entry.action}
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

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [searchQuery, setSearchQuery]       = useState("")
  const [roleFilter, setRoleFilter]         = useState("All")

  const filteredMembers = useMemo(() => {
    let result = [...TEAM]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q)
      )
    }

    if (roleFilter !== "All") {
      result = result.filter((m) => m.role === roleFilter)
    }

    return result
  }, [searchQuery, roleFilter])

  const isFiltered = searchQuery || roleFilter !== "All"

  return (
    <div className="space-y-7">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground leading-none mb-2">
            Team
          </h1>
          <p className="text-[13.5px] text-muted-foreground">
            {TEAM.length} members across Product, Engineering, Design, and Data.
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
            placeholder="Search team..."
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

        {/* Role filter */}
        <FilterSelect value={roleFilter} onChange={setRoleFilter}>
          <option value="All">All Roles</option>
          {ALL_ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </FilterSelect>
      </div>

      {/* ── Count + clear ── */}
      <div className="flex items-center gap-2.5 -mt-3">
        <span className="text-[13px] text-muted-foreground">
          {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"}
        </span>
        {isFiltered && (
          <button
            onClick={() => { setSearchQuery(""); setRoleFilter("All") }}
            className="text-[12.5px] text-primary hover:underline transition-colors duration-150"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
          {filteredMembers.map((member, i) => (
            <MemberCard
              key={member.id}
              member={member}
              index={i}
              onClick={() =>
                setSelectedMember((prev) =>
                  prev?.id === member.id ? null : member
                )
              }
              isSelected={selectedMember?.id === member.id}
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
          <p className="mb-1 text-[14px] font-medium text-muted-foreground">No members found</p>
          <p className="text-[13px] text-muted-foreground/60">Try adjusting your search or role filter.</p>
        </motion.div>
      )}

      {/* ── Drawer ── */}
      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-foreground/[0.04]"
              onClick={() => setSelectedMember(null)}
            />
            <MemberDrawer
              key={selectedMember.id}
              member={selectedMember}
              onClose={() => setSelectedMember(null)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
