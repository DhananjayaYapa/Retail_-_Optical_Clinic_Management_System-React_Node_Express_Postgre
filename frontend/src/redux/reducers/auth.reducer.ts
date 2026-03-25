import { TOKEN_KEY, USER_KEY } from '../../utilities/constants'
import { AUTH_ACTIONS, type AuthUser } from '../actions/auth.actions'

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
}

const getUserFromStorage = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

const initialState: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem(TOKEN_KEY),
  isAuthenticated: Boolean(localStorage.getItem(TOKEN_KEY)),
}

interface Action {
  type: string
  payload?: unknown
}

const authReducer = (state: AuthState = initialState, action: Action): AuthState => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS: {
      const payload = action.payload as { token: string; user: AuthUser }
      localStorage.setItem(TOKEN_KEY, payload.token)
      localStorage.setItem(USER_KEY, JSON.stringify(payload.user))
      return {
        ...state,
        token: payload.token,
        user: payload.user,
        isAuthenticated: true,
      }
    }
    case AUTH_ACTIONS.SET_PROFILE: {
      const user = action.payload as AuthUser
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      return {
        ...state,
        user,
      }
    }
    case AUTH_ACTIONS.LOGOUT:
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      return {
        user: null,
        token: null,
        isAuthenticated: false,
      }
    default:
      return state
  }
}

export default authReducer
