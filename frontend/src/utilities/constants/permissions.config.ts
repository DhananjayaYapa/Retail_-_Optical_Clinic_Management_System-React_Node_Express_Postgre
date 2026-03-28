// ─── Role Constants ──────────────────────────────────────────────
export const ROLES = {
  ADMIN: 'ADMIN',
  CASHIER: 'CASHIER',
  OPTOMETRIST: 'OPTOMETRIST',
} as const

export type AppRole = (typeof ROLES)[keyof typeof ROLES]

// ─── Feature Keys ────────────────────────────────────────────────
// Granular feature keys that map 1:1 to backend authorize() checks.
// Naming convention: MODULE.ACTION (dot-separated, snake_case action)
export const FEATURES = {
  // Patient module
  PATIENT_CREATE: 'patient.create',
  PATIENT_UPDATE: 'patient.update',
  PATIENT_DELETE: 'patient.delete',
  PATIENT_RESTORE: 'patient.restore',
  PATIENT_VIEW: 'patient.view',

  // Branch module
  BRANCH_CREATE: 'branch.create',
  BRANCH_UPDATE: 'branch.update',
  BRANCH_DELETE: 'branch.delete',
  BRANCH_VIEW: 'branch.view',

  // Role module (admin settings)
  ROLE_CREATE: 'role.create',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
  ROLE_VIEW: 'role.view',

  // Navigation / sidebar
  NAV_DASHBOARD: 'nav.dashboard',
  NAV_PATIENTS: 'nav.patients',
  NAV_APPOINTMENTS: 'nav.appointments',
  NAV_EMR: 'nav.emr',
  NAV_BILLING: 'nav.billing',
  NAV_REPORTS: 'nav.reports',
  NAV_PROFILE: 'nav.profile',
} as const

export type FeatureKey = (typeof FEATURES)[keyof typeof FEATURES]

// ─── Permission Matrix ───────────────────────────────────────────
// Single source of truth: { featureKey → Set<role> }
// Must mirror backend authorize() middleware exactly.
const ALL_ROLES = new Set([ROLES.ADMIN, ROLES.CASHIER, ROLES.OPTOMETRIST])

const PERMISSION_MAP: Record<FeatureKey, ReadonlySet<AppRole>> = {
  // Patient
  [FEATURES.PATIENT_CREATE]: new Set([ROLES.ADMIN]),
  [FEATURES.PATIENT_UPDATE]: new Set([ROLES.ADMIN, ROLES.CASHIER, ROLES.OPTOMETRIST]),
  [FEATURES.PATIENT_DELETE]: new Set([ROLES.ADMIN]),
  [FEATURES.PATIENT_RESTORE]: new Set([ROLES.ADMIN, ROLES.CASHIER]),
  [FEATURES.PATIENT_VIEW]: ALL_ROLES,

  // Branch
  [FEATURES.BRANCH_CREATE]: new Set([ROLES.ADMIN]),
  [FEATURES.BRANCH_UPDATE]: new Set([ROLES.ADMIN, ROLES.CASHIER]),
  [FEATURES.BRANCH_DELETE]: new Set([ROLES.ADMIN]),
  [FEATURES.BRANCH_VIEW]: new Set([ROLES.ADMIN, ROLES.CASHIER]),

  // Role (admin settings)
  [FEATURES.ROLE_CREATE]: new Set([ROLES.ADMIN]),
  [FEATURES.ROLE_UPDATE]: new Set([ROLES.ADMIN]),
  [FEATURES.ROLE_DELETE]: new Set([ROLES.ADMIN]),
  [FEATURES.ROLE_VIEW]: new Set([ROLES.ADMIN]),

  // Navigation / sidebar
  [FEATURES.NAV_DASHBOARD]: ALL_ROLES,
  [FEATURES.NAV_PATIENTS]: ALL_ROLES,
  [FEATURES.NAV_APPOINTMENTS]: new Set([ROLES.ADMIN, ROLES.OPTOMETRIST]),
  [FEATURES.NAV_EMR]: new Set([ROLES.ADMIN, ROLES.OPTOMETRIST]),
  [FEATURES.NAV_BILLING]: new Set([ROLES.ADMIN, ROLES.CASHIER]),
  [FEATURES.NAV_REPORTS]: ALL_ROLES,
  [FEATURES.NAV_PROFILE]: ALL_ROLES,
}

// ─── Lookup ──────────────────────────────────────────────────────
export const hasPermission = (role: string | undefined, feature: FeatureKey): boolean => {
  if (!role) return false
  return PERMISSION_MAP[feature]?.has(role as AppRole) ?? false
}
