"use client"

import { useState, useEffect } from "react"
import { TaskList } from "./task-list"
import { TaskForm } from "./task-form"
import { fetchTasks, createTask, updateTask, deleteTask } from "@/lib/api"

export interface Task {
  _id: string
  id: string  // Keep for compatibility with existing components
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  createdAt: string
}

interface TaskDashboardProps {
  user: { email: string; name: string; token: string }
  onLogout: () => void
}

export function TaskDashboard({ user, onLogout }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "completed">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Load tasks on mount
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      setError("")
      const fetchedTasks = await fetchTasks()
      
      // Map MongoDB _id to id for compatibility
      const mappedTasks = fetchedTasks.map((task: any) => ({
        ...task,
        id: task._id,
      }))
      
      setTasks(mappedTasks)
    } catch (err: any) {
      setError("Failed to load tasks")
      console.error("Load tasks error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async (task: Omit<Task, "id" | "createdAt" | "_id">) => {
    try {
      setError("")
      const newTask = await createTask(task)
      
      setTasks([{ ...newTask, id: newTask._id }, ...tasks])
      setIsFormOpen(false)
    } catch (err: any) {
      setError(err.message || "Failed to create task")
      console.error("Create task error:", err)
    }
  }

  const handleUpdateTask = async (task: Omit<Task, "id" | "createdAt" | "_id">) => {
    if (!editingTask) return

    try {
      setError("")
      const updatedTask = await updateTask(editingTask._id, task)
      
      setTasks(tasks.map((t) => 
        t._id === editingTask._id 
          ? { ...updatedTask, id: updatedTask._id } 
          : t
      ))
      
      setEditingTask(null)
      setIsFormOpen(false)
    } catch (err: any) {
      setError(err.message || "Failed to update task")
      console.error("Update task error:", err)
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      setError("")
      await deleteTask(id)
      setTasks(tasks.filter((t) => t._id !== id && t.id !== id))
    } catch (err: any) {
      setError(err.message || "Failed to delete task")
      console.error("Delete task error:", err)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const filteredTasks = filter === "all" ? tasks : tasks.filter((t) => t.status === filter)

  const statusCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>
      {/* Header */}
      <header
        style={{
          background: "#FFFFFF",
          borderBottom: "2px solid #E0E0E0",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#000000",
                margin: "0 0 4px 0",
                letterSpacing: "-0.5px",
              }}
            >
              Task Manager
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "#757575",
                margin: 0,
              }}
            >
              Welcome back, {user.name}
            </p>
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: "10px 20px",
              background: "#FFFFFF",
              border: "2px solid #E0E0E0",
              color: "#000000",
              fontSize: "13px",
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
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Error Message */}
        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              background: "#FFEBEE",
              border: "1px solid #FFCDD2",
              color: "#C62828",
              fontSize: "13px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              style={{
                background: "none",
                border: "none",
                color: "#C62828",
                fontSize: "18px",
                cursor: "pointer",
                padding: "0 8px",
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Stats Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {(["all", "pending", "in-progress", "completed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: "20px",
                background: filter === status ? "#FFB300" : "#FFFFFF",
                border: filter === status ? "2px solid #FFA000" : "2px solid #E0E0E0",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (filter !== status) {
                  e.currentTarget.style.borderColor = "#FFB300"
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== status) {
                  e.currentTarget.style.borderColor = "#E0E0E0"
                }
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: filter === status ? "#000000" : "#FFB300",
                  marginBottom: "4px",
                }}
              >
                {statusCounts[status]}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: filter === status ? "#000000" : "#757575",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {status === "all" ? "Total Tasks" : status.replace("-", " ")}
              </div>
            </button>
          ))}
        </div>

        {/* Action Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#000000",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {filter === "all" ? "All Tasks" : `${filter.replace("-", " ")} Tasks`}
          </h2>
          <button
            onClick={() => {
              setEditingTask(null)
              setIsFormOpen(true)
            }}
            style={{
              padding: "12px 24px",
              background: "#FFB300",
              border: "2px solid #FFA000",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FFA000"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#FFB300"
            }}
          >
            + New Task
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div
            style={{
              background: "#FFFFFF",
              border: "2px solid #E0E0E0",
              padding: "60px 20px",
              textAlign: "center",
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
                margin: "0 auto 16px",
              }}
            />
            <p style={{ fontSize: "14px", color: "#757575", margin: 0 }}>
              Loading tasks...
            </p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div
            style={{
              background: "#FFFFFF",
              border: "2px solid #E0E0E0",
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#000000",
                margin: "0 0 8px 0",
              }}
            >
              No tasks found
            </h3>
            <p style={{ fontSize: "14px", color: "#757575", margin: 0 }}>
              {filter === "all" 
                ? "Create your first task to get started" 
                : `No ${filter.replace("-", " ")} tasks`}
            </p>
          </div>
        ) : (
          <TaskList tasks={filteredTasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />
        )}
      </main>

      {/* Task Form Modal */}
      {isFormOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingTask(null)
            }}
          />
        </div>
      )}
    </div>
  )
}