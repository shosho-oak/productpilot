"use client"

import { useCallback, useEffect, useState } from "react"
import { ConversationSidebar } from "@/components/ai-workspace/ConversationSidebar"
import { ChatPanel } from "@/components/ai-workspace/ChatPanel"
import { ArtifactsPanel } from "@/components/ai-workspace/ArtifactsPanel"
import { Toast } from "@/components/ai-workspace/Toast"
import { CONVERSATIONS, QUICK_ACTION_EXCHANGES } from "@/components/ai-workspace/mockData"
import type { ArtifactType, ConversationData, Message } from "@/components/ai-workspace/types"

const QUICK_ACTION_TYPE_MAP: Record<string, ArtifactType> = {
  "User Story":          "user-story",
  "Acceptance Criteria": "acceptance-criteria",
  "Edge Cases":          "edge-cases",
  "Release Notes":       "release-notes",
  "KPIs":                "kpis",
  "Prioritization":      "prioritization",
  "Meeting Summary":     "meeting-summary",
}

export default function AiWorkspacePage() {
  const [conversations, setConversations] = useState<ConversationData[]>(CONVERSATIONS)
  const [activeConvId, setActiveConvId] = useState("c1")
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [highlightedArtifactId, setHighlightedArtifactId] = useState<string | null>(null)
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null)
  const [triggeredActions, setTriggeredActions] = useState<Set<string>>(new Set())

  const activeConv = conversations.find((c) => c.id === activeConvId)!

  useEffect(() => {
    setActiveQuickAction(null)
    setHighlightedArtifactId(null)
  }, [activeConvId])

  useEffect(() => {
    if (!highlightedArtifactId) return
    const timer = setTimeout(() => setHighlightedArtifactId(null), 3000)
    return () => clearTimeout(timer)
  }, [highlightedArtifactId])

  useEffect(() => {
    if (!toastMsg) return
    const timer = setTimeout(() => setToastMsg(null), 2500)
    return () => clearTimeout(timer)
  }, [toastMsg])

  const showToast = useCallback((message: string) => {
    setToastMsg(null)
    requestAnimationFrame(() => setToastMsg(message))
  }, [])

  const handleConversationSelect = useCallback((id: string) => {
    setActiveConvId(id)
  }, [])

  const handleNewConversation = useCallback(() => {
    const id = `new-${Date.now()}`
    setConversations((prev) => [
      ...prev,
      { id, title: "New conversation", time: "Just now", messages: [], artifacts: [] },
    ])
    setActiveConvId(id)
  }, [])

  const handleQuickAction = useCallback(
    (actionLabel: string) => {
      if (activeQuickAction === actionLabel) {
        setActiveQuickAction(null)
        setHighlightedArtifactId(null)
        return
      }

      setActiveQuickAction(actionLabel)

      const artifactType = QUICK_ACTION_TYPE_MAP[actionLabel]
      const conv = conversations.find((c) => c.id === activeConvId)!
      const artifact = conv?.artifacts.find((a) => a.type === artifactType)
      if (artifact) {
        setHighlightedArtifactId(artifact.id)
      }

      const key = `${activeConvId}|${actionLabel}`
      if (!triggeredActions.has(key)) {
        setTriggeredActions((prev) => new Set(prev).add(key))
        const exchange = QUICK_ACTION_EXCHANGES[actionLabel]
        if (exchange) {
          const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          const newMessages: Message[] = [
            { role: "user", content: exchange.user, time: now },
            { role: "ai", content: exchange.ai, time: now },
          ]
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConvId ? { ...c, messages: [...c.messages, ...newMessages] } : c
            )
          )
        }
      }
    },
    [activeConvId, activeQuickAction, conversations, triggeredActions]
  )

  const handleArtifactUpdate = useCallback(
    (artifactId: string, newContent: string) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConvId
            ? {
                ...conv,
                artifacts: conv.artifacts.map((a) =>
                  a.id === artifactId ? { ...a, textContent: newContent } : a
                ),
              }
            : conv
        )
      )
    },
    [activeConvId]
  )

  return (
    <div className="-mx-8 -my-8 h-[calc(100vh-3.5rem)] flex overflow-hidden bg-background">
      <ConversationSidebar
        conversations={conversations}
        activeConvId={activeConvId}
        onSelect={handleConversationSelect}
        onNewConversation={handleNewConversation}
      />
      <ChatPanel
        conversation={activeConv}
        activeQuickAction={activeQuickAction}
        onQuickAction={handleQuickAction}
        showToast={showToast}
      />
      <ArtifactsPanel
        artifacts={activeConv.artifacts}
        highlightedArtifactId={highlightedArtifactId}
        showToast={showToast}
        onArtifactUpdate={handleArtifactUpdate}
      />
      <Toast message={toastMsg} />
    </div>
  )
}
