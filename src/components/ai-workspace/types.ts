export type ArtifactStatus = "Ready" | "Draft" | "In Review"

export type ArtifactType =
  | "user-story"
  | "acceptance-criteria"
  | "edge-cases"
  | "kpis"
  | "priority"
  | "release-notes"
  | "meeting-summary"
  | "prioritization"

export interface ArtifactItem {
  id: string
  type: ArtifactType
  status: ArtifactStatus
  author: string
  timestamp: string
  version: string
  textContent: string
}

export type UserMessage = {
  role: "user"
  content: string
  time: string
}

export type AiMessage = {
  role: "ai"
  content: string
  time: string
  chips?: string[]
  checklist?: string[]
  story?: { as: string; want: string; so: string }
  followUp?: string
  followUpChips?: string[]
}

export type Message = UserMessage | AiMessage

export interface ConversationData {
  id: string
  title: string
  time: string
  pinned?: boolean
  messages: Message[]
  artifacts: ArtifactItem[]
}
