import { NextResponse } from "next/server";
import { readWorkspaceFile, getMemorySessionFiles } from "@/lib/openclaw";

export async function GET() {
  try {
    const soul = readWorkspaceFile("SOUL.md");
    const identity = readWorkspaceFile("IDENTITY.md");
    const user = readWorkspaceFile("USER.md");
    const agents = readWorkspaceFile("AGENTS.md");
    const heartbeat = readWorkspaceFile("HEARTBEAT.md");
    const memorySessions = getMemorySessionFiles();

    return NextResponse.json({
      soul,
      identity,
      user,
      agents,
      heartbeat,
      memorySessions,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read memory data", detail: String(error) },
      { status: 500 }
    );
  }
}
