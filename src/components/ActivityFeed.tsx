"use client";

import {
  HeartPulse,
  MessageSquare,
  Wrench,
  Zap,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "heartbeat" | "message" | "tool_call" | "system";
  description: string;
  timestamp: string;
}

const typeConfig = {
  heartbeat: { icon: HeartPulse, color: "text-brand-green", bg: "bg-brand-green/10" },
  message: { icon: MessageSquare, color: "text-brand-blue", bg: "bg-brand-blue/10" },
  tool_call: { icon: Wrench, color: "text-brand-orange", bg: "bg-brand-orange/10" },
  system: { icon: Zap, color: "text-brand-red", bg: "bg-brand-red/10" },
};

// Mock activity data — will be replaced with real SQLite reads
const mockActivities: ActivityItem[] = [
  { id: "1", type: "heartbeat", description: "Vixi heartbeat — all systems nominal", timestamp: "2m ago" },
  { id: "2", type: "message", description: "Processed Telegram message from user", timestamp: "5m ago" },
  { id: "3", type: "tool_call", description: "Executed tavily-search skill", timestamp: "12m ago" },
  { id: "4", type: "system", description: "Memory compaction triggered (80K tokens)", timestamp: "18m ago" },
  { id: "5", type: "heartbeat", description: "Monitor agent heartbeat", timestamp: "22m ago" },
  { id: "6", type: "tool_call", description: "Executed coingecko skill", timestamp: "31m ago" },
  { id: "7", type: "message", description: "Processed Discord message in guild", timestamp: "45m ago" },
  { id: "8", type: "system", description: "QMD memory index updated", timestamp: "1h ago" },
];

export default function ActivityFeed() {
  return (
    <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden animate-fade-in opacity-0 stagger-4" style={{ animationFillMode: "forwards" }}>
      <div className="px-5 py-4 border-b border-border-subtle">
        <h2 className="text-text-primary font-semibold text-sm">
          Live Activity Feed
        </h2>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {mockActivities.map((item) => {
          const config = typeConfig[item.type];
          const Icon = config.icon;
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 px-5 py-3 border-b border-border-subtle last:border-b-0 hover:bg-surface-hover/50 transition-colors"
            >
              <div className={`p-1.5 rounded-md ${config.bg} mt-0.5`}>
                <Icon size={14} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-secondary text-sm truncate">
                  {item.description}
                </p>
              </div>
              <span className="text-text-muted text-[10px] whitespace-nowrap mt-0.5">
                {item.timestamp}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
