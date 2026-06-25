"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check } from "lucide-react"

interface ToastProps {
  message: string | null
}

export function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.96 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-[10px] bg-foreground px-4 py-2.5 shadow-[0_4px_20px_oklch(0_0_0/0.22)]"
        >
          <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} />
          <span className="text-[13px] font-medium text-background">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
