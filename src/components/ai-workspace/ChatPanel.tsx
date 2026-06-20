"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Send, Paperclip, Sparkles, Check } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Quick Actions ────────────────────────────────────────────────────────────

const quickActions = [
  "Generate User Story",
  "Acceptance Criteria",
  "Edge Cases",
  "Release Notes",
  "KPIs",
  "Prioritization",
  "Meeting Summary",
]

// ─── Conversation data ────────────────────────────────────────────────────────

type Message =
  | { role: "user"; content: string; time: string }
  | {
      role: "ai"
      content: string
      time: string
      chips?: string[]
      checklist?: string[]
    }

const messages: Message[] = [
  {
    role: "user",
    content: "Users want to export dashboard data to CSV.",
    time: "10:32 AM",
  },
  {
    role: "ai",
    content:
      "I've analyzed this request. Here's what I understand:\n\n**Core need:** Give users the ability to download their current dashboard data as a CSV file for offline analysis, reporting, or sharing with stakeholders.\n\n**Likely persona:** Marketing managers, analysts, and ops leads who rely on spreadsheets.\n\nWhat would you like me to generate?",
    chips: ["User Story", "Acceptance Criteria", "Edge Cases", "KPIs", "Generate All →"],
    time: "10:32 AM",
  },
  {
    role: "user",
    content: "Generate all of them",
    time: "10:33 AM",
  },
  {
    role: "ai",
    content:
      "Done. I've generated **5 artifacts** for the Export CSV feature. Review and edit them in the Artifacts panel →",
    checklist: [
      "User Story — written for a marketing manager persona",
      "Acceptance Criteria — 3 clear, testable requirements",
      "Edge Cases — 3 failure scenarios to handle",
      "KPIs — 3 metrics to track adoption and success",
      "Priority Score — High impact, Low effort",
    ],
    time: "10:33 AM",
  },
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

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatPanel() {
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" })
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize
    const el = e.target
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 128) + "px"
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
      {/* ── Header ── */}
      <div className="shrink-0 border-b border-border px-8 py-5 bg-background">
        <h1 className="text-[16px] font-semibold tracking-tight text-foreground leading-none mb-1">
          AI Workspace
        </h1>
        <p className="text-[13px] text-muted-foreground">
          Transform ideas into product artifacts.
        </p>
      </div>

      {/* ── Quick Actions ── */}
      <div className="shrink-0 border-b border-border bg-background">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none px-8 py-3">
          {quickActions.map((action) => (
            <button
              key={action}
              className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-[11.5px] font-medium text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-accent transition-all duration-150 whitespace-nowrap"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-[720px] px-8 py-8 space-y-6">
          {messages.map((msg, i) =>
            msg.role === "user" ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.28, ease: "easeOut" }}
                className="flex justify-end"
              >
                <div className="max-w-[72%]">
                  <div className="rounded-[14px] rounded-br-[4px] bg-primary/[0.07] border border-primary/12 px-4 py-3">
                    <p className="text-[13.5px] text-foreground leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                  <p className="mt-1 text-right text-[11px] text-muted-foreground/50">
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.28, ease: "easeOut" }}
                className="flex items-start gap-3"
              >
                {/* AI Avatar */}
                <div className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-sm mt-0.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="rounded-[14px] rounded-tl-[4px] border border-border bg-card shadow-[0_1px_4px_oklch(0_0_0/0.05)] px-4 py-3.5">
                    <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                      <FormattedText text={msg.content} />
                    </p>

                    {/* Suggested output chips */}
                    {msg.chips && (
                      <div className="mt-3.5 flex flex-wrap gap-2">
                        {msg.chips.map((chip) => (
                          <button
                            key={chip}
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-all duration-150",
                              chip.includes("→")
                                ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                                : "border-border bg-background text-foreground hover:border-primary/40 hover:text-primary hover:bg-accent"
                            )}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Completion checklist */}
                    {msg.checklist && (
                      <ul className="mt-3.5 space-y-2">
                        {msg.checklist.map((item, j) => (
                          <motion.li
                            key={j}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + j * 0.07, duration: 0.24, ease: "easeOut" }}
                            className="flex items-start gap-2.5"
                          >
                            <span className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
                              <Check className="h-2.5 w-2.5 text-emerald-600" strokeWidth={2.5} />
                            </span>
                            <span className="text-[12.5px] text-foreground/80 leading-snug">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground/50 pl-0.5">{msg.time}</p>
                </div>
              </motion.div>
            )
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input area ── */}
      <div className="shrink-0 border-t border-border bg-background px-8 py-4">
        <div className="mx-auto max-w-[720px]">
          <div className="flex items-end gap-3 rounded-[14px] border border-border bg-card shadow-[0_2px_10px_oklch(0_0_0/0.06)] px-4 py-3 focus-within:border-primary/30 focus-within:shadow-[0_2px_12px_oklch(0.52_0.22_280/0.08)] transition-all duration-200">
            <button className="shrink-0 mb-0.5 text-muted-foreground hover:text-foreground transition-colors duration-150">
              <Paperclip className="h-4 w-4" strokeWidth={1.7} />
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              placeholder="Describe a feature, paste meeting notes, or ask a question..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-[13.5px] text-foreground placeholder:text-muted-foreground/60 outline-none leading-relaxed max-h-32 scrollbar-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                }
              }}
            />
            <button
              disabled={!input.trim()}
              className={cn(
                "shrink-0 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150",
                input.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Send className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground/45">
            ProductPilot can make mistakes. Review generated artifacts before sharing.
          </p>
        </div>
      </div>
    </div>
  )
}
