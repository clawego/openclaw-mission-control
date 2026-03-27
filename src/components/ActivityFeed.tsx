"use client";

import { useState, useEffect } from "react";
import {
  HeartPulse,
  MessageSquare,
  Wrench,
  Zap,
} from "lucide-react";

interface ActivityEntry {
  timestamp: string;
  timeAgo: string;
  type: "heartbeat" | "message" | "tool_call" | "system";
  source: string;
  message: string;
  responseTime: number | null;
}

const typeConfig = {
  heartbeat: { icon: HeartPulse, color: "text-brand-green", bg: "bg-brand-green/10" },
  message: { icon: MessageSquare, color: "text-brand-blue", bg: "bg-brand-blue/10" },
  tool_call: { icon: Wrench, color: "text-brand-orange", bg: "bg-brand-orange/10" },
  system: { icon: Zap, color: "text-brand-red", bg: "bg-brand-red/10" },
};

export default function ActivityFeed() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch("/api/activity?count=30");
        const data = await res.json();
        setEntries(data.entries || []);
      } catch (err) {
        console.error("Failed to fetch activity:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
    // Poll every 30 seconds
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle">
          <h2 className="text-text-primary font-semibold text-sm">Live Activity Feed</h2>
        </div>
        <div className="p-8 text-center text-text-muted text-sm">Loading activity...</div>
      </div>
    );
  }

  return (
    <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden animate-fade-in opacity-0 stagger-4" style={{ animationFillMode: "forwards" }}>
      <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
        <h2 className="text-text-primary font-semibold text-sm">
          Live Activity Feed
        </h2>
        <span className="text-text-muted text-[10px]">
          {entries.length} events · auto-refresh 30s
        </span>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {entries.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm">No recent activity</div>
        ) : (
          entries.map((item, i) => {
            const config = typeConfig[item.type] || typeConfig.system;
            const Icon = config.icon;
            return (
              <div
                key={`${item.timestamp}-${i}`}
                className="flex items-start gap-3 px-5 py-3 border-b border-border-subtle last:border-b-0 hover:bg-surface-hover/50 transition-colors"
              >
                <div className={`p-1.5 rounded-md ${config.bg} mt-0.5`}>
                  <Icon size={14} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-secondary text-sm truncate">
                    <span className="text-text-muted text-xs font-mono">[{item.source}]</span>{" "}
                    {item.message}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-text-muted text-[10px] whitespace-nowrap">
                    {item.timeAgo}
                  </span>
                  {item.responseTime && (
                    <span className="text-text-disabled text-[9px] font-mono">
                      {item.responseTime}ms
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
