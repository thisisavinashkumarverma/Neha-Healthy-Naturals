import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  clearAuthSession,
  defaultUser,
  loadAuthSession,
  loginUser,
  persistAuthSession,
  signupUser,
} from '../services/authservieces'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const storedSession = loadAuthSession()
  const [currentUser, setCurrentUser] = useState(storedSession?.currentUser ?? defaultUser)
  const [isAuthenticated, setIsAuthenticated] = useState(storedSession?.isAuthenticated ?? false)

  const login = (credentials) => {
    const nextUser = loginUser(credentials)
    setCurrentUser(nextUser)
    setIsAuthenticated(true)
    return nextUser
  }

  const signup = (payload) => {
    const nextUser = signupUser(payload)
    setCurrentUser(nextUser)
    setIsAuthenticated(true)
    return nextUser
  }

  const logout = () => {
    setCurrentUser(defaultUser)
    setIsAuthenticated(false)
    clearAuthSession()
  }

  useEffect(() => {
    if (!isAuthenticated) return

    persistAuthSession({
      currentUser,
      isAuthenticated,
    })
  }, [currentUser, isAuthenticated])

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated,
      login,
      signup,
      logout,
    }),
    [currentUser, isAuthenticated],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth }
