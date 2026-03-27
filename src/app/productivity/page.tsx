"use client";

import { useState } from "react";
import {
  Calendar,
  Flame,
  TrendingUp,
  Target,
  Plus,
  Trash2,
  StickyNote,
} from "lucide-react";
import StatCard from "@/components/StatCard";

// Motivational messages by progress bucket
const motivationalMessages = [
  "Every expert was once a beginner. You've started — that's what matters.",
  "Small steps compound. Keep showing up.",
  "You're building momentum. Don't stop now.",
  "Consistency beats intensity. You're proving it.",
  "Halfway there. The hardest part is behind you.",
  "Your future self will thank you for today.",
  "Discipline is just choosing between what you want NOW and what you want MOST.",
  "You're in the top percentile of people who actually do the work.",
  "The finish line is in sight. Sprint.",
  "Almost there. One more push.",
];

export default function ProductivityPage() {
  const [currentDay] = useState(23);
  const currentPhase = currentDay <= 30 ? "Foundation" : currentDay <= 60 ? "Growth" : "Scale";
  const streak = 7;
  const progressPercent = Math.round((currentDay / 90) * 100);
  const messageIndex = Math.min(Math.floor(progressPercent / 10), 9);

  // Habit tracker — 90-day grid
  const [completedDays, setCompletedDays] = useState<Set<number>>(
    new Set([1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23])
  );

  // Todos
  const [todos, setTodos] = useState([
    { id: "1", text: "Review agent memory performance", done: false },
    { id: "2", text: "Set up content sync cron job", done: true },
    { id: "3", text: "Configure Discord webhook alerts", done: false },
  ]);
  const [newTodo, setNewTodo] = useState("");

  // Notes
  const [notes, setNotes] = useState("## Ideas\n- Explore semantic search for memory\n- Add cost tracking per agent\n- Build Telegram notification pipeline");

  const toggleDay = (day: number) => {
    setCompletedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos((prev) => [...prev, { id: Date.now().toString(), text: newTodo, done: false }]);
    setNewTodo("");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">⚡ Productivity</h1>
        <p className="text-text-secondary text-sm mt-1">Your personal productivity layer</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Days Completed" value={completedDays.size} icon={Calendar} gradient="orange" delay={1} />
        <StatCard title="Current Streak" value={`${streak} days`} icon={Flame} gradient="red" delay={2} />
        <StatCard title="Current Phase" value={currentPhase} icon={TrendingUp} gradient="blue" delay={3} />
        <StatCard title="Progress" value={`${progressPercent}%`} icon={Target} gradient="green" delay={4} />
      </div>

      {/* Motivational Message */}
      <div className="bg-surface-card rounded-xl border border-border-subtle p-5 animate-fade-in opacity-0 stagger-3" style={{ animationFillMode: "forwards" }}>
        <p className="text-text-secondary text-sm italic text-center">
          &ldquo;{motivationalMessages[messageIndex]}&rdquo;
        </p>
      </div>

      {/* 90 Day Habit Tracker */}
      <div className="bg-surface-card rounded-xl border border-border-subtle p-5 animate-fade-in opacity-0 stagger-4" style={{ animationFillMode: "forwards" }}>
        <h2 className="text-text-primary font-semibold text-sm mb-4">90-Day Habit Tracker</h2>

        {/* Phase labels */}
        <div className="grid grid-cols-3 gap-4 mb-3">
          {["Foundation (1–30)", "Growth (31–60)", "Scale (61–90)"].map((phase) => (
            <span key={phase} className="text-text-muted text-[10px] text-center uppercase tracking-wider">
              {phase}
            </span>
          ))}
        </div>

        {/* 30×3 grid */}
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((col) => (
            <div key={col} className="grid grid-cols-10 gap-1">
              {Array.from({ length: 30 }, (_, i) => {
                const day = col * 30 + i + 1;
                const isCompleted = completedDays.has(day);
                const isToday = day === currentDay;
                const isFuture = day > currentDay;

                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`w-full aspect-square rounded-sm text-[8px] font-medium transition-all duration-100 cursor-pointer
                      ${isCompleted ? "bg-brand-green text-white" : ""}
                      ${isToday && !isCompleted ? "bg-brand-blue text-white ring-1 ring-brand-blue" : ""}
                      ${isFuture ? "bg-surface-hover text-text-disabled" : ""}
                      ${!isCompleted && !isToday && !isFuture ? "bg-surface-hover text-text-muted hover:bg-surface-elevated" : ""}
                    `}
                    title={`Day ${day}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Todos */}
        <div className="bg-surface-card rounded-xl border border-border-subtle p-5 animate-fade-in opacity-0" style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}>
          <h2 className="text-text-primary font-semibold text-sm mb-4 flex items-center gap-2">
            <Target size={16} className="text-brand-orange" />
            Quick Todos
          </h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add a task..."
              className="flex-1 bg-surface-hover text-text-primary text-sm px-3 py-2 rounded-lg border border-border-subtle focus:border-brand-orange focus:outline-none transition-colors placeholder:text-text-disabled"
            />
            <button
              onClick={addTodo}
              className="p-2 rounded-lg bg-brand-orange hover:bg-brand-orange/90 text-white transition-colors cursor-pointer"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-1.5">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-surface-hover transition-colors group">
                <button
                  onClick={() =>
                    setTodos((prev) =>
                      prev.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t))
                    )
                  }
                  className={`w-4 h-4 rounded border-2 transition-all duration-150 cursor-pointer flex-shrink-0
                    ${todo.done ? "bg-brand-green border-brand-green" : "border-text-muted hover:border-brand-green"}`}
                />
                <span className={`flex-1 text-sm ${todo.done ? "text-text-muted line-through" : "text-text-secondary"}`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => setTodos((prev) => prev.filter((t) => t.id !== todo.id))}
                  className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-brand-red transition-all cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-surface-card rounded-xl border border-border-subtle p-5 animate-fade-in opacity-0" style={{ animationDelay: "0.30s", animationFillMode: "forwards" }}>
          <h2 className="text-text-primary font-semibold text-sm mb-4 flex items-center gap-2">
            <StickyNote size={16} className="text-brand-blue" />
            Notes
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-[280px] bg-surface-hover text-text-secondary text-sm px-4 py-3 rounded-lg border border-border-subtle focus:border-brand-blue focus:outline-none transition-colors resize-none font-mono leading-relaxed placeholder:text-text-disabled"
            placeholder="Write your notes here..."
          />
        </div>
      </div>
    </div>
  );
}
