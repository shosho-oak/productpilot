"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Sparkles,
  FolderKanban,
  ListTodo,
  Map,
  FileText,
  Users,
  Settings,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Workspace", href: "/ai-workspace", icon: Sparkles },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Backlog", href: "/backlog", icon: ListTodo },
  { label: "Roadmap", href: "/roadmap", icon: Map },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Team", href: "/team", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 h-screen w-[220px] shrink-0 flex flex-col border-r border-border bg-[oklch(0.985_0.004_265)] px-3 py-5 z-30">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-3 mb-8 group">
        <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-primary shadow-sm">
          <Zap className="h-3.5 w-3.5 text-primary-foreground fill-primary-foreground" />
        </div>
        <span className="text-[14px] font-semibold tracking-tight text-foreground">
          ProductPilot
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13px] font-medium transition-all duration-150",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-[10px] bg-accent"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                />
              )}
              <Icon
                className={cn(
                  "relative h-[15px] w-[15px] shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="relative">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom user hint */}
      <div className="mt-4 rounded-[10px] bg-accent/60 px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-foreground truncate">Shahad Qumosani</p>
            <p className="text-[11px] text-muted-foreground truncate">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
