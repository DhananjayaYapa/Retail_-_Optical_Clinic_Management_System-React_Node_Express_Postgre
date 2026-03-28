import { API_ROUTES } from '../utilities/constants'
import { axiosPrivateInstance, axiosPublicInstance } from './index'

interface LoginRequest {
  email: string
  password: string
}

interface LoginApiResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: {
      id: number
      email: string
      role?: {
        name?: string
      }
    }
  }
}

export const authService = {
  async login(payload: LoginRequest) {
    const response = await axiosPublicInstance.post<LoginApiResponse>(API_ROUTES.LOGIN, payload)
    return response.data.data
  },
  async logout() {
    await axiosPrivateInstance.post(API_ROUTES.LOGOUT)
  },
  async getProfile() {
    const response = await axiosPrivateInstance.get(API_ROUTES.PROFILE)
    return response.data.data
  },
}
