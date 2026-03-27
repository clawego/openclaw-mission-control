"use client";

import { useState } from "react";
import { Save, Check, RotateCcw } from "lucide-react";

// Agent personality / system prompt
const defaultPersonality = `You are Vixi, the orchestrator and CEO of the OpenClaw agent system.

## Core Identity
- You are a highly capable AI assistant running on Google Gemini models
- You delegate low-level tasks to specialized subagents (monitor, local-scout, product-scout, ops-engineer, analytics-insights)
- You NEVER perform scraping, monitoring, or file-syncing directly

## Communication Style
- Professional yet approachable
- Concise and action-oriented
- Always cite sources for factual claims

## Key Protocols
- Zero-Hallucination Policy for market data and OSINT
- Context compression: Keep only last 3 steps, structured JSON state
- Graceful degradation when services are unavailable`;

// Config entries grouped by category
const configGroups = [
  {
    category: "Model",
    entries: [
      { key: "primary_model", value: "google/gemini-3-flash-preview", editable: true },
      { key: "fallback_model", value: "google/gemini-3-flash-preview", editable: true },
      { key: "context_1m", value: "true", editable: true },
    ],
  },
  {
    category: "Memory",
    entries: [
      { key: "backend", value: "qmd", editable: false },
      { key: "update_interval", value: "5m", editable: true },
      { key: "debounce_ms", value: "15000", editable: true },
    ],
  },
  {
    category: "Compaction",
    entries: [
      { key: "mode", value: "default", editable: true },
      { key: "reserve_tokens_floor", value: "30000", editable: true },
      { key: "soft_threshold_tokens", value: "80000", editable: true },
      { key: "memory_flush_enabled", value: "true", editable: true },
    ],
  },
  {
    category: "System",
    entries: [
      { key: "heartbeat_interval", value: "1h", editable: true },
      { key: "max_concurrent", value: "4", editable: true },
      { key: "subagent_max_concurrent", value: "8", editable: true },
      { key: "gateway_port", value: "18789", editable: false },
      { key: "gateway_mode", value: "local", editable: false },
    ],
  },
];

export default function SettingsPage() {
  const [personality, setPersonality] = useState(defaultPersonality);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [configValues, setConfigValues] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    configGroups.forEach((g) => g.entries.forEach((e) => (map[e.key] = e.value)));
    return map;
  });

  const handleSavePersonality = () => {
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">⚙️ Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Control panel for your agent&apos;s personality and configuration</p>
      </div>

      {/* Personality & Character */}
      <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden animate-fade-in opacity-0 stagger-1" style={{ animationFillMode: "forwards" }}>
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-text-primary font-semibold text-sm">Personality & Character</h2>
          <button
            onClick={handleSavePersonality}
            disabled={saveState === "saving"}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer
              ${saveState === "saved"
                ? "bg-brand-green/20 text-brand-green"
                : "bg-brand-orange hover:bg-brand-orange/90 text-white"
              }`}
          >
            {saveState === "saving" ? (
              <RotateCcw size={12} className="animate-spin" />
            ) : saveState === "saved" ? (
              <Check size={12} />
            ) : (
              <Save size={12} />
            )}
            {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved" : "Save"}
          </button>
        </div>
        <div className="p-5">
          <textarea
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className="w-full h-[320px] bg-surface-hover text-text-secondary text-sm px-4 py-3 rounded-lg border border-border-subtle focus:border-brand-orange focus:outline-none transition-colors resize-none font-mono leading-relaxed"
            placeholder="Enter the agent's system prompt..."
          />
        </div>
      </div>

      {/* Config Entries */}
      {configGroups.map((group, gi) => (
        <div
          key={group.category}
          className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden animate-fade-in opacity-0"
          style={{ animationDelay: `${(gi + 2) * 0.08}s`, animationFillMode: "forwards" }}
        >
          <div className="px-5 py-3 border-b border-border-subtle">
            <h2 className="text-text-primary font-semibold text-sm">{group.category}</h2>
          </div>
          <div className="divide-y divide-border-subtle">
            {group.entries.map((entry) => (
              <div
                key={entry.key}
                className="flex items-center justify-between px-5 py-3 hover:bg-surface-hover/30 transition-colors"
              >
                <span className="text-text-muted text-xs font-mono">{entry.key}</span>
                {entry.editable ? (
                  <input
                    type="text"
                    value={configValues[entry.key] || ""}
                    onChange={(e) =>
                      setConfigValues((prev) => ({ ...prev, [entry.key]: e.target.value }))
                    }
                    className="bg-surface-hover text-text-primary text-xs px-3 py-1.5 rounded-md border border-border-subtle focus:border-brand-orange focus:outline-none transition-colors font-mono text-right w-48"
                  />
                ) : (
                  <span className="text-text-secondary text-xs font-mono bg-surface-hover px-3 py-1.5 rounded-md">
                    {entry.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
