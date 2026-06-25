"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BarChart2,
  ListOrdered,
  MessageSquare,
  Zap,
  Copy,
  Check,
  Pencil,
  Download,
  MoreHorizontal,
  History,
  ArrowDownToLine,
  Save,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ArtifactItem, ArtifactStatus, ArtifactType } from "./types"

// ─── Config ──────────────────────────────────────────────────────────────────

const statusStyles: Record<ArtifactStatus, { dot: string; bg: string; text: string; border: string }> = {
  Ready:       { dot: "bg-emerald-500", bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200/70" },
  Draft:       { dot: "bg-amber-400",   bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-200/70"   },
  "In Review": { dot: "bg-blue-500",    bg: "bg-blue-50",     text: "text-blue-700",    border: "border-blue-200/70"    },
}

const artifactConfig: Record<ArtifactType, {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  accentClass: string
  title: string
}> = {
  "user-story":          { icon: BookOpen,      iconBg: "bg-violet-50",  iconColor: "text-violet-500",  accentClass: "border-l-violet-300",  title: "User Story"           },
  "acceptance-criteria": { icon: CheckCircle2,  iconBg: "bg-blue-50",    iconColor: "text-blue-500",    accentClass: "border-l-blue-300",    title: "Acceptance Criteria"  },
  "edge-cases":          { icon: AlertTriangle, iconBg: "bg-amber-50",   iconColor: "text-amber-500",   accentClass: "border-l-amber-300",   title: "Edge Cases"           },
  "kpis":                { icon: BarChart2,     iconBg: "bg-emerald-50", iconColor: "text-emerald-500", accentClass: "border-l-emerald-300", title: "KPIs"                 },
  "priority":            { icon: Zap,           iconBg: "bg-red-50",     iconColor: "text-red-500",     accentClass: "border-l-red-300",     title: "Priority Score"       },
  "release-notes":       { icon: FileText,      iconBg: "bg-slate-50",   iconColor: "text-slate-500",   accentClass: "border-l-slate-300",   title: "Release Notes"        },
  "meeting-summary":     { icon: MessageSquare, iconBg: "bg-rose-50",    iconColor: "text-rose-500",    accentClass: "border-l-rose-300",    title: "Meeting Summary"      },
  "prioritization":      { icon: ListOrdered,   iconBg: "bg-orange-50",  iconColor: "text-orange-500",  accentClass: "border-l-orange-300",  title: "Prioritization"       },
}

// ─── Content renderers ────────────────────────────────────────────────────────

function UserStoryRenderer({ content }: { content: string }) {
  const lines = content.split("\n").filter(Boolean)
  return (
    <div className="rounded-[9px] bg-violet-50/60 border border-violet-100 px-3.5 py-3.5">
      <p className="text-[13px] text-foreground/85 leading-[1.7]">
        {lines.map((line, i) => {
          let prefix = ""
          let rest = line
          if (line.startsWith("As ")) { prefix = "As "; rest = line.slice(3) }
          else if (line.startsWith("I want to ")) { prefix = "I want to "; rest = line.slice(10) }
          else if (line.startsWith("so that ")) { prefix = "so that "; rest = line.slice(8) }
          return (
            <span key={i}>
              {prefix && <span className="text-muted-foreground">{prefix}</span>}
              <span className={prefix ? "font-semibold text-foreground" : ""}>{rest}</span>
              {i < lines.length - 1 && <br />}
            </span>
          )
        })}
      </p>
    </div>
  )
}

function ChecklistRenderer({ content, variant }: { content: string; variant: "check" | "warning" }) {
  const lines = content.split("\n").filter(Boolean)
  return (
    <ul className="space-y-2.5">
      {lines.map((line, i) => {
        const text = line.replace(/^[\s]*-\s/, "")
        const hasRisk = text.includes("[Engineering risk]")
        const cleanText = text.replace(" [Engineering risk]", "").replace("[Engineering risk]", "").trim()
        return (
          <li key={i} className="flex items-start gap-2.5">
            {variant === "check" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500 mt-[1px]" strokeWidth={1.85} />
            ) : (
              <AlertTriangle
                className={cn("h-3.5 w-3.5 shrink-0 mt-[2px]", hasRisk ? "text-red-500" : "text-amber-500")}
                strokeWidth={1.85}
              />
            )}
            <span className="text-[12.5px] text-foreground/80 leading-snug">
              {cleanText}
              {hasRisk && (
                <span className="ml-1.5 inline-flex items-center rounded-full bg-red-50 border border-red-200/60 px-1.5 py-0.5 text-[9.5px] font-semibold text-red-600">
                  Engineering risk
                </span>
              )}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function KPIsRenderer({ content }: { content: string }) {
  const lines = content.split("\n").filter(Boolean)
  return (
    <ul className="space-y-3">
      {lines.map((line, i) => {
        const cleaned = line.replace(/^-\s/, "")
        const parts = cleaned.split(" — ")
        const label = parts[0]
        const sub = parts.slice(1).join(" — ")
        return (
          <li key={i} className="flex items-start gap-2.5">
            <BarChart2 className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-[2px]" strokeWidth={1.85} />
            <div>
              <p className="text-[12.5px] font-semibold text-foreground leading-none mb-0.5">{label}</p>
              {sub && <p className="text-[11.5px] text-muted-foreground leading-snug">{sub}</p>}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function PriorityRenderer({ content }: { content: string }) {
  const data: Record<string, string> = {}
  content.split("\n").filter(Boolean).forEach((line) => {
    const idx = line.indexOf(": ")
    if (idx > -1) data[line.slice(0, idx).trim()] = line.slice(idx + 2).trim()
  })

  const level = data["Priority"] || "High"
  const impact = data["Impact"] || "High"
  const effort = data["Effort"] || "Low"
  const recommendation = data["Recommendation"] || ""

  const levelStyle =
    level === "High"
      ? { dot: "bg-red-500", bg: "bg-red-50", text: "text-red-600", border: "border-red-200/70" }
      : level === "Medium"
      ? { dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200/70" }
      : { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200/70" }

  const impactDot = impact === "High" ? "bg-emerald-400" : impact === "Medium" ? "bg-amber-400" : "bg-red-400"
  const effortDot = effort === "Low" ? "bg-emerald-400" : effort === "Medium" ? "bg-amber-400" : "bg-red-400"

  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-2">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold", levelStyle.bg, levelStyle.text, levelStyle.border)}>
          <span className={cn("h-2 w-2 rounded-full shrink-0", levelStyle.dot)} />
          {level} Priority
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-[9px] bg-muted/40 border border-border/60 px-3 py-2.5">
          <p className="text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground/55 mb-1.5">Impact</p>
          <div className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full shrink-0", impactDot)} />
            <span className="text-[13px] font-semibold text-foreground">{impact}</span>
          </div>
        </div>
        <div className="rounded-[9px] bg-muted/40 border border-border/60 px-3 py-2.5">
          <p className="text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground/55 mb-1.5">Effort</p>
          <div className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full shrink-0", effortDot)} />
            <span className="text-[13px] font-semibold text-foreground">{effort}</span>
          </div>
        </div>
      </div>
      {recommendation && (
        <div className="rounded-[9px] bg-primary/[0.05] border border-primary/[0.12] px-3.5 py-3">
          <p className="text-[9.5px] font-semibold uppercase tracking-wider text-primary/55 mb-1.5">Recommendation</p>
          <p className="text-[12.5px] text-foreground/80 leading-snug">{recommendation}</p>
        </div>
      )}
    </div>
  )
}

function ReleaseNotesRenderer({ content }: { content: string }) {
  const lines = content.split("\n")
  return (
    <div>
      {lines.map((line, i) => {
        if (line.startsWith("# ")) return null
        if (line.startsWith("## ")) {
          return (
            <p key={i} className="text-[12px] font-semibold text-foreground mt-3 mb-1 first:mt-0">
              {line.slice(3)}
            </p>
          )
        }
        if (line.startsWith("- ")) {
          return (
            <div key={i} className="flex items-start gap-2 mb-1">
              <span className="mt-[6px] h-1 w-1 rounded-full bg-muted-foreground/40 shrink-0" />
              <span className="text-[12px] text-foreground/75 leading-snug">{line.slice(2)}</span>
            </div>
          )
        }
        if (!line.trim()) return <div key={i} className="h-0.5" />
        return <p key={i} className="text-[12.5px] text-foreground/80 leading-snug mb-2">{line}</p>
      })}
    </div>
  )
}

function SectionedRenderer({ content, type }: { content: string; type: "meeting-summary" | "prioritization" }) {
  const meetingColors: Record<string, string> = {
    DECISIONS: "text-emerald-700 bg-emerald-50",
    "OPEN QUESTIONS": "text-amber-700 bg-amber-50",
    "ACTION ITEMS": "text-blue-700 bg-blue-50",
  }
  const prioritizationColors: Record<string, string> = {
    "QUICK WINS": "text-emerald-700 bg-emerald-50",
    STRATEGIC: "text-blue-700 bg-blue-50",
    "FILL-INS": "text-amber-700 bg-amber-50",
    DEPRIORITIZE: "text-red-700 bg-red-50",
  }
  const sectionColors = type === "meeting-summary" ? meetingColors : prioritizationColors

  // Parse into meta block + sections
  type Section = { title: string; items: string[] }
  const meta: { key: string; value: string }[] = []
  const sections: Section[] = []
  let currentSection: Section | null = null
  let inMeta = true

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim()
    if (!line) {
      if (inMeta) inMeta = false
      continue
    }
    const isHeader =
      !line.startsWith("-") &&
      line === line.toUpperCase() &&
      /[A-Z]/.test(line) &&
      !line.includes(": ")

    if (isHeader) {
      if (currentSection) sections.push(currentSection)
      currentSection = { title: line, items: [] }
      inMeta = false
    } else if (line.startsWith("- ") && currentSection) {
      currentSection.items.push(line.slice(2))
    } else if (inMeta && line.includes(": ")) {
      const idx = line.indexOf(": ")
      meta.push({ key: line.slice(0, idx), value: line.slice(idx + 2) })
    }
  }
  if (currentSection) sections.push(currentSection)

  return (
    <div className="space-y-3">
      {meta.length > 0 && (
        <div className="rounded-[8px] bg-muted/40 border border-border/50 px-3 py-2.5 space-y-1">
          {meta.map((m, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[10.5px] font-semibold text-muted-foreground/55 w-20 shrink-0">{m.key}</span>
              <span className="text-[11.5px] text-foreground/80 leading-snug">{m.value}</span>
            </div>
          ))}
        </div>
      )}
      {sections.map((section, si) => {
        const colorClass = sectionColors[section.title] || "text-foreground/70 bg-muted/40"
        return (
          <div key={si}>
            <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold mb-2", colorClass)}>
              {section.title}
            </span>
            <ul className="space-y-1.5">
              {section.items.map((item, ii) => (
                <li key={ii} className="flex items-start gap-2">
                  <span className="mt-[6px] h-1 w-1 rounded-full bg-muted-foreground/40 shrink-0" />
                  <span className="text-[12px] text-foreground/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

function renderArtifactContent(artifact: ArtifactItem): React.ReactNode {
  const { type, textContent } = artifact
  if (type === "user-story") return <UserStoryRenderer content={textContent} />
  if (type === "acceptance-criteria") return <ChecklistRenderer content={textContent} variant="check" />
  if (type === "edge-cases") return <ChecklistRenderer content={textContent} variant="warning" />
  if (type === "kpis") return <KPIsRenderer content={textContent} />
  if (type === "priority") return <PriorityRenderer content={textContent} />
  if (type === "release-notes") return <ReleaseNotesRenderer content={textContent} />
  if (type === "meeting-summary" || type === "prioritization") {
    return <SectionedRenderer content={textContent} type={type} />
  }
  return <p className="text-[12.5px] text-foreground/80 leading-snug">{textContent}</p>
}

// ─── Artifact Card ────────────────────────────────────────────────────────────

interface ArtifactCardProps {
  artifact: ArtifactItem
  index: number
  isHighlighted: boolean
  onUpdate: (newContent: string) => void
  showToast: (message: string) => void
  cardRef: (el: HTMLDivElement | null) => void
}

function ArtifactCard({ artifact, index, isHighlighted, onUpdate, showToast, cardRef }: ArtifactCardProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(artifact.textContent)

  const config = artifactConfig[artifact.type]
  const Icon = config.icon
  const s = statusStyles[artifact.status]

  // Sync edit content when artifact updates externally (e.g., parent save)
  useEffect(() => {
    if (!isEditing) setEditContent(artifact.textContent)
  }, [artifact.textContent, isEditing])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(artifact.textContent)
    } catch {
      // fallback: do nothing — clipboard may not be available in all contexts
    }
    setCopied(true)
    showToast("Copied to clipboard.")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    setSaved(true)
    showToast("Artifact saved.")
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExport = () => {
    const content = `# ${config.title}\n\n${artifact.textContent}`
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${config.title.toLowerCase().replace(/\s+/g, "-")}.md`
    link.click()
    URL.revokeObjectURL(url)
    showToast("Artifact exported.")
  }

  const handleSaveEdit = () => {
    onUpdate(editContent)
    setIsEditing(false)
    showToast("Changes saved.")
  }

  const handleCancelEdit = () => {
    setEditContent(artifact.textContent)
    setIsEditing(false)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.32, ease: "easeOut" as const }}
      className={cn(
        "group rounded-[12px] border border-l-[3px] bg-card overflow-hidden",
        "shadow-[0_1px_4px_oklch(0_0_0/0.05)]",
        "hover:shadow-[0_5px_18px_oklch(0_0_0/0.09)]",
        "transition-all duration-300",
        config.accentClass,
        isHighlighted
          ? "border-primary/40 ring-2 ring-primary/20 shadow-[0_0_0_3px_oklch(0.52_0.22_280/0.12)]"
          : "border-border"
      )}
    >
      {/* ── Card header ── */}
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
        <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px]", config.iconBg)}>
          <Icon className={cn("h-[14px] w-[14px]", config.iconColor)} strokeWidth={1.85} />
        </div>
        <h3 className="flex-1 text-[13px] font-semibold text-foreground leading-none">{config.title}</h3>

        <button className="flex items-center gap-1 rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground transition-all duration-150">
          <History className="h-2.5 w-2.5" />
          {artifact.version}
        </button>

        <button className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Metadata row ── */}
      <div className="flex items-center gap-2 px-4 pb-3">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium", s.bg, s.text, s.border)}>
          <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", s.dot)} />
          {artifact.status}
        </span>
        <span className="text-[10.5px] text-muted-foreground/40">·</span>
        <span className="text-[10.5px] text-muted-foreground/65">{artifact.author}</span>
        <span className="text-[10.5px] text-muted-foreground/40">·</span>
        <span className="text-[10.5px] text-muted-foreground/55">{artifact.timestamp}</span>
      </div>

      <div className="mx-4 border-t border-border/50" />

      {/* ── Content ── */}
      <div className="px-4 py-4">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="space-y-2.5"
            >
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={6}
                className="w-full resize-none rounded-[8px] border border-border bg-muted/30 px-3 py-2.5 text-[12.5px] text-foreground leading-relaxed outline-none focus:border-primary/40 focus:bg-background transition-all duration-150 scrollbar-thin"
              />
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1.5 rounded-[7px] bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-150"
                >
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                  Save changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1.5 rounded-[7px] bg-muted/50 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
                >
                  <X className="h-3 w-3" />
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              {renderArtifactContent(artifact)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isEditing && <div className="mx-4 border-t border-border/50" />}

      {/* ── Footer actions — hidden while editing ── */}
      {!isEditing && <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[11px] font-medium transition-all duration-150",
              copied
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {copied ? <Check className="h-3 w-3" strokeWidth={2.5} /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            onClick={() => setIsEditing((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[11px] font-medium transition-colors duration-150",
              isEditing
                ? "bg-primary/10 text-primary"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[11px] font-medium bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
          >
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>

        <button
          onClick={handleSave}
          className={cn(
            "flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[11px] font-medium transition-all duration-150",
            saved
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-muted-foreground hover:text-primary hover:bg-accent"
          )}
        >
          <Save className="h-3 w-3" />
          {saved ? "Saved!" : "Save"}
        </button>
      </div>}
    </motion.div>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

interface ArtifactsPanelProps {
  artifacts: ArtifactItem[]
  highlightedArtifactId: string | null
  showToast: (message: string) => void
  onArtifactUpdate: (artifactId: string, newContent: string) => void
}

export function ArtifactsPanel({ artifacts, highlightedArtifactId, showToast, onArtifactUpdate }: ArtifactsPanelProps) {
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Scroll to highlighted artifact
  useEffect(() => {
    if (!highlightedArtifactId) return
    const el = cardRefs.current.get(highlightedArtifactId)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [highlightedArtifactId])

  const handleExportAll = () => {
    const content = artifacts
      .map((a) => `# ${artifactConfig[a.type].title}\n\n${a.textContent}`)
      .join("\n\n---\n\n")
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "artifacts.md"
    link.click()
    URL.revokeObjectURL(url)
    showToast("All artifacts exported.")
  }

  return (
    <aside className="w-[372px] shrink-0 border-l border-border flex flex-col overflow-hidden">
      {/* Panel header */}
      <div className="shrink-0 flex items-center justify-between border-b border-border px-5 py-[18px] bg-[oklch(0.985_0.004_265)]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[14px] font-semibold text-foreground">Generated Artifacts</h2>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
            {artifacts.length}
          </span>
        </div>
        <button
          onClick={handleExportAll}
          className="flex items-center gap-1.5 rounded-[8px] border border-border bg-card px-2.5 py-1.5 text-[11.5px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-sm transition-all duration-150 shadow-[0_1px_3px_oklch(0_0_0/0.05)]"
        >
          <ArrowDownToLine className="h-3 w-3" />
          Export all
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-[oklch(0.975_0.003_265)] p-4 space-y-3">
        {artifacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <FileText className="h-5 w-5 text-muted-foreground/50" />
            </div>
            <p className="text-[13px] font-medium text-muted-foreground mb-1">No artifacts yet</p>
            <p className="text-[12px] text-muted-foreground/60">Start a conversation to generate artifacts.</p>
          </div>
        ) : (
          artifacts.map((artifact, i) => (
            <ArtifactCard
              key={artifact.id}
              artifact={artifact}
              index={i}
              isHighlighted={highlightedArtifactId === artifact.id}
              onUpdate={(newContent) => onArtifactUpdate(artifact.id, newContent)}
              showToast={showToast}
              cardRef={(el) => {
                if (el) cardRefs.current.set(artifact.id, el)
                else cardRefs.current.delete(artifact.id)
              }}
            />
          ))
        )}
      </div>
    </aside>
  )
}
