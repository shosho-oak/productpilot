"use client"

import { Bell, Search } from "lucide-react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/90 backdrop-blur-sm px-8">
      {/* Search */}
      <div className="flex items-center gap-2 w-[280px] rounded-[10px] bg-muted/60 border border-border px-3 py-2 text-[13px] text-muted-foreground cursor-text hover:border-primary/40 hover:bg-muted transition-all duration-150">
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="flex-1">Search anything...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded bg-background border border-border px-1.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="relative flex h-8 w-8 items-center justify-center rounded-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
        </motion.button>

        {/* Divider */}
        <div className="h-5 w-px bg-border" />

        {/* Avatar */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <Avatar className="h-7 w-7 ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-150">
            <AvatarImage src="" alt="Shahad Qumosani" />
            <AvatarFallback className="bg-gradient-to-br from-violet-400 to-purple-600 text-white text-[11px] font-semibold">
              SQ
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-[13px] font-medium text-foreground leading-none">Shahad Qumosani</p>
          </div>
        </div>
      </div>
    </header>
  )
}
