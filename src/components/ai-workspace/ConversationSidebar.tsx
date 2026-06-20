"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Pin, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const pinned = [
  { id: "p1", title: "Generate User Stories" },
  { id: "p2", title: "Backlog Prioritization" },
]

const recent = [
  { id: "r1", title: "Export CSV feature", time: "2 hours ago" },
  { id: "r2", title: "Summarize meeting notes", time: "Yesterday" },
  { id: "r3", title: "Create acceptance criteria", time: "Yesterday" },
  { id: "r4", title: "Generate release notes", time: "3 days ago" },
  { id: "r5", title: "Prioritize Q3 backlog", time: "1 week ago" },
  { id: "r6", title: "Mobile onboarding flow", time: "1 week ago" },
  { id: "r7", title: "Analytics dashboard spec", time: "2 weeks ago" },
]

export function ConversationSidebar() {
  const [activeId, setActiveId] = useState("r1")
  const [query, setQuery] = useState("")

  const filtered = query
    ? recent.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
    : recent

  return (
    <aside className="w-[216px] shrink-0 border-r border-border flex flex-col bg-[oklch(0.985_0.004_265)]">
      {/* New conversation */}
      <div className="p-3 border-b border-border">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.96 }}
          className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-3 py-2 text-[12.5px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-150"
        >
          <Plus className="h-3.5 w-3.5" />
          New conversation
        </motion.button>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 rounded-[9px] bg-muted/60 border border-border px-2.5 py-1.5">
          <Search className="h-3 w-3 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground outline-none min-w-0"
          />
        </div>
      </div>

      {/* Pinned */}
      <div className="px-3 pb-2">
        <p className="px-1 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Pinned
        </p>
        <div className="flex flex-col gap-0.5">
          {pinned.map((conv) => {
            const isActive = activeId === conv.id
            return (
              <button
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-[8px] px-2.5 py-1.5 text-left transition-colors duration-150",
                  isActive
                    ? "bg-accent text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                )}
              >
                <Pin className="h-3 w-3 shrink-0 opacity-60" />
                <span className="text-[12px] font-medium truncate">{conv.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mx-3 border-t border-border mb-2" />

      {/* Recent */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-3">
        <p className="px-1 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Recent
        </p>
        <div className="flex flex-col gap-0.5">
          {filtered.map((conv) => {
            const isActive = activeId === conv.id
            return (
              <motion.button
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                whileHover={{ x: 1 }}
                transition={{ duration: 0.1 }}
                className={cn(
                  "group relative flex w-full items-start gap-2 rounded-[8px] px-2.5 py-2 text-left transition-colors duration-150",
                  isActive ? "bg-accent" : "hover:bg-muted/70"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="conv-active"
                    className="absolute inset-0 rounded-[8px] bg-accent"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.32 }}
                  />
                )}
                <MessageSquare
                  className={cn(
                    "relative h-3.5 w-3.5 shrink-0 mt-[1px]",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                  strokeWidth={1.7}
                />
                <div className="relative min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-[12px] font-medium leading-snug truncate",
                      isActive ? "text-primary" : "text-foreground"
                    )}
                  >
                    {conv.title}
                  </p>
                  <p className="text-[10.5px] text-muted-foreground/55 mt-0.5">{conv.time}</p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
