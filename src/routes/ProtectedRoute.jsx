import { Navigate } from 'react-router-dom'

function ProtectedRoute({ allow, redirectTo, children }) {
  if (!allow) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}

export default ProtectedRoute
