"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertTriangle,
  Bell,
  Bot,
  Check,
  ChevronDown,
  Globe,
  KeyRound,
  Laptop,
  LogOut,
  Moon,
  Pencil,
  Shield,
  Sliders,
  Smartphone,
  Sparkles,
  Sun,
  Trash2,
  User,
  X,
  Building2,
  Monitor,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type ThemeOption  = "light" | "dark" | "system"
type ResponseLen  = "concise" | "balanced" | "detailed"

interface NavSection {
  id: string
  label: string
  icon: React.ReactNode
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV: NavSection[] = [
  { id: "profile",        label: "Profile",         icon: <User        className="h-3.5 w-3.5" strokeWidth={1.8} /> },
  { id: "workspace",      label: "Workspace",       icon: <Building2   className="h-3.5 w-3.5" strokeWidth={1.8} /> },
  { id: "notifications",  label: "Notifications",   icon: <Bell        className="h-3.5 w-3.5" strokeWidth={1.8} /> },
  { id: "security",       label: "Security",        icon: <Shield      className="h-3.5 w-3.5" strokeWidth={1.8} /> },
  { id: "appearance",     label: "Appearance",      icon: <Monitor     className="h-3.5 w-3.5" strokeWidth={1.8} /> },
  { id: "ai",             label: "AI Preferences",  icon: <Sparkles    className="h-3.5 w-3.5" strokeWidth={1.8} /> },
  { id: "danger",         label: "Danger Zone",     icon: <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.8} /> },
]

// ─── Primitives ───────────────────────────────────────────────────────────────

function SectionCard({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div
      id={id}
      className="scroll-mt-6 overflow-hidden rounded-[14px] border border-border bg-card shadow-[0_1px_4px_oklch(0_0_0/0.05)]"
    >
      {children}
    </div>
  )
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border-b border-border px-6 py-5">
      <h2 className="text-[14px] font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="mt-0.5 text-[12.5px] text-muted-foreground/70 leading-snug">{description}</p>
      )}
    </div>
  )
}

function SettingRow({
  label,
  description,
  children,
  last = false,
}: {
  label: string
  description?: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <div className={cn(
      "flex items-center justify-between gap-6 px-6 py-4",
      !last && "border-b border-border/60"
    )}>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-foreground">{label}</p>
        {description && (
          <p className="mt-0.5 text-[12px] text-muted-foreground/60 leading-snug">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
        "transition-colors duration-200 focus:outline-none",
        checked ? "bg-primary" : "bg-muted-foreground/20"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm",
          "transform transition-transform duration-200",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  )
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 appearance-none rounded-[8px] border border-border bg-card py-1.5 pl-3 pr-8 text-[12.5px] text-foreground focus:border-primary/30 focus:outline-none transition-colors duration-150 cursor-pointer min-w-[160px]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

function MockButton({
  children,
  variant = "default",
  icon,
  onClick,
}: {
  children: React.ReactNode
  variant?: "default" | "danger" | "ghost"
  icon?: React.ReactNode
  onClick?: () => void
}) {
  const base = "inline-flex h-8 items-center gap-1.5 rounded-[8px] px-3.5 text-[12.5px] font-medium transition-colors duration-150 cursor-pointer border"
  const variants = {
    default: "bg-card border-border text-foreground/80 hover:bg-muted hover:text-foreground",
    danger:  "bg-red-50 border-red-200/70 text-red-700 hover:bg-red-100",
    ghost:   "bg-transparent border-transparent text-foreground/60 hover:bg-muted hover:text-foreground",
  }
  return (
    <button onClick={onClick} className={cn(base, variants[variant])}>
      {icon}
      {children}
    </button>
  )
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600)
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
      <p className="text-[13px] font-medium text-background whitespace-nowrap">{message}</p>
    </motion.div>
  )
}

function ConfirmDialog({
  title,
  description,
  confirmLabel,
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}: {
  title: string
  description: string
  confirmLabel: string
  confirmVariant?: "danger" | "default"
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/20 backdrop-blur-[2px]"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.16, ease: "easeOut" as const }}
        onClick={(e) => e.stopPropagation()}
        className="w-[400px] rounded-[16px] border border-border bg-card p-6 shadow-[0_20px_60px_oklch(0_0_0/0.15)]"
      >
        <div className="mb-1 flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors duration-150">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-5 text-[13px] text-muted-foreground/70 leading-relaxed">{description}</p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="h-8 rounded-[8px] border border-border bg-card px-3.5 text-[12.5px] font-medium text-foreground/70 hover:bg-muted transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "h-8 rounded-[8px] px-3.5 text-[12.5px] font-medium transition-colors duration-150",
              confirmVariant === "danger"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-primary text-white hover:bg-primary/90"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Segment control (theme + response length) ────────────────────────────────

function SegmentControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; icon?: React.ReactNode }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex rounded-[9px] border border-border bg-muted/40 p-0.5 gap-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "relative inline-flex h-7 items-center gap-1.5 rounded-[7px] px-3 text-[12px] font-medium transition-all duration-150",
            value === o.value
              ? "bg-card text-foreground shadow-[0_1px_3px_oklch(0_0_0/0.08)] border border-border/60"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-10 w-10 text-[15px]", md: "h-14 w-14 text-[20px]", lg: "h-16 w-16 text-[22px]" }
  return (
    <div className={cn(
      "flex shrink-0 items-center justify-center rounded-full bg-violet-500 font-bold text-white",
      sizes[size]
    )}>
      SQ
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {

  // ── Active section tracking ──
  const [activeSection, setActiveSection] = useState("profile")
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = contentRef.current
    if (!container) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { root: container, rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    )
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el || !contentRef.current) return
    const offset = el.offsetTop - 140
    contentRef.current.scrollTo({ top: offset, behavior: "smooth" })
  }

  // ── Profile ──
  const [profileEditing, setProfileEditing] = useState(false)

  // ── Workspace ──
  const [workspaceName, setWorkspaceName] = useState("ProductPilot")
  const [company, setCompany]             = useState("Qumosani Ventures")
  const [timezone, setTimezone]           = useState("Asia/Riyadh")
  const [language, setLanguage]           = useState("en")

  // ── Notifications ──
  const [emailNotifs, setEmailNotifs]     = useState(true)
  const [inAppNotifs, setInAppNotifs]     = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(true)
  const [productUpdates, setProductUpdates] = useState(false)

  // ── Appearance ──
  const [theme, setTheme] = useState<ThemeOption>("system")

  // ── AI ──
  const [aiModel, setAiModel]             = useState("claude-sonnet-5")
  const [responseLen, setResponseLen]     = useState<ResponseLen>("balanced")
  const [autoSave, setAutoSave]           = useState(true)
  const [aiSuggestions, setAiSuggestions] = useState(true)

  // ── Toast & dialogs ──
  const [toast, setToast]         = useState<string | null>(null)
  const [dialog, setDialog]       = useState<"archive" | "cleardata" | "signout" | null>(null)

  function showToast(msg: string) { setToast(msg) }

  const DIALOG_CONFIG = {
    archive: {
      title: "Archive Workspace",
      description: "This will archive the ProductPilot workspace and make it read-only. All data will be preserved. You can restore it at any time from your account settings.",
      confirmLabel: "Archive Workspace",
      confirmVariant: "danger" as const,
      onConfirm: () => { setDialog(null); showToast("Workspace archived. You can restore it from your account.") },
    },
    cleardata: {
      title: "Clear Mock Data",
      description: "This will remove all mock projects, tasks, and roadmap items. Your account settings and team configuration will not be affected.",
      confirmLabel: "Clear Data",
      confirmVariant: "danger" as const,
      onConfirm: () => { setDialog(null); showToast("Mock data cleared successfully.") },
    },
    signout: {
      title: "Sign Out Other Devices",
      description: "All sessions except this one will be immediately signed out. Affected users will need to sign in again.",
      confirmLabel: "Sign Out Devices",
      confirmVariant: "danger" as const,
      onConfirm: () => { setDialog(null); showToast("All other devices have been signed out.") },
    },
  }

  return (
    <div className="flex h-full gap-8">

      {/* ── Left nav ── */}
      <aside className="hidden w-[180px] shrink-0 lg:block">
        <nav className="sticky top-0 space-y-0.5">
          {NAV.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-[9px] px-3 py-2 text-[13px] transition-colors duration-120",
                activeSection === id
                  ? "bg-primary/[0.07] font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                id === "danger" && activeSection !== "danger" && "text-red-500/70 hover:text-red-600"
              )}
            >
              <span className={cn(
                "shrink-0",
                activeSection === id ? "text-primary" : id === "danger" ? "text-red-400" : "text-muted-foreground/60"
              )}>
                {icon}
              </span>
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Content ── */}
      <div
        ref={contentRef}
        className="flex-1 min-w-0 overflow-y-auto space-y-5 pb-16"
        style={{ maxHeight: "calc(100vh - 7rem)" }}
      >

        {/* ── 1 · Profile ── */}
        <SectionCard id="profile">
          <SectionHeader
            title="Profile"
            description="Your personal information visible to teammates."
          />
          <div className="px-6 py-5">
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar size="lg" />
                <button
                  onClick={() => showToast("Avatar upload coming soon.")}
                  className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-colors duration-150"
                >
                  <Pencil className="h-2.5 w-2.5" strokeWidth={2.5} />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold text-foreground">Shahad Qumosani</p>
                <p className="text-[13px] text-muted-foreground/70">Product Manager · Owner</p>
                <p className="mt-0.5 text-[12.5px] text-muted-foreground/50">shahad@productpilot.io</p>
              </div>
              <MockButton
                icon={<Pencil className="h-3 w-3" strokeWidth={2.2} />}
                onClick={() => { setProfileEditing(true); showToast("Profile editing coming soon.") }}
              >
                Edit Profile
              </MockButton>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: "Full name",   value: "Shahad Qumosani" },
                { label: "Role",        value: "Product Manager" },
                { label: "Email",       value: "shahad@productpilot.io" },
                { label: "Member since", value: "January 2024" },
              ].map((f) => (
                <div key={f.label} className="rounded-[9px] border border-border bg-muted/25 px-3.5 py-3">
                  <p className="mb-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/40">{f.label}</p>
                  <p className="text-[13px] font-medium text-foreground">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* ── 2 · Workspace ── */}
        <SectionCard id="workspace">
          <SectionHeader
            title="Workspace"
            description="Settings that apply to all members of this workspace."
          />
          {/* Logo row */}
          <div className="flex items-center gap-4 border-b border-border/60 px-6 py-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] border-2 border-dashed border-border bg-muted/30 text-muted-foreground/30">
              <Building2 className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-foreground">Company logo</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground/55">PNG or SVG, recommended 256×256px.</p>
            </div>
            <MockButton onClick={() => showToast("Logo upload coming soon.")}>Upload logo</MockButton>
          </div>

          <SettingRow label="Workspace name" description="Visible to all members.">
            <input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="h-8 w-[200px] rounded-[8px] border border-border bg-card px-3 text-[12.5px] text-foreground focus:border-primary/30 focus:outline-none transition-colors duration-150"
            />
          </SettingRow>
          <SettingRow label="Company" description="Used in exports and reports.">
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="h-8 w-[200px] rounded-[8px] border border-border bg-card px-3 text-[12.5px] text-foreground focus:border-primary/30 focus:outline-none transition-colors duration-150"
            />
          </SettingRow>
          <SettingRow label="Timezone" description="Used for scheduling and notifications.">
            <SelectInput
              value={timezone}
              onChange={setTimezone}
              options={[
                { value: "Asia/Riyadh",  label: "Riyadh (GMT+3)"      },
                { value: "Asia/Dubai",   label: "Dubai (GMT+4)"        },
                { value: "Europe/London", label: "London (GMT+1)"       },
                { value: "America/New_York", label: "New York (GMT-4)"  },
                { value: "America/Los_Angeles", label: "Los Angeles (GMT-7)" },
                { value: "Asia/Tokyo",   label: "Tokyo (GMT+9)"        },
              ]}
            />
          </SettingRow>
          <SettingRow label="Language" description="Interface language for this workspace." last>
            <SelectInput
              value={language}
              onChange={setLanguage}
              options={[
                { value: "en", label: "English"  },
                { value: "ar", label: "Arabic"   },
                { value: "fr", label: "French"   },
                { value: "de", label: "German"   },
                { value: "es", label: "Spanish"  },
              ]}
            />
          </SettingRow>
        </SectionCard>

        {/* ── 3 · Notifications ── */}
        <SectionCard id="notifications">
          <SectionHeader
            title="Notifications"
            description="Control how and when ProductPilot contacts you."
          />
          <SettingRow
            label="Email notifications"
            description="Receive updates about projects and tasks by email."
          >
            <Toggle checked={emailNotifs} onChange={setEmailNotifs} />
          </SettingRow>
          <SettingRow
            label="In-app notifications"
            description="Show badge counts and notification centre alerts."
          >
            <Toggle checked={inAppNotifs} onChange={setInAppNotifs} />
          </SettingRow>
          <SettingRow
            label="Weekly summary"
            description="A digest of your team's activity every Monday morning."
          >
            <Toggle checked={weeklySummary} onChange={setWeeklySummary} />
          </SettingRow>
          <SettingRow
            label="Product updates"
            description="Announcements about new features and improvements."
            last
          >
            <Toggle checked={productUpdates} onChange={setProductUpdates} />
          </SettingRow>
        </SectionCard>

        {/* ── 4 · Security ── */}
        <SectionCard id="security">
          <SectionHeader
            title="Security"
            description="Manage authentication and active sessions."
          />
          {/* 2FA */}
          <div className="flex items-center justify-between gap-6 border-b border-border/60 px-6 py-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-medium text-foreground">Two-factor authentication</p>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/70 bg-emerald-50 px-2 py-0.5 text-[10.5px] font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Enabled
                </span>
              </div>
              <p className="mt-0.5 text-[12px] text-muted-foreground/60">Authenticator app · added Jan 14, 2026</p>
            </div>
            <MockButton
              icon={<Smartphone className="h-3 w-3" strokeWidth={2} />}
              onClick={() => showToast("2FA management coming soon.")}
            >
              Manage
            </MockButton>
          </div>

          {/* Active session */}
          <div className="flex items-center justify-between gap-6 border-b border-border/60 px-6 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-foreground">Active session</p>
              <div className="mt-1 flex items-center gap-2 text-[12px] text-muted-foreground/60">
                <Laptop className="h-3.5 w-3.5 shrink-0" strokeWidth={1.7} />
                <span>Chrome on macOS · Riyadh, SA</span>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-emerald-600">Current</span>
              </div>
            </div>
            <MockButton
              icon={<LogOut className="h-3 w-3" strokeWidth={2} />}
              variant="danger"
              onClick={() => setDialog("signout")}
            >
              Sign out others
            </MockButton>
          </div>

          {/* Change password */}
          <div className="flex items-center justify-between gap-6 px-6 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-foreground">Password</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground/60">Last changed 3 months ago.</p>
            </div>
            <MockButton
              icon={<KeyRound className="h-3 w-3" strokeWidth={2} />}
              onClick={() => showToast("Password change email sent to shahad@productpilot.io")}
            >
              Change password
            </MockButton>
          </div>
        </SectionCard>

        {/* ── 5 · Appearance ── */}
        <SectionCard id="appearance">
          <SectionHeader
            title="Appearance"
            description="Choose how ProductPilot looks on your device."
          />
          <div className="px-6 py-5">
            <p className="mb-3 text-[13px] font-medium text-foreground">Theme</p>
            <div className="flex gap-3">
              {(
                [
                  { value: "light",  label: "Light",  icon: <Sun     className="h-4 w-4" strokeWidth={1.8} /> },
                  { value: "dark",   label: "Dark",   icon: <Moon    className="h-4 w-4" strokeWidth={1.8} /> },
                  { value: "system", label: "System", icon: <Laptop  className="h-4 w-4" strokeWidth={1.8} /> },
                ] as { value: ThemeOption; label: string; icon: React.ReactNode }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-2 rounded-[11px] border py-4 transition-all duration-150",
                    theme === opt.value
                      ? "border-primary/40 bg-primary/[0.04] text-primary shadow-[0_0_0_3px_oklch(0.52_0.22_280/0.08)]"
                      : "border-border bg-card text-muted-foreground hover:border-border/80 hover:bg-muted/30 hover:text-foreground"
                  )}
                >
                  {/* Mini preview */}
                  <div className={cn(
                    "h-10 w-16 rounded-[6px] border overflow-hidden",
                    opt.value === "light"  ? "bg-white border-slate-200" :
                    opt.value === "dark"   ? "bg-slate-900 border-slate-700" :
                    "bg-gradient-to-br from-white to-slate-900 border-slate-300"
                  )}>
                    <div className={cn(
                      "h-2.5 w-full border-b",
                      opt.value === "light"  ? "bg-slate-50 border-slate-200" :
                      opt.value === "dark"   ? "bg-slate-800 border-slate-700" :
                      "bg-slate-200/70 border-slate-300"
                    )} />
                    <div className="flex gap-1 p-1.5">
                      <div className={cn("h-full w-4 rounded-[2px]",
                        opt.value === "light" ? "bg-slate-100" : opt.value === "dark" ? "bg-slate-700" : "bg-slate-300/60"
                      )} />
                      <div className="flex-1 space-y-1">
                        <div className={cn("h-1 rounded-[1px]",
                          opt.value === "light" ? "bg-slate-200" : opt.value === "dark" ? "bg-slate-600" : "bg-slate-400/50"
                        )} />
                        <div className={cn("h-1 w-2/3 rounded-[1px]",
                          opt.value === "light" ? "bg-slate-100" : opt.value === "dark" ? "bg-slate-700" : "bg-slate-300/50"
                        )} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {opt.icon}
                    <span className="text-[12.5px] font-medium">{opt.label}</span>
                    {theme === opt.value && (
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* ── 6 · AI Preferences ── */}
        <SectionCard id="ai">
          <SectionHeader
            title="AI Preferences"
            description="Customise how the AI Workspace behaves for you."
          />
          <SettingRow
            label="Default AI model"
            description="Used for new conversations unless changed per-session."
          >
            <SelectInput
              value={aiModel}
              onChange={setAiModel}
              options={[
                { value: "claude-sonnet-5",  label: "Claude Sonnet 5"  },
                { value: "claude-opus-4-8",  label: "Claude Opus 4.8"  },
                { value: "claude-haiku-4-5", label: "Claude Haiku 4.5" },
                { value: "claude-fable-5",   label: "Claude Fable 5"   },
              ]}
            />
          </SettingRow>
          <SettingRow
            label="Response length"
            description="Controls how concise or thorough AI responses are by default."
          >
            <SegmentControl<ResponseLen>
              value={responseLen}
              onChange={setResponseLen}
              options={[
                { value: "concise",  label: "Concise"  },
                { value: "balanced", label: "Balanced" },
                { value: "detailed", label: "Detailed" },
              ]}
            />
          </SettingRow>
          <SettingRow
            label="Auto-save generated artifacts"
            description="Automatically save AI-generated documents to the Documents page."
          >
            <Toggle checked={autoSave} onChange={setAutoSave} />
          </SettingRow>
          <SettingRow
            label="Enable AI suggestions"
            description="Show inline suggestions in the Backlog and Roadmap."
            last
          >
            <Toggle checked={aiSuggestions} onChange={setAiSuggestions} />
          </SettingRow>
        </SectionCard>

        {/* ── 7 · Danger Zone ── */}
        <SectionCard id="danger">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-[14px] font-semibold text-red-600">Danger Zone</h2>
            <p className="mt-0.5 text-[12.5px] text-muted-foreground/70 leading-snug">
              These actions are irreversible. Proceed with caution.
            </p>
          </div>

          {/* Archive */}
          <div className="flex items-center justify-between gap-6 border-b border-border/60 px-6 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-foreground">Archive workspace</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground/60">
                Puts this workspace into read-only mode. Data is preserved and can be restored.
              </p>
            </div>
            <button
              onClick={() => setDialog("archive")}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[8px] border border-red-200/70 bg-red-50 px-3.5 text-[12.5px] font-medium text-red-700 hover:bg-red-100 transition-colors duration-150"
            >
              <Trash2 className="h-3 w-3" strokeWidth={2} />
              Archive workspace
            </button>
          </div>

          {/* Clear data */}
          <div className="flex items-center justify-between gap-6 px-6 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-foreground">Clear mock data</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground/60">
                Removes all mock projects, tasks, and roadmap items. Account settings are unaffected.
              </p>
            </div>
            <button
              onClick={() => setDialog("cleardata")}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[8px] border border-red-200/70 bg-red-50 px-3.5 text-[12.5px] font-medium text-red-700 hover:bg-red-100 transition-colors duration-150"
            >
              <Trash2 className="h-3 w-3" strokeWidth={2} />
              Clear mock data
            </button>
          </div>
        </SectionCard>

      </div>{/* end content */}

      {/* ── Confirm dialog ── */}
      <AnimatePresence>
        {dialog && (
          <ConfirmDialog
            key={dialog}
            {...DIALOG_CONFIG[dialog]}
            onCancel={() => setDialog(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && <Toast key="toast" message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  )
}
