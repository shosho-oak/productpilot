"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Check,
  CheckCircle2,
  Circle,
  Filter,
  FolderKanban,
  Plus,
  Search,
  Sparkles,
  X,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type TaskStatus   = "ideas" | "ready" | "in-progress" | "done"
type TaskPriority = "High" | "Medium" | "Low"

interface TaskMember {
  name: string
  initials: string
  color: string
}

interface AcceptanceCriterion {
  id: string
  text: string
  done: boolean
}

interface ActivityEntry {
  id: string
  actor: string
  action: string
  time: string
  ai?: boolean
}

interface Task {
  id: string
  title: string
  description: string
  fullDescription: string
  status: TaskStatus
  priority: TaskPriority
  points: number
  assignees: TaskMember[]
  dueDate: string
  sprint: string
  linkedProject: string
  aiSuggested?: boolean
  acceptanceCriteria: AcceptanceCriterion[]
  activity: ActivityEntry[]
  aiRecommendation: string
}

// ─── Config ───────────────────────────────────────────────────────────────────

const COLUMNS: { id: TaskStatus; label: string; dot: string; accent: string; emptyLabel: string }[] = [
  { id: "ideas",       label: "Ideas",       dot: "bg-slate-400",   accent: "bg-slate-200",   emptyLabel: "No ideas yet"        },
  { id: "ready",       label: "Ready",       dot: "bg-blue-500",    accent: "bg-blue-200",    emptyLabel: "No tasks ready"       },
  { id: "in-progress", label: "In Progress", dot: "bg-amber-500",   accent: "bg-amber-200",   emptyLabel: "Nothing in progress"  },
  { id: "done",        label: "Done",        dot: "bg-emerald-500", accent: "bg-emerald-200", emptyLabel: "Nothing completed yet" },
]

const priorityConfig: Record<
  TaskPriority,
  { dot: string; bg: string; text: string; border: string; accentBar: string }
> = {
  High:   { dot: "bg-red-500",     bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200/70",     accentBar: "bg-red-400"     },
  Medium: { dot: "bg-amber-500",   bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200/70",   accentBar: "bg-amber-400"   },
  Low:    { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/70", accentBar: "bg-emerald-400" },
}

// ─── Team members ─────────────────────────────────────────────────────────────

const SQ: TaskMember = { name: "Shahad Qumosani",        initials: "SQ", color: "bg-violet-500" }
const RA: TaskMember = { name: "Rayan Al-Omari",         initials: "RA", color: "bg-blue-500"   }
const SA: TaskMember = { name: "Sara Attar",             initials: "SA", color: "bg-teal-500"   }
const FS: TaskMember = { name: "Faisal Al-Sudairy",      initials: "FS", color: "bg-amber-500"  }
const LA: TaskMember = { name: "Lina Alamri",            initials: "LA", color: "bg-orange-500" }
const AQ: TaskMember = { name: "Abdulrahman Al-Qahtani", initials: "AQ", color: "bg-rose-500"   }
const RH: TaskMember = { name: "Reem Al-Harbi",          initials: "RH", color: "bg-pink-500"   }

// ─── Mock data ────────────────────────────────────────────────────────────────

const TASKS: Task[] = [
  // ── Ideas ──────────────────────────────────────────────────────────────────
  {
    id: "t1",
    title: "Add Dark Mode",
    description: "System-wide dark theme with user preference persistence and automatic OS detection.",
    fullDescription: "Users have requested dark mode support across the platform. The implementation should respect the user's OS-level preference via prefers-color-scheme, allow manual override in Settings, and persist the choice per account. All surfaces — dashboard, workspace, projects — need to be covered.",
    status: "ideas",
    priority: "Low",
    points: 3,
    assignees: [LA],
    dueDate: "Aug 15, 2026",
    sprint: "Unscheduled",
    linkedProject: "Design System 2.0",
    aiSuggested: false,
    acceptanceCriteria: [
      { id: "ac1", text: "Dark mode can be toggled manually from user Settings", done: false },
      { id: "ac2", text: "System preference (prefers-color-scheme) is respected on first load", done: false },
      { id: "ac3", text: "Preference persists across sessions", done: false },
      { id: "ac4", text: "All product surfaces render correctly in dark mode", done: false },
    ],
    activity: [
      { id: "a1", actor: "Lina Alamri",      action: "created this task",        time: "May 10, 2026" },
      { id: "a2", actor: "Shahad Qumosani",  action: "added to Ideas column",    time: "May 12, 2026" },
    ],
    aiRecommendation: "Dark mode has high user satisfaction impact but is frequently underestimated in scope. Recommend scoping this to a token-level implementation in Design System 2.0 before building individual surface support. Low priority until the design system token milestone is complete.",
  },
  {
    id: "t2",
    title: "Notification Preferences",
    description: "Let users configure email, push, and in-app notification settings per feature area.",
    fullDescription: "Users are reporting notification fatigue, leading to lower engagement with high-signal alerts. This task introduces a granular notification preferences center where users can opt in or out of email, push, and in-app alerts per product area (Projects, Tasks, Mentions). Default preferences should be conservative.",
    status: "ideas",
    priority: "Medium",
    points: 5,
    assignees: [RH],
    dueDate: "Aug 30, 2026",
    sprint: "Unscheduled",
    linkedProject: "Customer Portal MVP",
    aiSuggested: false,
    acceptanceCriteria: [
      { id: "ac1", text: "Users can configure notifications per channel (email, push, in-app)", done: false },
      { id: "ac2", text: "Preferences are saved per user and respected immediately", done: false },
      { id: "ac3", text: "A conservative default preset is applied to new accounts", done: false },
    ],
    activity: [
      { id: "a1", actor: "Reem Al-Harbi",   action: "created this task",          time: "Jun 2, 2026"  },
      { id: "a2", actor: "Lina Alamri",     action: "added acceptance criteria",   time: "Jun 5, 2026"  },
    ],
    aiRecommendation: "Notification fatigue is a retention risk frequently correlated with DAU decline in B2B SaaS products. Medium implementation complexity. Recommend scheduling for Sprint 14 alongside Customer Portal Phase 2 to share the backend notification infrastructure.",
  },
  {
    id: "t3",
    title: "Feature Flags Dashboard",
    description: "Internal UI for toggling feature flags per workspace, user segment, or environment.",
    fullDescription: "Engineering currently manages feature flags through config files and manual deployments. This task would introduce a centralized UI allowing Product and Engineering to collaborate on gradual rollouts, per-workspace toggles, and environment overrides — without code deployments.",
    status: "ideas",
    priority: "High",
    points: 8,
    assignees: [RA],
    dueDate: "Aug 1, 2026",
    sprint: "Unscheduled",
    linkedProject: "API v2 Migration",
    aiSuggested: true,
    acceptanceCriteria: [
      { id: "ac1", text: "Flags can be toggled per workspace, user segment, or environment", done: false },
      { id: "ac2", text: "All flag changes are logged with actor and timestamp", done: false },
      { id: "ac3", text: "Access is restricted to workspace admin users", done: false },
    ],
    activity: [
      { id: "a1", actor: "AI",              action: "suggested this task based on engineering velocity patterns", time: "Jun 10, 2026", ai: true },
      { id: "a2", actor: "Rayan Al-Omari", action: "reviewed and accepted the suggestion",                       time: "Jun 11, 2026" },
    ],
    aiRecommendation: "Similar tooling is available in LaunchDarkly, Statsig, and Unleash. Recommend an RFC evaluating build vs. buy before allocating engineering resources. If building in-house, scope the first iteration to basic flag toggles with audit logging only.",
  },

  // ── Ready ───────────────────────────────────────────────────────────────────
  {
    id: "t4",
    title: "Export Dashboard to PDF",
    description: "One-click export of any dashboard view to a branded, well-formatted PDF.",
    fullDescription: "Executive stakeholders regularly request dashboard snapshots for board presentations and quarterly reviews. This feature should generate a high-fidelity PDF of the current dashboard view, preserving filters, charts, and annotations. Output should include the ProductPilot branding header and a generation timestamp.",
    status: "ready",
    priority: "High",
    points: 5,
    assignees: [FS],
    dueDate: "Jul 10, 2026",
    sprint: "Sprint 12",
    linkedProject: "Analytics Dashboard v3",
    aiSuggested: true,
    acceptanceCriteria: [
      { id: "ac1", text: "Export button is available on all dashboard views",                       done: true  },
      { id: "ac2", text: "Generated PDF preserves the active filters and selected date range",      done: true  },
      { id: "ac3", text: "PDF includes ProductPilot branding header and generation timestamp",      done: false },
      { id: "ac4", text: "Export completes within 5 seconds for standard dashboard configurations", done: false },
    ],
    activity: [
      { id: "a1", actor: "Faisal Al-Sudairy", action: "created this task",                 time: "Jun 8, 2026"  },
      { id: "a2", actor: "AI",                action: "flagged as a high-impact quick win", time: "Jun 9, 2026",  ai: true },
      { id: "a3", actor: "Shahad Qumosani",   action: "moved to Ready",                    time: "Jun 14, 2026" },
    ],
    aiRecommendation: "This feature appeared in 42% of Q2 customer interviews — the highest signal of any unbuilt request. Engineering estimate is 3–5 days. Two of four acceptance criteria are already defined and complete. High impact-to-effort ratio makes this an ideal Sprint 12 candidate.",
  },
  {
    id: "t5",
    title: "User Permissions v2",
    description: "Granular role-based access control with custom permission sets and audit visibility.",
    fullDescription: "Enterprise customers are requesting finer-grained access control beyond the current Admin/Member binary. This task introduces custom permission sets, per-feature visibility toggles, and a permissions audit view for workspace admins. Existing roles must remain unchanged for current users.",
    status: "ready",
    priority: "High",
    points: 8,
    assignees: [AQ],
    dueDate: "Jul 8, 2026",
    sprint: "Sprint 12",
    linkedProject: "Customer Portal MVP",
    aiSuggested: false,
    acceptanceCriteria: [
      { id: "ac1", text: "Admins can create custom roles with per-feature permissions",                    done: true  },
      { id: "ac2", text: "Existing Admin/Member roles remain unchanged for all current users",             done: false },
      { id: "ac3", text: "All permission changes are recorded in the audit log",                          done: false },
      { id: "ac4", text: "Users without a feature permission see an access-denied state, not a 404 page", done: false },
    ],
    activity: [
      { id: "a1", actor: "Abdulrahman Al-Qahtani", action: "created this task",                   time: "Jun 1, 2026"  },
      { id: "a2", actor: "Lina Alamri",            action: "added to Sprint 12",                  time: "Jun 12, 2026" },
      { id: "a3", actor: "Abdulrahman Al-Qahtani", action: "updated story points from 5 to 8",   time: "Jun 18, 2026" },
    ],
    aiRecommendation: "Permission systems have significant downstream impact on every other product feature. Finalizing the data model before implementation starts is critical. Three of four acceptance criteria are still incomplete — recommend a pre-sprint alignment session with engineering before kickoff.",
  },
  {
    id: "t6",
    title: "Mobile Analytics",
    description: "Consolidated mobile metrics — session data, crash rates, and retention cohorts.",
    fullDescription: "Mobile product performance is currently visible only in raw event logs. This task surfaces key mobile metrics — session duration, crash rate by OS and app version, and D1/D7/D30 retention cohorts — directly in the Analytics Dashboard alongside existing web metrics.",
    status: "ready",
    priority: "Medium",
    points: 5,
    assignees: [SA],
    dueDate: "Jul 20, 2026",
    sprint: "Sprint 12",
    linkedProject: "Analytics Dashboard v3",
    aiSuggested: true,
    acceptanceCriteria: [
      { id: "ac1", text: "Session data is visible by date range and platform (iOS/Android)", done: false },
      { id: "ac2", text: "Crash rate is segmented by OS version and app version",            done: false },
      { id: "ac3", text: "Retention cohorts show D1, D7, and D30 for each weekly cohort",   done: false },
    ],
    activity: [
      { id: "a1", actor: "AI",              action: "suggested based on mobile team OKRs",           time: "Jun 5, 2026",  ai: true },
      { id: "a2", actor: "Sara Attar",      action: "accepted suggestion and refined scope",         time: "Jun 6, 2026"  },
      { id: "a3", actor: "Shahad Qumosani", action: "moved to Ready after design sign-off",          time: "Jun 20, 2026" },
    ],
    aiRecommendation: "Mobile retention data is currently a blind spot for the product team. Data sources are confirmed available and the UI scope is well-defined. Acceptance criteria are complete. Low implementation risk — recommend shipping in Sprint 12 alongside the Analytics Dashboard v3 milestone.",
  },

  // ── In Progress ─────────────────────────────────────────────────────────────
  {
    id: "t7",
    title: "Improve Onboarding Completion",
    description: "Redesign the onboarding flow to address the 67% step-2 drop-off via progressive disclosure.",
    fullDescription: "Step 2 of our mobile onboarding — the notification permissions screen — has a 67% drop-off rate. This task redesigns the permissions step using a soft-ask pattern with contextual value framing, progressive feature disclosure, and two A/B tested copy variants. Target: reduce drop-off to under 30% measured at 30 days post-launch.",
    status: "in-progress",
    priority: "High",
    points: 13,
    assignees: [SQ, RA],
    dueDate: "Jun 30, 2026",
    sprint: "Sprint 11",
    linkedProject: "Mobile Onboarding Redesign",
    aiSuggested: false,
    acceptanceCriteria: [
      { id: "ac1", text: "Soft-ask screen appears before the system permissions prompt",                    done: true  },
      { id: "ac2", text: "Step progress indicator is visible throughout the onboarding flow",               done: true  },
      { id: "ac3", text: "Two copy variants are instrumented and reportable in the analytics dashboard",    done: true  },
      { id: "ac4", text: "Drop-off rate reduces from 67% to under 30% (measured at 30 days post-launch)",  done: false },
      { id: "ac5", text: "A feature flag rollback is in place for the new flow",                           done: false },
    ],
    activity: [
      { id: "a1", actor: "Shahad Qumosani", action: "started implementation",                          time: "Jun 15, 2026" },
      { id: "a2", actor: "Rayan Al-Omari",  action: "linked Figma prototype (v3)",                     time: "Jun 16, 2026" },
      { id: "a3", actor: "AI",              action: "flagged two acceptance criteria as incomplete",    time: "Jun 19, 2026", ai: true },
      { id: "a4", actor: "Shahad Qumosani", action: "updated story points from 8 to 13",               time: "Jun 20, 2026" },
    ],
    aiRecommendation: "This task targets a critical activation bottleneck with direct revenue impact. Three of five acceptance criteria are confirmed complete. The drop-off measurement criterion requires analytics instrumentation to be confirmed live before sprint close — flag this risk to engineering immediately.",
  },
  {
    id: "t8",
    title: "Audit Logs",
    description: "Tamper-evident audit trail for all user and admin actions across the platform.",
    fullDescription: "Enterprise and compliance-focused customers require a full audit trail of platform activity. This task implements an immutable log of all write operations — create, update, delete — recording the actor, timestamp, action type, and IP address. The log must be accessible to workspace admins through a filterable UI.",
    status: "in-progress",
    priority: "Medium",
    points: 8,
    assignees: [FS],
    dueDate: "Jul 2, 2026",
    sprint: "Sprint 11",
    linkedProject: "Customer Portal MVP",
    aiSuggested: false,
    acceptanceCriteria: [
      { id: "ac1", text: "All write operations are logged with actor, timestamp, action type, and IP", done: true  },
      { id: "ac2", text: "Logs are immutable and cannot be modified or deleted by any user",           done: true  },
      { id: "ac3", text: "Admins can filter logs by actor, date range, and action type",               done: false },
      { id: "ac4", text: "Logs are retained for a minimum of 12 months",                              done: false },
    ],
    activity: [
      { id: "a1", actor: "Faisal Al-Sudairy",      action: "started implementation",            time: "Jun 17, 2026" },
      { id: "a2", actor: "Abdulrahman Al-Qahtani", action: "reviewed and approved schema design", time: "Jun 19, 2026" },
      { id: "a3", actor: "Faisal Al-Sudairy",      action: "completed backend implementation",   time: "Jun 22, 2026" },
    ],
    aiRecommendation: "Audit logging is a strong enterprise readiness signal and often a procurement blocker. Backend implementation is complete — remaining criteria are UI-layer work only. Task is on track to close before Sprint 11 ends. No risk flags detected.",
  },

  // ── Done ────────────────────────────────────────────────────────────────────
  {
    id: "t9",
    title: "API Rate Limiting",
    description: "Per-endpoint rate limiting with configurable thresholds and clear error messaging.",
    fullDescription: "Without rate limiting, a small number of high-volume API consumers were degrading service quality for other users. This task implemented per-endpoint rate limits with configurable thresholds, structured error responses (HTTP 429 with Retry-After headers), and a usage visibility panel in the admin dashboard.",
    status: "done",
    priority: "Medium",
    points: 5,
    assignees: [AQ],
    dueDate: "Jun 10, 2026",
    sprint: "Sprint 10",
    linkedProject: "API v2 Migration",
    aiSuggested: false,
    acceptanceCriteria: [
      { id: "ac1", text: "Rate limits are enforced per endpoint with configurable thresholds",  done: true },
      { id: "ac2", text: "Exceeding the limit returns HTTP 429 with a Retry-After header",     done: true },
      { id: "ac3", text: "API usage is visible in the admin dashboard",                        done: true },
      { id: "ac4", text: "Rate limit events appear in the audit log",                          done: true },
    ],
    activity: [
      { id: "a1", actor: "Abdulrahman Al-Qahtani", action: "completed implementation",    time: "Jun 8, 2026"  },
      { id: "a2", actor: "Faisal Al-Sudairy",      action: "approved PR",                 time: "Jun 9, 2026"  },
      { id: "a3", actor: "Shahad Qumosani",        action: "marked as Done",              time: "Jun 10, 2026" },
    ],
    aiRecommendation: "Completed successfully. All acceptance criteria met. Consider documenting the threshold configuration approach in the engineering wiki — the pattern established here will apply to any future API surface expansions.",
  },
  {
    id: "t10",
    title: "Team Member Invites",
    description: "Workspace admins can invite new members via email with role pre-assignment.",
    fullDescription: "New workspace members were previously added manually by the customer success team. This task automated the invite flow: admins enter an email address, select a role, and send a time-limited invite link. Accepted invites automatically provision the account with the pre-assigned role.",
    status: "done",
    priority: "Low",
    points: 3,
    assignees: [LA],
    dueDate: "Jun 5, 2026",
    sprint: "Sprint 10",
    linkedProject: "Customer Portal MVP",
    aiSuggested: false,
    acceptanceCriteria: [
      { id: "ac1", text: "Admins can send an invite to any email address",                          done: true },
      { id: "ac2", text: "Invite links expire after 7 days",                                        done: true },
      { id: "ac3", text: "Invited users are pre-assigned the selected role on account creation",    done: true },
    ],
    activity: [
      { id: "a1", actor: "Lina Alamri",    action: "completed implementation", time: "Jun 3, 2026" },
      { id: "a2", actor: "Reem Al-Harbi",  action: "QA sign-off",              time: "Jun 4, 2026" },
      { id: "a3", actor: "Shahad Qumosani", action: "marked as Done",          time: "Jun 5, 2026" },
    ],
    aiRecommendation: "Completed. The 7-day invite expiry may be too short for some enterprise procurement workflows — consider making it admin-configurable in a future iteration, based on customer feedback from the portal rollout.",
  },
  {
    id: "t11",
    title: "CSV Export Feature",
    description: "Export any filtered data view to CSV with column selection and UTF-8 encoding.",
    fullDescription: "Users needed the ability to extract raw data from any filtered table view for external analysis in Excel and Google Sheets. This task implemented a one-click CSV export that respects active filters, allows column selection before download, and outputs clean UTF-8 encoded data with a proper header row.",
    status: "done",
    priority: "High",
    points: 8,
    assignees: [FS],
    dueDate: "Jun 20, 2026",
    sprint: "Sprint 10",
    linkedProject: "CSV Export Feature",
    aiSuggested: false,
    acceptanceCriteria: [
      { id: "ac1", text: "Export button is visible on all filterable table views",            done: true },
      { id: "ac2", text: "Active filters are applied to the exported data",                  done: true },
      { id: "ac3", text: "User can select which columns to include before exporting",        done: true },
      { id: "ac4", text: "Output is UTF-8 encoded with a proper header row",                done: true },
    ],
    activity: [
      { id: "a1", actor: "Faisal Al-Sudairy", action: "completed backend implementation",  time: "Jun 14, 2026" },
      { id: "a2", actor: "Shahad Qumosani",   action: "reviewed and approved",             time: "Jun 18, 2026" },
      { id: "a3", actor: "Faisal Al-Sudairy", action: "shipped to production",             time: "Jun 20, 2026" },
    ],
    aiRecommendation: "Completed. Strong adoption post-launch — 34% of active users exported within the first week. Consider scheduled exports as a follow-on task for power users who need regular data pulls without manual intervention.",
  },
]

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({
  task,
  index,
  onClick,
  isSelected,
}: {
  task: Task
  index: number
  onClick: () => void
  isSelected: boolean
}) {
  const pc = priorityConfig[task.priority]
  const isDone = task.status === "done"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25, ease: "easeOut" as const }}
      whileHover={{ y: -1, transition: { duration: 0.12 } }}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col rounded-[12px] border border-border bg-card cursor-pointer overflow-hidden",
        "shadow-[0_1px_3px_oklch(0_0_0/0.05)]",
        "hover:shadow-[0_4px_16px_oklch(0_0_0/0.09)] hover:border-primary/20",
        "transition-shadow transition-[border-color] duration-200",
        isSelected && "ring-2 ring-primary/30 border-primary/25 bg-primary/[0.025]",
        isDone && "opacity-60"
      )}
    >
      {/* Priority accent strip */}
      <div className={cn("h-[3px] w-full shrink-0", pc.accentBar)} />

      <div className="flex flex-col gap-3 p-4">
        {/* AI chip */}
        {task.aiSuggested && (
          <div className="flex items-center gap-1 self-start rounded-full border border-primary/20 bg-primary/[0.07] px-2 py-0.5">
            <Sparkles className="h-2.5 w-2.5 text-primary" strokeWidth={2} />
            <span className="text-[10px] font-semibold text-primary">AI Suggested</span>
          </div>
        )}

        {/* Title */}
        <h3
          className={cn(
            "text-[13px] font-semibold leading-snug",
            isDone ? "text-muted-foreground line-through" : "text-foreground"
          )}
        >
          {task.title}
        </h3>

        {/* Description */}
        <p className="text-[11.5px] text-muted-foreground leading-relaxed line-clamp-2 -mt-1">
          {task.description}
        </p>

        {/* Priority + points */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium",
              pc.bg, pc.text, pc.border
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", pc.dot)} />
            {task.priority}
          </span>
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10.5px] font-semibold text-muted-foreground">
            {task.points} pts
          </span>
          {isDone && (
            <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-600">
              <Check className="h-3 w-3" strokeWidth={2.5} />
              Done
            </span>
          )}
        </div>

        {/* Footer: due date + assignees */}
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-1 text-muted-foreground/50">
            <Calendar className="h-3 w-3" strokeWidth={1.7} />
            <span className="text-[11px]">{task.dueDate}</span>
          </div>
          <div className="flex items-center">
            {task.assignees.slice(0, 3).map((member, i) => (
              <div
                key={member.name}
                title={member.name}
                style={{ zIndex: task.assignees.length - i }}
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-card text-[7.5px] font-bold text-white",
                  member.color,
                  i > 0 && "-ml-1.5"
                )}
              >
                {member.initials}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Task Drawer ──────────────────────────────────────────────────────────────

function TaskDrawer({ task, onClose }: { task: Task; onClose: () => void }) {
  const pc = priorityConfig[task.priority]
  const col = COLUMNS.find((c) => c.id === task.status)!
  const completedCount = task.acceptanceCriteria.filter((ac) => ac.done).length

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
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", col.dot)} />
                {col.label}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                  pc.bg, pc.text, pc.border
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", pc.dot)} />
                {task.priority}
              </span>
              {task.aiSuggested && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/[0.07] px-2 py-0.5 text-[10px] font-semibold text-primary">
                  <Sparkles className="h-2.5 w-2.5" strokeWidth={2} />
                  AI Suggested
                </span>
              )}
            </div>
            <h2 className="text-[16px] font-semibold text-foreground leading-snug">{task.title}</h2>
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

        {/* Description */}
        <section>
          <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
            Description
          </p>
          <p className="text-[13px] text-foreground/80 leading-relaxed">{task.fullDescription}</p>
        </section>

        {/* Metadata grid */}
        <section className="grid grid-cols-2 gap-3">
          {/* Linked Project */}
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Linked Project
            </p>
            <div className="flex items-center gap-1.5">
              <FolderKanban className="h-3.5 w-3.5 shrink-0 text-primary/60" strokeWidth={1.7} />
              <span className="text-[12.5px] font-medium text-foreground truncate">{task.linkedProject}</span>
            </div>
          </div>

          {/* Sprint */}
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Sprint
            </p>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" strokeWidth={1.7} />
              <span className="text-[12.5px] font-medium text-foreground">{task.sprint}</span>
            </div>
          </div>

          {/* Story points */}
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Story Points
            </p>
            <span className="text-[18px] font-bold text-foreground leading-none">{task.points}</span>
          </div>

          {/* Due date */}
          <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Due Date
            </p>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" strokeWidth={1.7} />
              <span className="text-[12.5px] font-medium text-foreground">{task.dueDate}</span>
            </div>
          </div>
        </section>

        {/* Assignees */}
        <section>
          <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
            {task.assignees.length === 1 ? "Assignee" : "Assignees"}
          </p>
          <div className="space-y-2.5">
            {task.assignees.map((member) => (
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
                  <p className="text-[12.5px] font-medium text-foreground leading-none">{member.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/55">
                    {task.assignees[0].name === member.name ? "Lead" : "Contributor"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Acceptance Criteria */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
              Acceptance Criteria
            </p>
            <span className="text-[11px] text-muted-foreground/55">
              {completedCount} / {task.acceptanceCriteria.length} met
            </span>
          </div>
          <div className="space-y-2">
            {task.acceptanceCriteria.map((criterion) => (
              <div
                key={criterion.id}
                className={cn(
                  "flex items-start gap-3 rounded-[9px] border px-3.5 py-3",
                  criterion.done
                    ? "border-emerald-200/60 bg-emerald-50/50"
                    : "border-border bg-muted/30"
                )}
              >
                {criterion.done ? (
                  <CheckCircle2 className="mt-[1px] h-4 w-4 shrink-0 text-emerald-500" strokeWidth={1.85} />
                ) : (
                  <Circle className="mt-[1px] h-4 w-4 shrink-0 text-muted-foreground/35" strokeWidth={1.7} />
                )}
                <p
                  className={cn(
                    "text-[12.5px] font-medium leading-snug",
                    criterion.done ? "text-muted-foreground/60" : "text-foreground"
                  )}
                >
                  {criterion.text}
                </p>
              </div>
            ))}
          </div>
        </section>

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
              {task.aiRecommendation}
            </p>
          </div>
        </section>

        {/* Activity */}
        <section>
          <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/45">
            Activity
          </p>
          <div className="space-y-4">
            {task.activity.map((entry) => (
              <div key={entry.id} className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[7.5px] font-bold",
                    entry.ai
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
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

export default function BacklogPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery]   = useState("")
  const [showSearch, setShowSearch]     = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedTask) setSelectedTask(null)
        else if (showSearch) { setShowSearch(false); setSearchQuery("") }
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [selectedTask, showSearch])

  const q = searchQuery.trim().toLowerCase()
  const filteredTasks = q
    ? TASKS.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.linkedProject.toLowerCase().includes(q)
      )
    : TASKS

  const totalCount = TASKS.length
  const doneCount  = TASKS.filter((t) => t.status === "done").length

  return (
    <div className="flex flex-col gap-6 min-h-full">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground leading-none mb-2">
            Backlog
          </h1>
          <p className="text-[13.5px] text-muted-foreground">
            Organize work, prioritize features, and prepare upcoming sprints.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Search toggle */}
          <AnimatePresence mode="wait">
            {showSearch ? (
              <motion.div
                key="search-input"
                initial={{ width: 40, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                exit={{ width: 40, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" as const }}
                className="flex items-center gap-2 rounded-[9px] border border-border bg-card px-3 h-9 focus-within:border-primary/30 transition-colors duration-150 overflow-hidden"
              >
                <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/55 outline-none min-w-0"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.button
                key="search-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSearch(true)}
                className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
              >
                <Search className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Filter button (UI only) */}
          <button className="flex h-9 items-center gap-1.5 rounded-[9px] border border-border bg-card px-3 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>

          {/* New Task (UI only) */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            className="flex h-9 items-center gap-2 rounded-[9px] bg-primary px-4 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors duration-150"
          >
            <Plus className="h-4 w-4" />
            New Task
          </motion.button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="flex items-center gap-5 -mt-2">
        <span className="text-[13px] text-muted-foreground">
          <span className="font-semibold text-foreground">{totalCount}</span> tasks total
        </span>
        <span className="text-muted-foreground/30">·</span>
        <span className="text-[13px] text-muted-foreground">
          <span className="font-semibold text-emerald-600">{doneCount}</span> completed
        </span>
        <span className="text-muted-foreground/30">·</span>
        <span className="text-[13px] text-muted-foreground">
          <span className="font-semibold text-amber-600">
            {TASKS.filter((t) => t.status === "in-progress").length}
          </span>{" "}
          in progress
        </span>
        {q && (
          <>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-[13px] text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredTasks.length}</span> matching &ldquo;{searchQuery}&rdquo;
            </span>
            <button
              onClick={() => { setSearchQuery(""); setShowSearch(false) }}
              className="text-[12.5px] text-primary hover:underline"
            >
              Clear
            </button>
          </>
        )}
      </div>

      {/* ── Kanban Board ── */}
      <div className="-mx-8 overflow-x-auto pb-1">
        <div className="flex gap-5 px-8 pb-8" style={{ minWidth: "min-content" }}>
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id)
            return (
              <div key={col.id} className="flex w-[268px] shrink-0 flex-col">

                {/* Column header */}
                <div className="mb-3 flex items-center gap-2 px-0.5">
                  <span className={cn("h-2 w-2 rounded-full shrink-0", col.dot)} />
                  <span className="text-[13px] font-semibold text-foreground">{col.label}</span>
                  <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column accent line */}
                <div className={cn("mb-3 h-[2px] w-full rounded-full opacity-50", col.accent)} />

                {/* Cards lane */}
                <div className="flex flex-col gap-3 rounded-[14px] bg-[oklch(0.975_0.004_265)] p-3 min-h-[320px] border border-border/40">
                  {colTasks.map((task, i) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={i}
                      onClick={() =>
                        setSelectedTask((prev) => (prev?.id === task.id ? null : task))
                      }
                      isSelected={selectedTask?.id === task.id}
                    />
                  ))}

                  {colTasks.length === 0 && (
                    <div className="flex flex-1 items-center justify-center py-12">
                      <p className="text-[12px] text-muted-foreground/35">{col.emptyLabel}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Drawer ── */}
      <AnimatePresence>
        {selectedTask && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-foreground/[0.04]"
              onClick={() => setSelectedTask(null)}
            />
            <TaskDrawer
              key={selectedTask.id}
              task={selectedTask}
              onClose={() => setSelectedTask(null)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
