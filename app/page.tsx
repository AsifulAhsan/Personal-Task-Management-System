"use client"

import { useState, useEffect } from "react"
import { AuthScreen } from "@/components/auth-screen"
import { TaskDashboard } from "@/components/task-dashboard"
import { loginUser, registerUser } from "@/lib/api"

export default function Home() {
  const [user, setUser] = useState<{ email: string; name: string; token: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("taskapp_token")
    const storedUser = localStorage.getItem("taskapp_user")

    if (token && storedUser) {
      try {
        setUser({ ...JSON.parse(storedUser), token })
      } catch (error) {
        console.error("Failed to parse user data:", error)
        localStorage.removeItem("taskapp_token")
        localStorage.removeItem("taskapp_user")
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogin = async (email: string, password: string, name?: string) => {
    try {
      setError("")
      
      // Determine if this is login or register
      const data = name 
        ? await registerUser(email, password, name)
        : await loginUser(email, password)

      // Store token and user data
      localStorage.setItem("taskapp_token", data.token)
      localStorage.setItem("taskapp_user", JSON.stringify(data.user))

      setUser({ ...data.user, token: data.token })
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("taskapp_token")
    localStorage.removeItem("taskapp_user")
    // Remove old localStorage tasks if any
    localStorage.removeItem("taskapp_tasks")
    setUser(null)
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#FAFAFA",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #FFB300",
            borderTop: "3px solid transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    )
  }

  return user ? (
    <TaskDashboard user={user} onLogout={handleLogout} />
  ) : (
    <AuthScreen onLogin={handleLogin} />
  )
}