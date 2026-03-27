"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Zap,
  CheckSquare,
  MonitorPlay,
  Brain,
  Plug,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Command Center", icon: LayoutDashboard },
  { href: "/productivity", label: "Productivity", icon: Zap },
  { href: "/tasks", label: "Tasks & Projects", icon: CheckSquare },
  { href: "/content", label: "Content Intel", icon: MonitorPlay },
  { href: "/brain", label: "Second Brain", icon: Brain },
  { href: "/connections", label: "Connections", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
];

function formatModel(model: string): string {
  return model
    .replace("google/", "")
    .replace("-preview", "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function Sidebar() {
  const pathname = usePathname();

  const [modelName, setModelName] = useState("Loading...");
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/status");
        if (res.ok) {
          const data = await res.json();
          setModelName(formatModel(data.model.primary));
          setIsOnline(true);
        }
      } catch {
        setIsOnline(false);
        setModelName("Offline");
      }
    }
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // XP bar config (gamification)
  const level = 7;
  const xpCurrent = 420;
  const xpMax = 600;
  const xpPercent = Math.round((xpCurrent / xpMax) * 100);
  const rank = "Field Agent";

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-surface-deepest flex flex-col z-50 border-r border-border-subtle">
      {/* Logo & App Name */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-orange flex items-center justify-center text-white font-bold text-sm">
            OC
          </div>
          <div>
            <h1 className="text-text-primary font-semibold text-sm tracking-tight">
              Mission Control
            </h1>
            <span className="text-text-muted text-xs">v0.1.0</span>
          </div>
        </div>
      </div>

      {/* Agent Status Card — LIVE */}
      <div className="mx-4 mb-5 p-3 rounded-lg bg-surface-card border border-border-subtle">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-pulse-dot absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? "bg-brand-green" : "bg-brand-red"}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? "bg-brand-green" : "bg-brand-red"}`} />
          </span>
          <div className="min-w-0">
            <p className="text-text-primary text-xs font-medium truncate">
              {isOnline ? "Vixi Online" : "Vixi Offline"}
            </p>
            <p className="text-text-muted text-[10px] truncate">
              Local · {modelName}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group
                ${
                  isActive
                    ? "bg-surface-elevated text-text-primary"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary opacity-72"
                }`}
            >
              <Icon
                size={18}
                className={`transition-colors duration-150 ${
                  isActive
                    ? "text-brand-orange"
                    : "text-text-muted group-hover:text-text-secondary"
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* XP Bar */}
      <div className="px-4 pb-5 pt-3 border-t border-border-subtle">
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-muted text-[10px] uppercase tracking-wider font-medium">
            Level {level}
          </span>
          <span className="text-text-muted text-[10px]">{rank}</span>
        </div>
        <div className="w-full h-1.5 bg-surface-hover rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${xpPercent}%`,
              background:
                "linear-gradient(90deg, #E5850F 0%, #5A9CF5 100%)",
            }}
          />
        </div>
        <p className="text-text-disabled text-[9px] mt-1 text-right">
          {xpCurrent} / {xpMax} XP
        </p>
      </div>
    </aside>
  );
}
