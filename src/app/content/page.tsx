"use client";

import {
  MonitorPlay,
  Eye,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import StatCard from "@/components/StatCard";

export default function ContentIntelPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">📺 Content Intel</h1>
        <p className="text-text-secondary text-sm mt-1">Analytics for monitored content platforms</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Content Tracked" value={0} icon={MonitorPlay} gradient="orange" delay={1} />
        <StatCard title="Total Views" value={0} icon={Eye} gradient="blue" delay={2} />
        <StatCard title="Engagement Rate" value="—" icon={TrendingUp} gradient="green" delay={3} />
      </div>

      {/* Placeholder */}
      <div className="bg-surface-card rounded-xl border border-border-subtle p-12 text-center animate-fade-in opacity-0 stagger-4" style={{ animationFillMode: "forwards" }}>
        <BarChart3 size={48} className="text-text-disabled mx-auto mb-4" />
        <h2 className="text-text-primary font-semibold text-lg mb-2">No Content Sources Connected</h2>
        <p className="text-text-muted text-sm max-w-md mx-auto">
          Connect a content platform (YouTube, blog, LinkedIn) to start tracking performance metrics and outlier analysis.
        </p>
        <button className="mt-6 px-6 py-2.5 rounded-lg bg-brand-orange hover:bg-brand-orange/90 text-white text-sm font-medium transition-colors cursor-pointer">
          Connect Platform
        </button>
      </div>
    </div>
  );
}
