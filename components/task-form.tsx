"use client";

import type React from "react";

import { useState } from "react";
import type { Task } from "./task-dashboard";

interface TaskFormProps {
  task: Task | null;
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void;
  onCancel: () => void;
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<"pending" | "in-progress" | "completed">(
    task?.status || "pending"
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    task?.priority || "medium"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ title, description, status, priority });
    }
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "2px solid orange",
        maxWidth: "600px",
        width: "100%",
        maxHeight: "90vh",
        overflow: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#FFB300",
          padding: "24px",
          borderBottom: "2px solid #FFA000",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#FFFFFF",
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {task ? "Edit Task" : "Create New Task"}
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "2px solid #E0E0E0",
                background: "#FFFFFF",
                fontSize: "14px",
                color: "#000000",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#FFB300")}
              onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
              placeholder="Enter task title"
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
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "2px solid #E0E0E0",
                background: "#FFFFFF",
                fontSize: "14px",
                color: "#000000",
                outline: "none",
                transition: "border-color 0.2s",
                resize: "vertical",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#FFB300")}
              onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
              placeholder="Add task details..."
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
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
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "2px solid #E0E0E0",
                  background: "#FFFFFF",
                  fontSize: "14px",
                  color: "#000000",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
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
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "2px solid #E0E0E0",
                  background: "#FFFFFF",
                  fontSize: "14px",
                  color: "#000000",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: "14px",
                background: "#FFFFFF",
                border: "2px solid #E0E0E0",
                color: "#000000",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#FF5252";
                e.currentTarget.style.color = "#FF5252";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E0E0E0";
                e.currentTarget.style.color = "#000000";
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "14px",
                background: "#FFB300",
                border: "2px solid #FFA000",
                color: "#000000",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FFA000";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#FFB300";
                e.currentTarget.style.color = "#000000";
              }}
            >
              {task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
