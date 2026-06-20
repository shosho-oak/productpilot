"use client"

import { ConversationSidebar } from "@/components/ai-workspace/ConversationSidebar"
import { ChatPanel } from "@/components/ai-workspace/ChatPanel"
import { ArtifactsPanel } from "@/components/ai-workspace/ArtifactsPanel"

export default function AiWorkspacePage() {
  // Escape the dashboard main's px-8 py-8 padding so the three-panel layout
  // fills the full available area below the top bar (h-14 = 56px).
  return (
    <div className="-mx-8 -my-8 h-[calc(100vh-3.5rem)] flex overflow-hidden bg-background">
      <ConversationSidebar />
      <ChatPanel />
      <ArtifactsPanel />
    </div>
  )
}
