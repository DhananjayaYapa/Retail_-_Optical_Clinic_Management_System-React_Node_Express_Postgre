/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Base interface for form field with validation
 */
export interface FormFieldDto<T = string> {
  value: T
  validator: string
  isRequired: boolean
  error: string | null
  disable: boolean
}

/**
 * Validates controlled form data following the Athena pattern
 * @param data Form data with fields containing value, validator, isRequired, error, disable
 * @returns [validatedData, isValid] tuple
 */
export const validateControlledFormData = async (
  data: { [key: string]: any }
): Promise<[any, boolean]> => {
  let isValid = true
  let validatedData = data

  return new Promise((resolve) => {
    for (const [field, fieldData] of Object.entries(data)) {
      // Skip if no validator defined
      if (!fieldData || typeof fieldData !== 'object' || !('validator' in fieldData)) {
        continue
      }

      // Text validation
      if (fieldData.validator === 'text') {
        let error: string | null = null
        if (fieldData.isRequired && !fieldData.value?.toString().trim()) {
          error = 'This field is required.'
          isValid = false
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...fieldData,
            error,
          },
        }
      }

      // Number validation
      if (fieldData.validator === 'number') {
        let error: string | null = null
        const value = fieldData.value

        if (fieldData.isRequired && (value === null || value === undefined || value === '')) {
          error = 'This field is required.'
          isValid = false
        } else if (value !== null && value !== undefined && value !== '') {
          const numValue = Number(value)
          if (isNaN(numValue)) {
            error = 'Value must be a number.'
            isValid = false
          }
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...fieldData,
            error,
          },
        }
      }

      // Amount validation (positive number)
      if (fieldData.validator === 'amount') {
        let error: string | null = null
        const value = fieldData.value

        if (fieldData.isRequired && (value === null || value === undefined || value === '')) {
          error = 'Amount is required.'
          isValid = false
        } else if (value !== null && value !== undefined && value !== '') {
          const numValue = Number(value)
          if (isNaN(numValue)) {
            error = 'Amount must be a number.'
            isValid = false
          } else if (numValue <= 0) {
            error = 'Amount must be greater than 0.'
            isValid = false
          }
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...fieldData,
            error,
          },
        }
      }

      // Select validation
      if (fieldData.validator === 'select') {
        let error: string | null = null
        if (fieldData.isRequired && !fieldData.value) {
          error = 'Please select an option.'
          isValid = false
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...fieldData,
            error,
          },
        }
      }

      // Date validation
      if (fieldData.validator === 'date') {
        let error: string | null = null
        if (fieldData.isRequired && !fieldData.value) {
          error = 'Date is required.'
          isValid = false
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...fieldData,
            error,
          },
        }
      }

      // Email validation
      if (fieldData.validator === 'email') {
        let error: string | null = null
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

        if (fieldData.isRequired && !fieldData.value?.toString().trim()) {
          error = 'Email is required.'
          isValid = false
        } else if (fieldData.value && !emailRegex.test(fieldData.value)) {
          error = 'Invalid email address.'
          isValid = false
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...fieldData,
            error,
          },
        }
      }

      // Password validation
      if (fieldData.validator === 'password') {
        let error: string | null = null
        const value = fieldData.value?.toString() || ''

        if (fieldData.isRequired && !value.trim()) {
          error = 'Password is required.'
          isValid = false
        } else if (value && value.length < 6) {
          error = 'Password must be at least 6 characters.'
          isValid = false
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...fieldData,
            error,
          },
        }
      }

      // Confirm Password validation
      if (fieldData.validator === 'confirmPassword') {
        let error: string | null = null
        const value = fieldData.value?.toString() || ''
        const newPasswordValue = data['newPassword']?.value?.toString() || ''

        if (fieldData.isRequired && !value.trim()) {
          error = 'Please confirm your password.'
          isValid = false
        } else if (value !== newPasswordValue) {
          error = 'Passwords do not match.'
          isValid = false
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...fieldData,
            error,
          },
        }
      }
    }

    resolve([validatedData, isValid])
  })
}

/**
 * Clears error for a specific field (called on focus)
 */
export const clearFieldError = <T extends { [key: string]: any }>(
  formData: T,
  property: string
): T => {
  if (!formData[property]) return formData

  return {
    ...formData,
    [property]: {
      ...formData[property],
      error: null,
    },
  }
}

/**
 * Updates a form field value
 */
export const updateFieldValue = <T extends { [key: string]: any }>(
  formData: T,
  property: string,
  value: any
): T => {
  if (!formData[property]) return formData

  return {
    ...formData,
    [property]: {
      ...formData[property],
      value,
    },
  }
}

/**
 * Resets form data to initial state
 */
export const resetFormData = <T>(initialState: T): T => {
  return { ...initialState }
}
