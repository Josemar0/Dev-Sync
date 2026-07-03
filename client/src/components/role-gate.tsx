import { type ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth, type UserRole } from "@/lib/auth-context"

interface RoleGateProps {
  allowedRoles: UserRole[]
  children: ReactNode
}

export function RoleGate({ allowedRoles, children }: RoleGateProps) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) return <>{children}</>
  if (allowedRoles.includes(user.role)) return <>{children}</>

  if (user.role === "instructor") {
    return <Navigate to="/dashboard/instructor/classes" replace />
  }
  if (user.role === "student") {
    return <Navigate to="/dashboard/student/classes" replace />
  }
  return <Navigate to="/profile" replace />
}

