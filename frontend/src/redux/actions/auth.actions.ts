export const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'AUTH_LOGIN_SUCCESS',
  LOGOUT: 'AUTH_LOGOUT',
  SET_PROFILE: 'AUTH_SET_PROFILE',
} as const

export interface AuthUser {
  userId: string
  name?: string
  email: string
  role?: string
}

export const authActions = {
  loginSuccess: (payload: { token: string; user: AuthUser }) => ({
    type: AUTH_ACTIONS.LOGIN_SUCCESS,
    payload,
  }),
  logout: () => ({
    type: AUTH_ACTIONS.LOGOUT,
  }),
  setProfile: (payload: AuthUser) => ({
    type: AUTH_ACTIONS.SET_PROFILE,
    payload,
  }),
}
