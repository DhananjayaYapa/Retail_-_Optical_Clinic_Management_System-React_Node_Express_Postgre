// Generic API Response
export interface ApiResponseDto<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: string
  warning?: {
    message: string
    budgetAmount?: number
    totalSpent?: number
    percentageUsed?: number
    categoryName?: string
  } | null
}

// Pagination
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Action State for Redux reducers
export interface ActionState {
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  message: string
}

export const initialActionState: ActionState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
}
