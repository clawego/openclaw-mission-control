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
  // Match: timestamp [type] rest...
  const match = line.match(
    /^(\d{4}-\d{2}-\d{2}T[\d:.]+[-+]\d{2}:\d{2})\s+\[([^\]]+)\]\s+(.+)$/
  );
  if (!match) return null;

  const [, timestamp, type, message] = match;

  // Extract response time if present (e.g., "208ms")
  const rtMatch = message.match(/(\d+)ms/);
  const responseTime = rtMatch ? parseInt(rtMatch[1], 10) : undefined;

  return { timestamp, type, message, responseTime, raw: line };
}

/** Read the last N lines from gateway.log */
export function getRecentActivity(count: number = 50): LogEntry[] {
  const logPath = join(OPENCLAW_STATE_DIR, "logs", "gateway.log");
  if (!existsSync(logPath)) return [];

  try {
    const content = readFileSync(logPath, "utf-8");
    const lines = content.trim().split("\n");
    const recentLines = lines.slice(-count * 2); // grab extra to filter

    return recentLines
      .map(parseLine)
      .filter((e): e is LogEntry => e !== null)
      .slice(-count);
  } catch {
    return [];
  }
}

/** Get activity stats (counts by type) */
export function getActivityStats() {
  const logPath = join(OPENCLAW_STATE_DIR, "logs", "gateway.log");
  if (!existsSync(logPath)) return { total: 0, byType: {} as Record<string, number>, todayCount: 0 };

  try {
    const content = readFileSync(logPath, "utf-8");
    const lines = content.trim().split("\n");
    const today = new Date().toISOString().split("T")[0];

    const byType: Record<string, number> = {};
    let todayCount = 0;

    for (const line of lines) {
      const entry = parseLine(line);
      if (!entry) continue;
      byType[entry.type] = (byType[entry.type] || 0) + 1;
      if (entry.timestamp.startsWith(today)) todayCount++;
    }

    return { total: lines.length, byType, todayCount };
  } catch {
    return { total: 0, byType: {} as Record<string, number>, todayCount: 0 };
  }
}

/** Classify a log entry into dashboard-friendly categories */
export function classifyEntry(entry: LogEntry): "heartbeat" | "message" | "tool_call" | "system" {
  if (entry.type === "heartbeat") return "heartbeat";
  if (["telegram", "discord", "bluebubbles", "imessage"].includes(entry.type)) return "message";
  if (entry.message.includes("tool") || entry.message.includes("exec")) return "tool_call";
  return "system";
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
