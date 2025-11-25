"use client"

import type React from "react"
import { useState } from "react"

interface SignupFormProps {
  onSignup: (email: string, password: string, name: string) => Promise<void>
  isLoading?: boolean
}

export function SignupForm({ onSignup, isLoading }: SignupFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password && name) {
      await onSignup(email, password, name)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "600",
            color: "#000000",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "2px solid #E0E0E0",
            background: "#FFFFFF",
            fontSize: "14px",
            color: "#000000",
            outline: "none",
            transition: "border-color 0.2s",
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "text",
          }}
          onFocus={(e) => !isLoading && (e.target.style.borderColor = "#FFB300")}
          onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
          placeholder="John Doe"
        />
      </div>

      <div>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "600",
            color: "#000000",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "2px solid #E0E0E0",
            background: "#FFFFFF",
            fontSize: "14px",
            color: "#000000",
            outline: "none",
            transition: "border-color 0.2s",
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "text",
          }}
          onFocus={(e) => !isLoading && (e.target.style.borderColor = "#FFB300")}
          onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "600",
            color: "#000000",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "2px solid #E0E0E0",
            background: "#FFFFFF",
            fontSize: "14px",
            color: "#000000",
            outline: "none",
            transition: "border-color 0.2s",
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "text",
          }}
          onFocus={(e) => !isLoading && (e.target.style.borderColor = "#FFB300")}
          onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
          placeholder="Create a password (min 6 characters)"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "14px",
          background: isLoading ? "#FFD54F" : "#FFB300",
          border: "2px solid #FFA000",
          color: "#000000",
          fontSize: "14px",
          fontWeight: "700",
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "all 0.2s",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginTop: "8px",
          opacity: isLoading ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.background = "#FFA000"
            e.currentTarget.style.transform = "translateY(-1px)"
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.background = "#FFB300"
            e.currentTarget.style.transform = "translateY(0)"
          }
        }}
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  )
}