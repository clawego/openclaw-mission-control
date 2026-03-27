"use client";

import { useState } from "react";
import {
  ListTodo,
  Loader,
  CheckCircle2,
  Plus,
  GripVertical,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "done";
}

const priorityColors = {
  high: "bg-brand-red",
  medium: "bg-brand-orange",
  low: "bg-brand-blue",
};

const columnConfig = {
  todo: { label: "To Do", icon: ListTodo, color: "text-brand-blue" },
  in_progress: { label: "In Progress", icon: Loader, color: "text-brand-orange" },
  done: { label: "Complete", icon: CheckCircle2, color: "text-brand-green" },
};

const initialTasks: Task[] = [
  { id: "1", title: "Set up QMD semantic search integration", priority: "high", status: "todo" },
  { id: "2", title: "Configure Telegram notification pipeline", priority: "medium", status: "todo" },
  { id: "3", title: "Audit enabled vs disabled skills", priority: "low", status: "todo" },
  { id: "4", title: "Implement daily briefing cron job", priority: "high", status: "in_progress" },
  { id: "5", title: "Fix Discord guild message routing", priority: "medium", status: "in_progress" },
  { id: "6", title: "Set up agent heartbeat monitoring", priority: "high", status: "done" },
  { id: "7", title: "Configure BlueBubbles integration", priority: "medium", status: "done" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [view, setView] = useState<"your" | "agent">("your");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newTaskTitle, priority: "medium", status: "todo" },
    ]);
    setNewTaskTitle("");
  };

  const moveTask = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">✅ Tasks & Projects</h1>
          <p className="text-text-secondary text-sm mt-1">Kanban board for tracking work</p>
        </div>

        {/* Human / Agent toggle */}
        <div className="flex bg-surface-card rounded-lg border border-border-subtle p-1">
          <button
            onClick={() => setView("your")}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              view === "your"
                ? "bg-surface-elevated text-text-primary"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Your Tasks
          </button>
          <button
            onClick={() => setView("agent")}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              view === "agent"
                ? "bg-surface-elevated text-text-primary"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Agent Actions
          </button>
        </div>
      </div>

      {/* Add task input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task..."
          className="flex-1 bg-surface-card text-text-primary text-sm px-4 py-2.5 rounded-lg border border-border-subtle focus:border-brand-orange focus:outline-none transition-colors placeholder:text-text-disabled"
        />
        <button
          onClick={addTask}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-orange hover:bg-brand-orange/90 text-white text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(["todo", "in_progress", "done"] as const).map((status) => {
          const config = columnConfig[status];
          const Icon = config.icon;
          const columnTasks = tasks.filter((t) => t.status === status);

          return (
            <div key={status} className="animate-fade-in opacity-0" style={{ animationDelay: `${["todo", "in_progress", "done"].indexOf(status) * 0.08}s`, animationFillMode: "forwards" }}>
              <div className="flex items-center gap-2 mb-3">
                <Icon size={16} className={config.color} />
                <h2 className="text-text-primary font-semibold text-sm">{config.label}</h2>
                <span className="text-text-muted text-xs bg-surface-hover px-2 py-0.5 rounded-full ml-auto">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-2 min-h-[200px] bg-surface-card/30 rounded-xl border border-border-subtle p-3">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-surface-card rounded-lg border border-border-subtle p-3 hover:border-border-hover transition-all group"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical size={14} className="text-text-disabled mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
                          <p className={`text-sm ${task.status === "done" ? "text-text-muted line-through" : "text-text-primary"}`}>
                            {task.title}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {status !== "todo" && (
                            <button
                              onClick={() => moveTask(task.id, status === "done" ? "in_progress" : "todo")}
                              className="text-[10px] text-text-muted hover:text-text-secondary px-1.5 py-0.5 rounded bg-surface-hover hover:bg-surface-elevated transition-all cursor-pointer"
                            >
                              ← Back
                            </button>
                          )}
                          {status !== "done" && (
                            <button
                              onClick={() => moveTask(task.id, status === "todo" ? "in_progress" : "done")}
                              className="text-[10px] text-text-muted hover:text-text-secondary px-1.5 py-0.5 rounded bg-surface-hover hover:bg-surface-elevated transition-all cursor-pointer"
                            >
                              Forward →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {columnTasks.length === 0 && (
                  <p className="text-text-disabled text-xs text-center py-8">No tasks</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
