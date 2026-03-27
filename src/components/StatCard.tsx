"use client";

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  badge?: string;
  icon: LucideIcon;
  gradient: "orange" | "blue" | "green" | "red";
  delay?: number;
}

const gradientClasses = {
  orange: "gradient-orange",
  blue: "gradient-blue",
  green: "gradient-green",
  red: "gradient-red",
};

const iconColors = {
  orange: "text-brand-orange",
  blue: "text-brand-blue",
  green: "text-brand-green",
  red: "text-brand-red",
};

export default function StatCard({
  title,
  value,
  badge,
  icon: Icon,
  gradient,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className="animate-fade-in opacity-0 bg-surface-card rounded-xl border border-border-subtle overflow-hidden hover:border-border-hover transition-colors duration-200"
      style={{ animationDelay: `${delay * 0.05}s`, animationFillMode: "forwards" }}
    >
      {/* Gradient top bar */}
      <div className={`h-1 ${gradientClasses[gradient]}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-surface-hover">
            <Icon size={20} className={iconColors[gradient]} />
          </div>
          {badge && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-hover text-brand-green">
              {badge}
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-text-primary tracking-tight">
          {value}
        </p>
        <p className="text-text-muted text-xs mt-1">{title}</p>
      </div>
    </div>
  );
}
