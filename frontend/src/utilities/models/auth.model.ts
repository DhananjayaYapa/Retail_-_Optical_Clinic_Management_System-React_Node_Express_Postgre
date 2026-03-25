import type { ActionState } from './core.model'

// User Model
export interface User {
  userId: string
  name: string
  email: string
}

// Login Request
export interface LoginRequestDto {
  email: string
  password: string
}

// Register Request
export interface RegisterRequestDto {
  name: string
  email: string
  password: string
}

// Login Response
export interface LoginResponseDto {
  token: string
  user: User
}

// Profile Update Request
export interface UpdateProfileRequestDto {
  name: string
  email: string
}

// Change Password Request
export interface ChangePasswordRequestDto {
  currentPassword: string
  newPassword: string
}

// Auth State for Redux
export interface AuthStateDto extends ActionState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

export const initialAuthState: AuthStateDto = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  isAuthenticated: false,
  user: null,
  token: null,
}

// ============================================
// CONTROLLED FORM DTOs (Athena Pattern)
// ============================================

// Profile Form DTO
export interface ProfileFormDto {
  name: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  email: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
}

// Password Form DTO
export interface PasswordFormDto {
  currentPassword: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  newPassword: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  confirmPassword: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
}

// Initial states for Profile forms
export const INITIAL_PROFILE_FORM_STATE = (name: string = '', email: string = ''): ProfileFormDto => ({
  name: {
    value: name,
    validator: 'text',
    isRequired: true,
    error: null,
    disable: false,
  },
  email: {
    value: email,
    validator: 'email',
    isRequired: true,
    error: null,
    disable: true,
  },
})

export const INITIAL_PASSWORD_FORM_STATE = (): PasswordFormDto => ({
  currentPassword: {
    value: '',
    validator: 'text',
    isRequired: true,
    error: null,
    disable: false,
  },
  newPassword: {
    value: '',
    validator: 'password',
    isRequired: true,
    error: null,
    disable: false,
  },
  confirmPassword: {
    value: '',
    validator: 'confirmPassword',
    isRequired: true,
    error: null,
    disable: false,
  },
})
