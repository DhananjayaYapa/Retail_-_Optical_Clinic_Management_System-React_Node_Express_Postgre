import { authService } from '../../services'
import type { AppDispatch } from '../store'

export const AUTH_ACTIONS = {
  LOGIN_REQUEST: 'AUTH_LOGIN_REQUEST',
  LOGIN_SUCCESS: 'AUTH_LOGIN_SUCCESS',
  LOGIN_ERROR: 'AUTH_LOGIN_ERROR',
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
  loginRequest: () => ({
    type: AUTH_ACTIONS.LOGIN_REQUEST,
  }),
  loginSuccess: (payload: { token: string; user: AuthUser }) => ({
    type: AUTH_ACTIONS.LOGIN_SUCCESS,
    payload,
  }),
  loginError: (payload: string) => ({
    type: AUTH_ACTIONS.LOGIN_ERROR,
    payload,
  }),
  logout: () => ({
    type: AUTH_ACTIONS.LOGOUT,
  }),
  setProfile: (payload: AuthUser) => ({
    type: AUTH_ACTIONS.SET_PROFILE,
    payload,
  }),
  login: (payload: { email: string; password: string }) => {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(authActions.loginRequest())
        const data = await authService.login(payload)

        dispatch(
          authActions.loginSuccess({
            token: data.token,
            user: {
              userId: String(data.user.id),
              email: data.user.email,
              name: data.user.email,
              role: data.user.role?.name,
            },
          })
        )

        return { success: true as const }
      } catch (error) {
        const message =
          (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
          'Login failed'
        dispatch(authActions.loginError(message))
        return { success: false as const, message }
      }
    }
  },
}
