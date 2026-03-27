import { readFileSync, existsSync } from "fs";
import { join } from "path";

const OPENCLAW_STATE_DIR =
  process.env.OPENCLAW_STATE_DIR || join(process.env.HOME || "~", ".openclaw");

export interface LogEntry {
  timestamp: string;
  type: string;
  message: string;
  responseTime?: number;
  raw: string;
}

/**
 * Parse gateway.log lines into structured entries.
 * Format: "2026-03-27T15:33:00.345-07:00 [ws] ⇄ res ✓ node.list 208ms conn=..."
 */
function parseLine(line: string): LogEntry | null {
  const match = line.match(
    /^(\d{4}-\d{2}-\d{2}T[\d:.]+[-+]\d{2}:\d{2})\s+\[([^\]]+)\]\s+(.+)$/
  );
  if (!match) return null;

  const [, timestamp, type, message] = match;
  const rtMatch = message.match(/(\d+)ms/);
  const responseTime = rtMatch ? parseInt(rtMatch[1], 10) : undefined;

  return { timestamp, type, message, responseTime, raw: line };
}

/** Classify a log entry into dashboard-friendly categories */
export function classifyEntry(entry: LogEntry): "heartbeat" | "message" | "tool_call" | "system" {
  if (entry.type === "heartbeat") return "heartbeat";
  if (["telegram", "discord", "bluebubbles", "imessage"].includes(entry.type)) return "message";
  if (entry.message.includes("tool") || entry.message.includes("exec")) return "tool_call";
  return "system";
}

/**
 * Create a user-friendly description from a raw log message.
 * Translates technical gateway log messages into readable descriptions.
 */
export function humanizeLogMessage(entry: LogEntry): string {
  const { type, message } = entry;

  // WebSocket API calls
  if (type === "ws") {
    if (message.includes("node.list")) return "Polled agent fleet status";
    if (message.includes("usage.cost")) return "Fetched token usage & cost data";
    if (message.includes("sessions.usage.timeseries")) return "Retrieved usage timeseries data";
    if (message.includes("sessions.usage.logs")) return "Retrieved session usage logs";
    if (message.includes("sessions.usage")) return "Fetched session usage summary";
    if (message.includes("res ✓")) {
      const opMatch = message.match(/res ✓ (\S+)/);
      if (opMatch) return `API call: ${opMatch[1].replace(/\./g, " → ")}`;
    }
    if (message.includes("res ✗")) {
      const opMatch = message.match(/res ✗ (\S+)/);
      if (opMatch) return `API call failed: ${opMatch[1]}`;
    }
    return "WebSocket activity";
  }

  // Messaging channels
  if (type === "telegram") {
    if (message.includes("message from")) return "Received Telegram message";
    if (message.includes("sent")) return "Sent Telegram reply";
    if (message.includes("polling")) return "Telegram polling active";
    return "Telegram activity";
  }
  if (type === "discord") {
    if (message.includes("WebSocket connection closed")) return "Discord gateway reconnecting";
    if (message.includes("resume")) return "Discord gateway resuming session";
    if (message.includes("connected")) return "Discord gateway connected";
    if (message.includes("message")) return "Discord message activity";
    return "Discord activity";
  }
  if (type === "bluebubbles") {
    if (message.includes("message")) return "iMessage activity via BlueBubbles";
    return "BlueBubbles bridge activity";
  }
  if (type === "imessage") return "iMessage activity";

  // System events
  if (type === "heartbeat") {
    if (message.includes("started")) return "Heartbeat service started";
    return "Agent heartbeat";
  }
  if (type === "health-monitor") {
    if (message.includes("started")) return "Health monitor started";
    return "Health check completed";
  }
  if (type === "gateway") {
    if (message.includes("listening")) return "Gateway started and listening";
    if (message.includes("SIGTERM")) return "Gateway shutdown signal received";
    if (message.includes("agent model")) {
      const modelMatch = message.match(/agent model: (.+)/);
      return modelMatch ? `Agent model set: ${modelMatch[1]}` : "Agent model configured";
    }
    if (message.includes("log file")) return "Gateway log file initialized";
    return "Gateway system event";
  }
  if (type === "canvas") return "Canvas UI mounted";
  if (type === "reload") return "Configuration reloaded";
  if (type === "gmail-watcher") return "Gmail watcher event";
  if (type === "browser/server") return "Browser control server started";

  // Default: clean up the raw message
  return message.length > 60 ? message.substring(0, 57) + "..." : message;
}

/** Read the last N lines from gateway.log */
export function getRecentActivity(count: number = 50): LogEntry[] {
  const logPath = join(OPENCLAW_STATE_DIR, "logs", "gateway.log");
  if (!existsSync(logPath)) return [];

  try {
    const content = readFileSync(logPath, "utf-8");
    const lines = content.trim().split("\n");
    const recentLines = lines.slice(-count * 2);

    return recentLines
      .map(parseLine)
      .filter((e): e is LogEntry => e !== null)
      .slice(-count);
  } catch {
    return [];
  }
}

/** Get activity stats — total AND today-only */
export function getActivityStats() {
  const logPath = join(OPENCLAW_STATE_DIR, "logs", "gateway.log");
  if (!existsSync(logPath)) {
    return {
      total: 0,
      byType: {} as Record<string, number>,
      todayCount: 0,
      todayByType: {} as Record<string, number>,
    };
  }

  try {
    const content = readFileSync(logPath, "utf-8");
    const lines = content.trim().split("\n");
    const today = new Date().toISOString().split("T")[0];

    const byType: Record<string, number> = {};
    const todayByType: Record<string, number> = {};
    let todayCount = 0;

    for (const line of lines) {
      const entry = parseLine(line);
      if (!entry) continue;
      byType[entry.type] = (byType[entry.type] || 0) + 1;

      if (entry.timestamp.startsWith(today)) {
        todayCount++;
        todayByType[entry.type] = (todayByType[entry.type] || 0) + 1;
      }
    }

    return { total: lines.length, byType, todayCount, todayByType };
  } catch {
    return {
      total: 0,
      byType: {} as Record<string, number>,
      todayCount: 0,
      todayByType: {} as Record<string, number>,
    };
  }
}

/** Get time-ago string */
export function timeAgo(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${diffDays}d ago`;
}
