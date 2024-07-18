import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"

export default function ProtectedRoute() {
    const auth= useAuth()
    const token = localStorage.getItem('token')
    const isAuthenticated = auth.isAuthenticated || token;
  return isAuthenticated ? <Outlet/> : <Navigate to ="/login"/>
  
}
