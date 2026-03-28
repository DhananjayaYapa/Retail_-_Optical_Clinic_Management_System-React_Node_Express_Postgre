import axios from 'axios'
import { TOKEN_KEY, USER_KEY } from '../utilities/constants'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export const axiosPublicInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const axiosPrivateInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosPrivateInstance.interceptors.request.use((request) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token && request.headers) {
    request.headers.Authorization = `Bearer ${token}`
  }
  return request
})

axiosPrivateInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      window.location.replace('/login')
    }
    return Promise.reject(error)
  }
)

export * from './patient.service'
export * from './auth.service'
