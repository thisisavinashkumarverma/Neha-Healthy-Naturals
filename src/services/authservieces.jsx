const AUTH_STORAGE_KEY = 'nhn-auth-session'

export const defaultUser = {
  name: 'Priya',
  email: 'priya@nhn.com',
  role: 'customer',
}

export const createCheckoutDraftForUser = (user = defaultUser) => ({
  customerName: user.name,
  customerEmail: user.email,
  address: '',
  phone: '',
  notes: '',
})

export const loadAuthSession = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return rawSession ? JSON.parse(rawSession) : null
  } catch {
    return null
  }
}

export const persistAuthSession = (session) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export const clearAuthSession = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

const createResolvedUser = ({ name, email, role = 'customer' }) => {
  const resolvedName = name?.trim() || (role === 'admin' ? 'Admin' : 'Customer')

  return {
    name: resolvedName,
    email: email?.trim() || `${resolvedName.toLowerCase()}@nhn.com`,
    role,
  }
}

export const loginUser = (credentials) => createResolvedUser(credentials)

export const signupUser = ({ name, email }) =>
  createResolvedUser({
    name,
    email,
    role: 'customer',
  })
