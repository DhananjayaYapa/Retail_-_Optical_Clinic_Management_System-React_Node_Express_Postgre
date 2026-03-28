import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './redux/store'
import { authActions } from './redux/actions'
import AppRoutes from './routes/index'

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const { token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(authActions.validateSession())
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <AppRoutes />
}

export default App
