// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // ✅ Check for the correct token key
  const isAuthenticated = !!localStorage.getItem("adminToken")

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
