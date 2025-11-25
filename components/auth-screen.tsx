"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"

interface AuthScreenProps {
  onLogin: (email: string, password: string, name?: string) => void
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "signup">("login")

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAFAFA",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          width: "100%",
          maxWidth: "420px",
          border: "1px solid #E0E0E0",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#FFB300",
            padding: "32px 32px 28px",
            borderBottom: "2px solid #FFA000",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#000000",
              margin: "0 0 8px 0",
              letterSpacing: "-0.5px",
            }}
          >
            Task Manager
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#000000",
              margin: 0,
              opacity: 0.8,
            }}
          >
            Organize your work efficiently
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", borderBottom: "1px solid #E0E0E0" }}>
          <button
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              padding: "16px",
              background: mode === "login" ? "#FFFFFF" : "#F5F5F5",
              border: "none",
              borderBottom: mode === "login" ? "3px solid #FFB300" : "3px solid transparent",
              fontSize: "14px",
              fontWeight: mode === "login" ? "600" : "500",
              color: mode === "login" ? "#000000" : "#757575",
              cursor: "pointer",
              transition: "all 0.2s",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            style={{
              flex: 1,
              padding: "16px",
              background: mode === "signup" ? "#FFFFFF" : "#F5F5F5",
              border: "none",
              borderBottom: mode === "signup" ? "3px solid #FFB300" : "3px solid transparent",
              fontSize: "14px",
              fontWeight: mode === "signup" ? "600" : "500",
              color: mode === "signup" ? "#000000" : "#757575",
              cursor: "pointer",
              transition: "all 0.2s",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form Content */}
        <div style={{ padding: "32px" }}>
          {mode === "login" ? <LoginForm onLogin={onLogin} /> : <SignupForm onSignup={onLogin} />}
        </div>
      </div>
    </div>
  )
}
