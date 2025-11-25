"use client"

import { useState, useEffect } from "react"
import { AuthScreen } from "@/components/auth-screen"
import { TaskDashboard } from "@/components/task-dashboard"

export default function Home() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("taskapp_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (email: string, password: string, name?: string) => {
    const userData = { email, name: name || email.split("@")[0] }
    localStorage.setItem("taskapp_user", JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem("taskapp_user")
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
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    )
  }

  return user ? <TaskDashboard user={user} onLogout={handleLogout} /> : <AuthScreen onLogin={handleLogin} />
}
