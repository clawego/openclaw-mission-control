"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Wrench,
  RefreshCw,
  Clock,
  Send,
  RotateCcw,
  FileText,
  Loader,
  Coins,
  Activity,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import ActivityFeed from "@/components/ActivityFeed";

interface StatusData {
  status: string;
  version: string;
  gateway: { port: number; mode: string; uptime: string };
  model: { primary: string };
  memory: { backend: string; updateInterval: string };
  compaction: { mode: string; reserveTokensFloor: number; softThresholdTokens: number; memoryFlushEnabled: boolean };
  agents: { count: number; list: Array<{ id: string; model: string; heartbeat: string }> };
  skills: { total: number; enabled: number };
  channels: { total: number; enabled: number };
  activity: {
    total: number;
    todayCount: number;
    byType: Record<string, number>;
    todayByType: Record<string, number>;
  };
}

function formatModel(model: string): string {
  return model
    .replace("google/", "")
    .replace("-preview", "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function CommandCenter() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/status");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch status:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size={24} className="text-brand-orange animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8 text-text-muted">
        Failed to connect to OpenClaw. Is the gateway running?
      </div>
    );
  }

  // Daily counts
  const todayMessages = (data.activity.todayByType?.["telegram"] || 0) + (data.activity.todayByType?.["discord"] || 0) + (data.activity.todayByType?.["bluebubbles"] || 0) + (data.activity.todayByType?.["imessage"] || 0);
  const todayWsCalls = data.activity.todayByType?.["ws"] || 0;
  const todayHeartbeats = data.activity.todayByType?.["heartbeat"] || 0;

  // Cumulative counts
  const totalMessages = (data.activity.byType["telegram"] || 0) + (data.activity.byType["discord"] || 0) + (data.activity.byType["bluebubbles"] || 0) + (data.activity.byType["imessage"] || 0);
  const totalWsCalls = data.activity.byType["ws"] || 0;

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

      {/* Stat Cards — TODAY focused, cumulative de-emphasized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Messages Today"
          value={todayMessages}
          badge={`${totalMessages.toLocaleString()} total`}
          icon={MessageSquare}
          gradient="orange"
          delay={1}
        />
        <StatCard
          title="API Calls Today"
          value={todayWsCalls}
          badge={`${totalWsCalls.toLocaleString()} total`}
          icon={Wrench}
          gradient="blue"
          delay={2}
        />
        <StatCard
          title="Events Today"
          value={data.activity.todayCount}
          badge={`${data.activity.total.toLocaleString()} total`}
          icon={Activity}
          gradient="green"
          delay={3}
        />
        <StatCard
          title="Gateway Uptime"
          value={data.gateway.uptime}
          icon={Clock}
          gradient="red"
          delay={4}
        />
      </div>

      {/* Token Usage Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface-card rounded-xl border border-border-subtle p-5 animate-fade-in opacity-0" style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-surface-hover">
              <Coins size={20} className="text-brand-orange" />
            </div>
            <div>
              <h3 className="text-text-primary font-semibold text-sm">Token Usage Today</h3>
              <p className="text-text-muted text-[10px]">Estimated from session activity</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">API Calls</p>
              <p className="text-text-primary text-lg font-bold">{todayWsCalls}</p>
            </div>
            <div>
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">Messages</p>
              <p className="text-text-primary text-lg font-bold">{todayMessages}</p>
            </div>
            <div>
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">Heartbeats</p>
              <p className="text-text-primary text-lg font-bold">{todayHeartbeats}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-card rounded-xl border border-border-subtle p-5 animate-fade-in opacity-0" style={{ animationDelay: "0.30s", animationFillMode: "forwards" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-surface-hover">
              <RefreshCw size={20} className="text-brand-blue" />
            </div>
            <div>
              <h3 className="text-text-primary font-semibold text-sm">Cumulative Totals</h3>
              <p className="text-text-muted text-[10px]">Since gateway first started</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">All Events</p>
              <p className="text-text-primary text-lg font-bold">{data.activity.total.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">Messages</p>
              <p className="text-text-primary text-lg font-bold">{totalMessages.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">WS Calls</p>
              <p className="text-text-primary text-lg font-bold">{totalWsCalls.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed — takes 2 columns */}
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Agent Configuration — LIVE DATA */}
          <div className="bg-surface-card rounded-xl border border-border-subtle p-5 animate-fade-in opacity-0 stagger-3" style={{ animationFillMode: "forwards" }}>
            <h2 className="text-text-primary font-semibold text-sm mb-4">
              Agent Configuration
            </h2>
            <div className="space-y-3">
              {[
                { label: "Primary Model", value: formatModel(data.model.primary) },
                { label: "Provider", value: "Google AI" },
                { label: "Memory Backend", value: data.memory.backend.toUpperCase() },
                { label: "Memory Interval", value: data.memory.updateInterval },
                { label: "Compaction", value: `${(data.compaction.softThresholdTokens / 1000).toFixed(0)}K token threshold` },
                { label: "Gateway", value: `localhost:${data.gateway.port} (${data.gateway.mode})` },
                { label: "Active Agents", value: `${data.agents.count} agents` },
                { label: "Channels", value: `${data.channels.enabled} enabled` },
                { label: "Version", value: data.version },
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

          {/* Agents List */}
          <div className="bg-surface-card rounded-xl border border-border-subtle p-5 animate-fade-in opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <h2 className="text-text-primary font-semibold text-sm mb-4">
              Agent Fleet
            </h2>
            <div className="space-y-2">
              {data.agents.list.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-hover/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-green" />
                    <span className="text-text-primary text-xs font-medium">{agent.id}</span>
                  </div>
                  <span className="text-text-muted text-[10px] font-mono">
                    {formatModel(agent.model)}
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
