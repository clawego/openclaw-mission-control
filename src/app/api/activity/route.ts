import { NextResponse } from "next/server";
import { getRecentActivity, classifyEntry, timeAgo, humanizeLogMessage } from "@/lib/logs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get("count") || "30", 10);

    const entries = getRecentActivity(Math.min(count, 100));

    const formatted = entries.reverse().map((entry) => ({
      timestamp: entry.timestamp,
      timeAgo: timeAgo(entry.timestamp),
      type: classifyEntry(entry),
      source: entry.type,
      humanMessage: humanizeLogMessage(entry),
      rawMessage: entry.message,
      responseTime: entry.responseTime || null,
    }));

    return NextResponse.json({ entries: formatted, total: formatted.length });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read activity log", detail: String(error) },
      { status: 500 }
    );
  }
}
