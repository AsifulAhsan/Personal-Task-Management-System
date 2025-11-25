"use client"

import type { Task } from "./task-dashboard"

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#FF5252"
      case "medium":
        return "#FFB300"
      case "low":
        return "#4CAF50"
      default:
        return "#757575"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "in-progress":
        return "In Progress"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            background: "#FFFFFF",
            border: "2px solid #E0E0E0",
            padding: "24px",
            transition: "all 0.2s",
            opacity: task.status === "completed" ? 0.7 : 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#000000",
                    margin: 0,
                    textDecoration: task.status === "completed" ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </h3>
                <span
                  style={{
                    padding: "4px 10px",
                    background: getPriorityColor(task.priority),
                    color: "#FFFFFF",
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {task.priority}
                </span>
              </div>

              {task.description && (
                <p
                  style={{
                    fontSize: "14px",
                    color: "#757575",
                    margin: "0 0 12px 0",
                    lineHeight: "1.6",
                  }}
                >
                  {task.description}
                </p>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#FFB300",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {getStatusLabel(task.status)}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#BDBDBD",
                  }}
                >
                  {new Date(task.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => onEdit(task)}
                style={{
                  padding: "8px 16px",
                  background: "#FFFFFF",
                  border: "2px solid #E0E0E0",
                  color: "#000000",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#FFB300"
                  e.currentTarget.style.color = "#FFB300"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E0E0E0"
                  e.currentTarget.style.color = "#000000"
                }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this task?")) {
                    onDelete(task.id)
                  }
                }}
                style={{
                  padding: "8px 16px",
                  background: "#FFFFFF",
                  border: "2px solid #E0E0E0",
                  color: "#000000",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#FF5252"
                  e.currentTarget.style.color = "#FF5252"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E0E0E0"
                  e.currentTarget.style.color = "#000000"
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
