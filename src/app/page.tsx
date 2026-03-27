"use client";

import {
  MessageSquare,
  Wrench,
  RefreshCw,
  Clock,
  Send,
  RotateCcw,
  FileText,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import ActivityFeed from "@/components/ActivityFeed";

export default function CommandCenter() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          🏠 Command Center
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Real-time overview of your OpenClaw agent fleet
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Messages Handled"
          value={247}
          badge="+12 today"
          icon={MessageSquare}
          gradient="orange"
          delay={1}
        />
        <StatCard
          title="Tool Calls"
          value={89}
          badge="+5 today"
          icon={Wrench}
          gradient="blue"
          delay={2}
        />
        <StatCard
          title="Content Synced"
          value={34}
          badge="+2 today"
          icon={RefreshCw}
          gradient="green"
          delay={3}
        />
        <StatCard
          title="Agent Uptime"
          value="14h 3m"
          icon={Clock}
          gradient="red"
          delay={4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed — takes 2 columns */}
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>

        {/* Right column — Agent Config + Quick Actions */}
        <div className="space-y-6">
          {/* Agent Configuration */}
          <div className="bg-surface-card rounded-xl border border-border-subtle p-5 animate-fade-in opacity-0 stagger-3" style={{ animationFillMode: "forwards" }}>
            <h2 className="text-text-primary font-semibold text-sm mb-4">
              Agent Configuration
            </h2>
            <div className="space-y-3">
              {[
                { label: "Primary Model", value: "Gemini 3 Flash" },
                { label: "Provider", value: "Google AI" },
                { label: "Memory Backend", value: "QMD" },
                { label: "Heartbeat", value: "Every 1h" },
                { label: "Compaction", value: "80K token threshold" },
                { label: "Active Agents", value: "6 (main, monitor, local-scout, product-scout, ops-engineer, analytics)" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-1.5 border-b border-border-subtle last:border-b-0"
                >
                  <span className="text-text-muted text-xs">{item.label}</span>
                  <span className="text-text-primary text-xs font-medium font-mono">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface-card rounded-xl border border-border-subtle p-5 animate-fade-in opacity-0 stagger-4" style={{ animationFillMode: "forwards" }}>
            <h2 className="text-text-primary font-semibold text-sm mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              {[
                { label: "Send Heartbeat", icon: Send, color: "text-brand-green" },
                { label: "Sync Content", icon: RotateCcw, color: "text-brand-blue" },
                { label: "Run Daily Brief", icon: FileText, color: "text-brand-orange" },
              ].map((action) => (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-surface-hover hover:bg-surface-elevated border border-border-subtle hover:border-border-hover transition-all duration-150 text-sm text-text-secondary hover:text-text-primary cursor-pointer"
                >
                  <action.icon size={16} className={action.color} />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
