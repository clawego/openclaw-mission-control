"use client";

import { useState } from "react";
import {
  Plug,
  X,
  ExternalLink,
} from "lucide-react";

interface Connection {
  id: string;
  name: string;
  status: "active" | "inactive";
  description: string;
  category: string;
  via?: string;
}

// Derived from actual openclaw.json skills and channels
const connections: Connection[] = [
  { id: "telegram", name: "Telegram", status: "active", description: "Bot messaging channel", category: "Channel" },
  { id: "discord", name: "Discord", status: "active", description: "Guild messaging (open policy)", category: "Channel" },
  { id: "bluebubbles", name: "BlueBubbles", status: "active", description: "iMessage bridge (localhost:1234)", category: "Channel" },
  { id: "gemini", name: "Gemini CLI", status: "active", description: "Google Gemini integration", category: "AI" },
  { id: "github", name: "GitHub", status: "active", description: "Repository management", category: "Dev" },
  { id: "gh-issues", name: "GitHub Issues", status: "active", description: "Issue tracking", category: "Dev" },
  { id: "notion", name: "Notion", status: "active", description: "Knowledge base sync", category: "Productivity" },
  { id: "himalaya", name: "Himalaya", status: "active", description: "Email client", category: "Comms" },
  { id: "session-logs", name: "Session Logs", status: "active", description: "Conversation logging", category: "System" },
  { id: "summarize", name: "Summarize", status: "active", description: "Content summarization", category: "AI" },
  { id: "model-usage", name: "Model Usage", status: "active", description: "LLM cost tracking", category: "System" },
  { id: "healthcheck", name: "Health Check", status: "active", description: "System monitoring", category: "System" },
  { id: "node-connect", name: "Node Connect", status: "active", description: "Peer-to-peer agent networking", category: "System" },
  { id: "nano-banana-pro", name: "Nano Banana Pro", status: "active", description: "Edge compute module", category: "Hardware" },
  { id: "ordercli", name: "OrderCLI", status: "active", description: "Order management", category: "Commerce" },
  { id: "clawhub", name: "ClawHub", status: "active", description: "Skill marketplace", category: "System" },
  { id: "video-frames", name: "Video Frames", status: "active", description: "Video analysis", category: "AI" },
  { id: "voice-call", name: "Voice Call", status: "active", description: "Voice interaction", category: "Comms" },
  { id: "openai-image-gen", name: "OpenAI Image Gen", status: "active", description: "DALL-E image generation", category: "AI" },
  { id: "gifgrep", name: "GifGrep", status: "active", description: "GIF search", category: "Media" },
  { id: "peekaboo", name: "Peekaboo", status: "active", description: "Screenshot capture", category: "System" },
  { id: "tmux", name: "tmux", status: "active", description: "Terminal multiplexer", category: "Dev" },
  { id: "blogwatcher", name: "BlogWatcher", status: "active", description: "Blog monitoring", category: "Content" },
  { id: "skill-creator", name: "Skill Creator", status: "active", description: "Dynamic skill generation", category: "System" },
  // Disabled skills
  { id: "slack", name: "Slack", status: "inactive", description: "Team messaging", category: "Comms" },
  { id: "spotify", name: "Spotify Player", status: "inactive", description: "Music playback", category: "Media" },
  { id: "weather", name: "Weather", status: "inactive", description: "Weather data", category: "Data" },
  { id: "trello", name: "Trello", status: "inactive", description: "Project boards", category: "Productivity" },
  { id: "things", name: "Things 3", status: "inactive", description: "macOS task manager", category: "Productivity" },
  { id: "1password", name: "1Password", status: "inactive", description: "Secret management", category: "Security" },
];

export default function ConnectionsPage() {
  const [items, setItems] = useState(connections);
  const activeCount = items.filter((c) => c.status === "active").length;
  const totalCount = items.length;
  const progressPercent = Math.round((activeCount / totalCount) * 100);

  const toggleConnection = (id: string) => {
    setItems((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c
      )
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">🔌 Connections</h1>
        <p className="text-text-secondary text-sm mt-1">Every integration your agent has</p>
      </div>

      {/* Progress bar */}
      <div className="bg-surface-card rounded-xl border border-border-subtle p-5 animate-fade-in opacity-0 stagger-1" style={{ animationFillMode: "forwards" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-text-primary text-sm font-medium">
            {activeCount} / {totalCount} connected
          </span>
          <span className="text-text-muted text-xs">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg, #E5850F 0%, #2ECC8F 100%)",
            }}
          />
        </div>
      </div>

      {/* Connection Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {items.map((conn, i) => (
          <div
            key={conn.id}
            className={`relative bg-surface-card rounded-xl p-4 transition-all duration-200 animate-fade-in opacity-0 group
              ${conn.status === "active"
                ? "border border-border-subtle hover:border-border-hover"
                : "border-2 border-dashed border-border-subtle hover:border-border-default"
              }`}
            style={{ animationDelay: `${i * 0.02}s`, animationFillMode: "forwards" }}
          >
            {/* Status badge */}
            <div className="flex items-start justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-text-muted">
                <Plug size={16} />
              </div>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full
                  ${conn.status === "active"
                    ? "bg-brand-green/15 text-brand-green"
                    : "bg-brand-red/15 text-brand-red"
                  }`}
              >
                {conn.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>

            <h3 className="text-text-primary text-sm font-medium truncate">
              {conn.name}
            </h3>
            <p className="text-text-muted text-xs mt-0.5 truncate">
              {conn.description}
            </p>
            <span className="text-text-disabled text-[10px] mt-2 inline-block">
              {conn.category}
            </span>

            {/* Hover actions */}
            {conn.status === "active" ? (
              <button
                onClick={() => toggleConnection(conn.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-brand-red/20 text-text-muted hover:text-brand-red transition-all cursor-pointer"
                title="Disconnect"
              >
                <X size={14} />
              </button>
            ) : (
              <button
                onClick={() => toggleConnection(conn.id)}
                className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-default hover:border-brand-green text-text-muted hover:text-brand-green text-xs transition-all cursor-pointer"
              >
                <ExternalLink size={12} />
                Connect
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
