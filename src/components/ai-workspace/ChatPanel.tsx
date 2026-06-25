"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import {
  Send,
  Paperclip,
  Sparkles,
  Check,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BarChart2,
  ListOrdered,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ConversationData } from "./types"

// ─── Quick Action Cards ───────────────────────────────────────────────────────

const quickActions = [
  { icon: BookOpen,      label: "User Story",           desc: "Role-based narratives",   color: "text-violet-500",  bg: "bg-violet-50",  activeBg: "bg-violet-100",  activeBorder: "border-violet-300"  },
  { icon: CheckCircle2,  label: "Acceptance Criteria",  desc: "Define done clearly",     color: "text-blue-500",    bg: "bg-blue-50",    activeBg: "bg-blue-100",    activeBorder: "border-blue-300"    },
  { icon: AlertTriangle, label: "Edge Cases",            desc: "Catch failure paths",     color: "text-amber-500",   bg: "bg-amber-50",   activeBg: "bg-amber-100",   activeBorder: "border-amber-300"   },
  { icon: FileText,      label: "Release Notes",         desc: "Ship-ready changelogs",   color: "text-slate-500",   bg: "bg-slate-50",   activeBg: "bg-slate-100",   activeBorder: "border-slate-300"   },
  { icon: BarChart2,     label: "KPIs",                  desc: "Track what matters",      color: "text-emerald-500", bg: "bg-emerald-50", activeBg: "bg-emerald-100", activeBorder: "border-emerald-300" },
  { icon: ListOrdered,   label: "Prioritization",        desc: "Rank by impact",          color: "text-orange-500",  bg: "bg-orange-50",  activeBg: "bg-orange-100",  activeBorder: "border-orange-300"  },
  { icon: MessageSquare, label: "Meeting Summary",       desc: "Key decisions, fast",     color: "text-rose-500",    bg: "bg-rose-50",    activeBg: "bg-rose-100",    activeBorder: "border-rose-300"    },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FormattedText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i, arr) => {
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <span key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <span key={j} className="font-semibold text-foreground">
                  {part}
                </span>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
            {i < arr.length - 1 && <br />}
          </span>
        )
      })}
    </>
  )
}

function InlineStory({ story }: { story: { as: string; want: string; so: string } }) {
  return (
    <div className="mt-3 rounded-[10px] border border-violet-200/80 bg-violet-50/60 px-4 py-3.5">
      <p className="text-[13px] leading-[1.7] text-foreground/85">
        <span className="text-muted-foreground">As </span>
        <span className="font-semibold text-foreground">{story.as},</span>
        <br />
        <span className="text-muted-foreground">I want to </span>
        <span className="font-semibold text-foreground">{story.want}</span>
        <br />
        <span className="text-muted-foreground">so that </span>
        <span className="font-semibold text-foreground">{story.so}</span>
      </p>
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ChatPanelProps {
  conversation: ConversationData
  activeQuickAction: string | null
  onQuickAction: (action: string) => void
  showToast: (message: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatPanel({ conversation, activeQuickAction, onQuickAction }: ChatPanelProps) {
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom instantly on conversation switch
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" })
  }, [conversation.id])

  // Scroll smoothly when new messages are appended
  useEffect(() => {
    if (conversation.messages.length === 0) return
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 80)
    return () => clearTimeout(timer)
  }, [conversation.messages.length])

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 128) + "px"
  }

  const quickActionLabels = quickActions.map((a) => a.label)

  return (
    <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
      {/* ── Header ── */}
      <div className="shrink-0 border-b border-border px-8 py-5 bg-background">
        <div className="flex items-center gap-2.5 mb-0.5">
          <h1 className="text-[16px] font-semibold tracking-tight text-foreground leading-none">
            AI Workspace
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        </div>
        <p className="text-[13px] text-muted-foreground">
          {conversation.title}
        </p>
      </div>

      {/* ── Quick Action Cards ── */}
      <div className="shrink-0 border-b border-border bg-[oklch(0.99_0.002_265)]">
        <div className="flex items-stretch gap-2 overflow-x-auto scrollbar-none px-8 py-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            const isActive = activeQuickAction === action.label
            return (
              <motion.button
                key={action.label}
                onClick={() => onQuickAction(action.label)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.12 }}
                className={cn(
                  "group shrink-0 flex items-center gap-2.5 rounded-[10px] border px-3 py-2.5 text-left transition-all duration-150 min-w-[148px]",
                  isActive
                    ? cn("shadow-sm", action.activeBorder, "bg-card")
                    : "border-border bg-card hover:border-primary/25 hover:bg-accent/50 hover:shadow-sm"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] transition-colors duration-150",
                    isActive ? action.activeBg : action.bg,
                    !isActive && "group-hover:" + action.activeBg.replace("bg-", "bg-")
                  )}
                >
                  <Icon
                    className={cn("h-[14px] w-[14px] transition-colors duration-150", action.color)}
                    strokeWidth={1.8}
                  />
                </div>
                <div className="min-w-0">
                  <p className={cn(
                    "text-[11.5px] font-semibold leading-none mb-0.5 truncate transition-colors duration-150",
                    isActive ? "text-foreground" : "text-foreground"
                  )}>
                    {action.label}
                  </p>
                  <p className="text-[10.5px] text-muted-foreground leading-none truncate">
                    {action.desc}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {conversation.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mb-2 text-[17px] font-semibold text-foreground">Welcome to ProductPilot AI</h2>
            <p className="max-w-[380px] text-[13.5px] text-muted-foreground leading-relaxed">
              Describe a feature, paste meeting notes, or choose one of the quick actions above to begin.
            </p>
          </div>
        ) : (
        <div className="mx-auto max-w-[700px] px-8 py-8 space-y-8">
          {conversation.messages.map((msg, i) =>
            msg.role === "user" ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.2), duration: 0.28, ease: "easeOut" }}
                className="flex justify-end"
              >
                <div className="max-w-[70%]">
                  <div className="rounded-[14px] rounded-br-[4px] bg-primary/[0.07] border border-primary/[0.1] px-4 py-3">
                    <p className="text-[13.5px] text-foreground leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </p>
                  </div>
                  <p className="mt-1.5 text-right text-[10.5px] text-muted-foreground/40">
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.2), duration: 0.28, ease: "easeOut" }}
                className="flex items-start gap-3"
              >
                <div className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-sm mt-0.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[10.5px] font-semibold text-muted-foreground/50 uppercase tracking-wider mb-1.5">
                    Pilot
                  </p>

                  <div className="rounded-[14px] rounded-tl-[4px] border border-border bg-card shadow-[0_1px_4px_oklch(0_0_0/0.05)] px-4 py-4">
                    <p className="text-[13.5px] text-foreground/80 leading-[1.65]">
                      <FormattedText text={msg.content} />
                    </p>

                    {"story" in msg && msg.story && <InlineStory story={msg.story} />}

                    {"followUp" in msg && msg.followUp && (
                      <p className="mt-3.5 text-[13.5px] text-foreground/80 leading-[1.65]">
                        <FormattedText text={msg.followUp} />
                      </p>
                    )}

                    {"chips" in msg && msg.chips && msg.chips.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap gap-2">
                        {msg.chips.map((chip) => (
                          <button
                            key={chip}
                            onClick={() => {
                              if (quickActionLabels.includes(chip)) onQuickAction(chip)
                            }}
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-all duration-150",
                              chip.includes("→") || chip === "Generate everything"
                                ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                                : "border-border bg-background text-foreground hover:border-primary/35 hover:text-primary hover:bg-accent"
                            )}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}

                    {"followUpChips" in msg && msg.followUpChips && msg.followUpChips.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap gap-2">
                        {msg.followUpChips.map((chip) => (
                          <button
                            key={chip}
                            onClick={() => {
                              if (quickActionLabels.includes(chip)) onQuickAction(chip)
                            }}
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-all duration-150",
                              chip.includes("→") || chip === "Generate everything"
                                ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                                : "border-border bg-background text-foreground hover:border-primary/35 hover:text-primary hover:bg-accent"
                            )}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}

                    {"checklist" in msg && msg.checklist && (
                      <ul className="mt-3.5 space-y-2.5">
                        {msg.checklist.map((item, j) => (
                          <motion.li
                            key={j}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + j * 0.07, duration: 0.24, ease: "easeOut" }}
                            className="flex items-start gap-2.5"
                          >
                            <span className="mt-[2px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
                              <Check className="h-2.5 w-2.5 text-emerald-600" strokeWidth={2.5} />
                            </span>
                            <span className="text-[12.5px] text-foreground/80 leading-snug">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <p className="mt-1.5 text-[10.5px] text-muted-foreground/40 pl-0.5">
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            )
          )}
          <div ref={bottomRef} />
        </div>
        )}
      </div>

      {/* ── Input area ── */}
      <div className="shrink-0 border-t border-border bg-background px-8 py-4">
        <div className="mx-auto max-w-[700px]">
          <div className="flex items-center gap-3 rounded-[14px] border border-border bg-card shadow-[0_2px_10px_oklch(0_0_0/0.06)] px-4 py-3 focus-within:border-primary/30 focus-within:shadow-[0_2px_14px_oklch(0.52_0.22_280/0.09)] transition-all duration-200">
            <button className="shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-150">
              <Paperclip className="h-4 w-4" strokeWidth={1.7} />
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              placeholder="Describe a feature, paste meeting notes, or ask a question..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-[13.5px] text-foreground placeholder:text-muted-foreground/55 outline-none leading-relaxed max-h-32 scrollbar-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) e.preventDefault()
              }}
            />
            <motion.button
              disabled={!input.trim()}
              whileHover={input.trim() ? { scale: 1.05 } : {}}
              whileTap={input.trim() ? { scale: 0.95 } : {}}
              className={cn(
                "shrink-0 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150",
                input.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Send className="h-3.5 w-3.5" strokeWidth={2} />
            </motion.button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground/40">
            Pilot may make mistakes. Always review artifacts before sharing with stakeholders.
          </p>
        </div>
      </div>
    </div>
  )
}
