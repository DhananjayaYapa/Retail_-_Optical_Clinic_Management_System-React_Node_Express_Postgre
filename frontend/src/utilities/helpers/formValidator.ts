import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

/**
 * Validation rules for common fields
 */
export const validationRules = {
  required: (fieldName: string) => ({
    required: `${fieldName} is required`,
  }),

  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  },

  password: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters',
    },
  },

  name: {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters',
    },
    maxLength: {
      value: 100,
      message: 'Name must not exceed 100 characters',
    },
  },

  amount: {
    required: 'Amount is required',
    min: {
      value: 0.01,
      message: 'Amount must be greater than 0',
    },
  },

  title: {
    required: 'Title is required',
    minLength: {
      value: 2,
      message: 'Title must be at least 2 characters',
    },
    maxLength: {
      value: 200,
      message: 'Title must not exceed 200 characters',
    },
  },
}

/**
 * Validate form data and set errors
 */
export function validateFormData<T extends FieldValues>(
  data: T,
  setError: UseFormSetError<T>,
  validations: Partial<Record<keyof T, (value: unknown) => string | null>>
): boolean {
  let isValid = true

  for (const [field, validate] of Object.entries(validations)) {
    if (validate) {
      const error = validate(data[field as keyof T])
      if (error) {
        setError(field as Path<T>, { type: 'manual', message: error })
        isValid = false
      }
    }
  }

  return isValid
}

/**
 * Check if value is empty
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}
