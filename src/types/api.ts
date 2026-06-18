export interface ApiResponse<T = unknown> {
  data: T
  error: string | null
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  total: number
  page: number
  pageSize: number
}
