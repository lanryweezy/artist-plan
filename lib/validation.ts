// Validation utilities inspired by Kreathief's Zod-based validation

interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validate(data: Record<string, any>, rules: Record<string, ValidationRule>): ValidationResult {
  const errors: string[] = []

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field]

    if (rule.required && (value === undefined || value === null || value === "")) {
      errors.push(`${field} is required`)
      continue
    }

    if (value !== undefined && value !== null && value !== "") {
      if (rule.minLength && String(value).length < rule.minLength) {
        errors.push(`${field} must be at least ${rule.minLength} characters`)
      }
      if (rule.maxLength && String(value).length > rule.maxLength) {
        errors.push(`${field} must be at most ${rule.maxLength} characters`)
      }
      if (rule.pattern && !rule.pattern.test(String(value))) {
        errors.push(`${field} format is invalid`)
      }
      if (rule.min !== undefined && Number(value) < rule.min) {
        errors.push(`${field} must be at least ${rule.min}`)
      }
      if (rule.max !== undefined && Number(value) > rule.max) {
        errors.push(`${field} must be at most ${rule.max}`)
      }
      if (rule.oneOf && !rule.oneOf.includes(String(value))) {
        errors.push(`${field} must be one of: ${rule.oneOf.join(", ")}`)
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  min?: number
  max?: number
  oneOf?: string[]
}

// Common validation schemas
export const schemas = {
  song: {
    title: { required: true, minLength: 1, maxLength: 200 },
    isrc: { pattern: /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/ },
    iswc: { pattern: /^T-\d{3}\.\d{3}\.\d{3}-\d$/ },
  },
  contact: {
    name: { required: true, minLength: 1, maxLength: 100 },
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { pattern: /^\+?[\d\s-]{7,15}$/ },
  },
  project: {
    title: { required: true, minLength: 1, maxLength: 200 },
  },
  finance: {
    description: { required: true, minLength: 1, maxLength: 200 },
    amount: { required: true, min: 0 },
  },
  split: {
    total: { min: 0, max: 100 },
  },
}

// ISRC validation
export function validateISRC(isrc: string): ValidationResult {
  const pattern = /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/
  if (!pattern.test(isrc)) {
    return { valid: false, errors: ["ISRC must be 12 characters: Country(2) + Registrant(3) + Year(2) + Designation(5)"] }
  }
  return { valid: true, errors: [] }
}

// ISWC validation
export function validateISWC(iswc: string): ValidationResult {
  const pattern = /^T-\d{3}\.\d{3}\.\d{3}-\d$/
  if (!pattern.test(iswc)) {
    return { valid: false, errors: ["ISWC must be in format T-XXX.XXX.XXX-X"] }
  }
  return { valid: true, errors: [] }
}

// Split validation
export function validateSplits(splits: number[]): ValidationResult {
  const total = splits.reduce((a, b) => a + b, 0)
  if (total !== 100) {
    return { valid: false, errors: [`Splits total ${total}% — must equal 100%`] }
  }
  return { valid: true, errors: [] }
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!pattern.test(email)) {
    return { valid: false, errors: ["Invalid email format"] }
  }
  return { valid: true, errors: [] }
}
