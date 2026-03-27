import { readFileSync, existsSync, statSync } from "fs";
import { join } from "path";

// OpenClaw state directory
const OPENCLAW_STATE_DIR =
  process.env.OPENCLAW_STATE_DIR || join(process.env.HOME || "~", ".openclaw");

const OPENCLAW_CONFIG_PATH =
  process.env.OPENCLAW_CONFIG_PATH || join(OPENCLAW_STATE_DIR, "openclaw.json");

export interface OpenClawConfig {
  meta: { lastTouchedVersion: string; lastTouchedAt: string };
  agents: {
    defaults: {
      model: { primary: string; fallbacks: string[] };
      compaction: {
        mode: string;
        reserveTokensFloor: number;
        memoryFlush: {
          enabled: boolean;
          softThresholdTokens: number;
        };
      };
      heartbeat: { every: string };
      maxConcurrent: number;
      subagents: { maxConcurrent: number };
    };
    list: Array<{
      id: string;
      skills?: string[];
      model?: { primary: string };
      heartbeat?: { every: string };
    }>;
  };
  memory: {
    backend: string;
    qmd?: {
      includeDefaultMemory: boolean;
      update: { interval: string; debounceMs: number };
    };
  };
  channels: Record<string, { enabled: boolean; [key: string]: unknown }>;
  skills: {
    entries: Record<string, { enabled: boolean }>;
  };
  gateway: {
    port: number;
    mode: string;
    bind: string;
  };
}

/** Read and parse openclaw.json */
export function getConfig(): OpenClawConfig {
  const raw = readFileSync(OPENCLAW_CONFIG_PATH, "utf-8");
  return JSON.parse(raw);
}

/** Get list of agents with their models */
export function getAgents() {
  const config = getConfig();
  const defaultModel = config.agents.defaults.model.primary;

  return config.agents.list.map((agent) => ({
    id: agent.id,
    model: agent.model?.primary || defaultModel,
    heartbeat: agent.heartbeat?.every || config.agents.defaults.heartbeat.every,
    skillCount: agent.skills?.length || 0,
  }));
}

/** Get enabled skills from openclaw.json */
export function getSkills() {
  const config = getConfig();
  const entries = config.skills?.entries || {};
  const agentSkills = config.agents.list.find((a) => a.id === "main")?.skills || [];

  return agentSkills.map((name) => ({
    name,
    enabled: entries[name]?.enabled !== false,
  }));
}

/** Get enabled channels */
export function getChannels() {
  const config = getConfig();
  return Object.entries(config.channels || {}).map(([name, ch]) => ({
    name,
    enabled: ch.enabled === true,
  }));
}

/** Get memory config */
export function getMemoryConfig() {
  const config = getConfig();
  return {
    backend: config.memory.backend,
    updateInterval: config.memory.qmd?.update?.interval || "5m",
    debounceMs: config.memory.qmd?.update?.debounceMs || 15000,
    includeDefaultMemory: config.memory.qmd?.includeDefaultMemory ?? true,
  };
}

/** Get gateway uptime by reading earliest log entry */
export function getGatewayUptime(): string {
  const logPath = join(OPENCLAW_STATE_DIR, "logs", "gateway.log");
  if (!existsSync(logPath)) return "unknown";

  try {
    const stat = statSync(logPath);
    const uptimeMs = Date.now() - stat.birthtimeMs;
    const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
    const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  } catch {
    return "unknown";
  }
}

/** Read a workspace file */
export function readWorkspaceFile(filename: string): string | null {
  const filepath = join(OPENCLAW_STATE_DIR, "workspace", filename);
  if (!existsSync(filepath)) return null;
  return readFileSync(filepath, "utf-8");
}

/** Get workspace memory session files */
export function getMemorySessionFiles() {
  const memDir = join(OPENCLAW_STATE_DIR, "workspace", "memory");
  if (!existsSync(memDir)) return [];

  const { readdirSync } = require("fs");
  const files: string[] = readdirSync(memDir);
  return files
    .filter((f: string) => f.endsWith(".md"))
    .map((f: string) => {
      const filepath = join(memDir, f);
      const stat = statSync(filepath);
      return {
        name: f,
        size: stat.size,
        modified: stat.mtime.toISOString(),
        content: readFileSync(filepath, "utf-8"),
      };
    })
    .sort((a: { modified: string }, b: { modified: string }) => b.modified.localeCompare(a.modified));
}

export { OPENCLAW_STATE_DIR };
