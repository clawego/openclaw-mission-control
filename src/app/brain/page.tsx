"use client";

import { useState } from "react";
import {
  Brain,
  Database,
  FolderOpen,
  Search,
  FileText,
  Clock,
} from "lucide-react";
import StatCard from "@/components/StatCard";

interface MemoryEntry {
  id: string;
  category: string;
  content: string;
  timestamp: string;
  source: string;
}

const mockMemories: MemoryEntry[] = [
  { id: "1", category: "core", content: "Owner prefers Gemini Pro for critical data tasks (Zero-Hallucination policy)", timestamp: "2h ago", source: "main.sqlite" },
  { id: "2", category: "system", content: "QMD memory index at ~/.openclaw/agents/main/qmd/ — uses XDG config/cache", timestamp: "4h ago", source: "config" },
  { id: "3", category: "preference", content: "Vixi is the orchestrator/CEO — must delegate labor to subagents", timestamp: "1d ago", source: "SYSTEM_LEARNINGS.md" },
  { id: "4", category: "fact", content: "6 active agents: main, monitor, local-scout, product-scout, ops-engineer, analytics-insights", timestamp: "2d ago", source: "openclaw.json" },
  { id: "5", category: "context", content: "Memory compaction at 80K tokens with 30K reserve floor — memoryFlush enabled", timestamp: "3d ago", source: "openclaw.json" },
  { id: "6", category: "preference", content: "Use MacPorts before Homebrew for package installation", timestamp: "5d ago", source: "MEMORY.md" },
];

const categoryColors: Record<string, string> = {
  core: "bg-brand-orange/20 text-brand-orange",
  system: "bg-brand-blue/20 text-brand-blue",
  preference: "bg-brand-green/20 text-brand-green",
  fact: "bg-brand-red/20 text-brand-red",
  context: "bg-surface-hover text-text-secondary",
};

type InputMode = "note" | "url" | "file";

const inputModeConfig: Record<InputMode, { label: string; placeholder: string; color: string }> = {
  note: { label: "Quick Note", placeholder: "Type a fact or note to remember...", color: "border-brand-green" },
  url: { label: "URL", placeholder: "Paste a URL to ingest...", color: "border-brand-blue" },
  file: { label: "File Upload", placeholder: "Drop a file here or click to browse", color: "border-brand-orange" },
};

export default function BrainPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("note");

  const filteredMemories = mockMemories.filter(
    (m) =>
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">🧠 Second Brain</h1>
        <p className="text-text-secondary text-sm mt-1">Your agent&apos;s knowledge base — stored facts and memory</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Stored Facts" value={mockMemories.length} icon={Brain} gradient="orange" delay={1} />
        <StatCard title="Categories" value={new Set(mockMemories.map((m) => m.category)).size} icon={FolderOpen} gradient="blue" delay={2} />
        <StatCard title="Memory Files" value="3 SQLite" icon={Database} gradient="green" delay={3} />
      </div>

      {/* Input Mode Tabs */}
      <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden animate-fade-in opacity-0 stagger-3" style={{ animationFillMode: "forwards" }}>
        <div className="flex border-b border-border-subtle">
          {(["note", "url", "file"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setInputMode(mode)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all cursor-pointer
                ${inputMode === mode
                  ? "text-text-primary bg-surface-hover border-b-2 " + inputModeConfig[mode].color
                  : "text-text-muted hover:text-text-secondary"
                }`}
            >
              {inputModeConfig[mode].label}
            </button>
          ))}
        </div>
        <div className="p-4">
          {inputMode === "file" ? (
            <div className="border-2 border-dashed border-border-default rounded-lg p-8 text-center hover:border-brand-orange transition-colors">
              <FileText size={32} className="text-text-disabled mx-auto mb-2" />
              <p className="text-text-muted text-sm">{inputModeConfig[inputMode].placeholder}</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={inputModeConfig[inputMode].placeholder}
                className="flex-1 bg-surface-hover text-text-primary text-sm px-4 py-2.5 rounded-lg border border-border-subtle focus:border-brand-orange focus:outline-none transition-colors placeholder:text-text-disabled"
              />
              <button className="px-5 py-2.5 rounded-lg bg-brand-orange hover:bg-brand-orange/90 text-white text-sm font-medium transition-colors cursor-pointer">
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search memories..."
          className="w-full bg-surface-card text-text-primary text-sm pl-10 pr-4 py-2.5 rounded-lg border border-border-subtle focus:border-brand-blue focus:outline-none transition-colors placeholder:text-text-disabled"
        />
      </div>

      {/* Memory Cards */}
      <div className="space-y-2">
        {filteredMemories.map((memory, i) => (
          <div
            key={memory.id}
            className="bg-surface-card rounded-xl border border-border-subtle p-4 hover:border-border-hover transition-all animate-fade-in opacity-0"
            style={{ animationDelay: `${i * 0.04}s`, animationFillMode: "forwards" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-text-secondary text-sm">{memory.content}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColors[memory.category] || categoryColors.context}`}>
                    {memory.category}
                  </span>
                  <span className="text-text-disabled text-[10px] font-mono">{memory.source}</span>
                </div>
              </div>
              <span className="text-text-muted text-[10px] whitespace-nowrap flex items-center gap-1">
                <Clock size={10} />
                {memory.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
