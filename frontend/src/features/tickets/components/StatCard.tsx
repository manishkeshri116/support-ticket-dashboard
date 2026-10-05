import type { ReactNode } from "react";
import { TrendingUp } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  tone: "indigo" | "blue" | "amber" | "green";
  trend: string;
};

export function StatCard({ title, value, icon, tone, trend }: StatCardProps) {
  return <article className="stat-card"><div className="stat-top"><span>{title}</span><span className={`stat-icon ${tone}`}>{icon}</span></div><div className="stat-value">{value.toLocaleString()}</div><div className="stat-bottom"><span className={`stat-spark ${tone}`}><TrendingUp size={12} /></span>{trend}</div></article>;
}
