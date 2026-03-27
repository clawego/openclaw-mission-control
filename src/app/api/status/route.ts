import { NextResponse } from "next/server";
import {
  getConfig,
  getAgents,
  getSkills,
  getChannels,
  getMemoryConfig,
  getGatewayUptime,
  readWorkspaceFile,
  getMemorySessionFiles,
} from "@/lib/openclaw";
import { getActivityStats } from "@/lib/logs";

export async function GET() {
  try {
    const config = getConfig();
    const agents = getAgents();
    const skills = getSkills();
    const channels = getChannels();
    const memoryConfig = getMemoryConfig();
    const uptime = getGatewayUptime();
    const activityStats = getActivityStats();
    const soul = readWorkspaceFile("SOUL.md");
    const identity = readWorkspaceFile("IDENTITY.md");
    const heartbeat = readWorkspaceFile("HEARTBEAT.md");
    const memorySessions = getMemorySessionFiles();

    const enabledSkills = skills.filter((s) => s.enabled).length;
    const enabledChannels = channels.filter((c) => c.enabled).length;

    return NextResponse.json({
      status: "online",
      version: config.meta.lastTouchedVersion,
      lastTouched: config.meta.lastTouchedAt,
      gateway: {
        port: config.gateway.port,
        mode: config.gateway.mode,
        uptime,
      },
      model: {
        primary: config.agents.defaults.model.primary,
        fallbacks: config.agents.defaults.model.fallbacks,
      },
      memory: memoryConfig,
      compaction: {
        mode: config.agents.defaults.compaction.mode,
        reserveTokensFloor: config.agents.defaults.compaction.reserveTokensFloor,
        softThresholdTokens: config.agents.defaults.compaction.memoryFlush.softThresholdTokens,
        memoryFlushEnabled: config.agents.defaults.compaction.memoryFlush.enabled,
      },
      agents: {
        count: agents.length,
        list: agents,
      },
      skills: {
        total: skills.length,
        enabled: enabledSkills,
        list: skills,
      },
      channels: {
        total: channels.length,
        enabled: enabledChannels,
        list: channels,
      },
      activity: {
        total: activityStats.total,
        byType: activityStats.byType,
        todayCount: activityStats.todayCount,
        todayByType: activityStats.todayByType,
      },
      workspace: {
        hasSoul: !!soul,
        hasIdentity: !!identity,
        heartbeat: heartbeat || null,
        memorySessions: memorySessions.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read OpenClaw config", detail: String(error) },
      { status: 500 }
    );
  }
}
