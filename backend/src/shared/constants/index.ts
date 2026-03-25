const toPositiveInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const AUTH_SECURITY = {
  MAX_FAILED_ATTEMPTS: toPositiveInt(process.env.AUTH_MAX_FAILED_ATTEMPTS, 5),
  ATTEMPT_WINDOW_MINUTES: toPositiveInt(process.env.AUTH_ATTEMPT_WINDOW_MINUTES, 15),
  LOCKOUT_MINUTES: toPositiveInt(process.env.AUTH_LOCKOUT_MINUTES, 15),
} as const;

export const JWT_DEFAULTS = {
  EXPIRES_IN: '7d',
} as const;

export const PATIENTS = {
  CODE_PREFIX: 'PAT',
} as const;
