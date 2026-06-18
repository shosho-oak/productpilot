export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  createdAt: Date
}

export type UserRole = "owner" | "admin" | "member" | "viewer"
