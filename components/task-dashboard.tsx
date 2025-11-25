"use client"

import { useState, useEffect } from "react"
import { TaskList } from "./task-list"
import { TaskForm } from "./task-form"

export interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  createdAt: string
}

interface TaskDashboardProps {
  user: { email: string; name: string }
  onLogout: () => void
}

export function TaskDashboard({ user, onLogout }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "completed">("all")

  useEffect(() => {
    const storedTasks = localStorage.getItem("taskapp_tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("taskapp_tasks", JSON.stringify(tasks))
  }, [tasks])

  const handleCreateTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setTasks([newTask, ...tasks])
    setIsFormOpen(false)
  }

  const handleUpdateTask = (task: Omit<Task, "id" | "createdAt">) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === editingTask.id ? { ...t, ...task } : t)))
      setEditingTask(null)
      setIsFormOpen(false)
    }
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
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

        {/* Task List */}
        {filteredTasks.length === 0 ? (
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
                fontSize: "48px",
                marginBottom: "16px",
              }}
            >
              📋
            </div>
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
            <p
              style={{
                fontSize: "14px",
                color: "#757575",
                margin: 0,
              }}
            >
              {filter === "all" ? "Create your first task to get started" : `No ${filter.replace("-", " ")} tasks`}
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
