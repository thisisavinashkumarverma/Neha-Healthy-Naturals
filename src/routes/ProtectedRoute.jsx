import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ redirectTo, children }) {
  const {isLoggedIn} = useAuth();
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
