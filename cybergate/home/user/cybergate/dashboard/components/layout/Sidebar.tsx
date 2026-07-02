"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Link2, BarChart3, Activity, Settings, KeyRound } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/links", label: "Links", icon: Link2 },
  { href: "/stats", label: "Statistics", icon: BarChart3 },
  { href: "/monitoring", label: "Monitoring", icon: Activity },
  { href: "/api-keys", label: "API Keys", icon: KeyRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-[248px] shrink-0 hidden md:block">
      <div className="glass rounded-2xl p-4 sticky top-6">
        <div className="px-2 py-3 mb-3">
          <div className="text-xl font-bold neon-text">CyberGate</div>
          <div className="text-[11px] text-zinc-400">v1.0 • CYBERPUNK</div>
        </div>
        <nav className="space-y-1">
          {items.map(it => {
            const active = path.startsWith(it.href);
            return (
              <Link key={it.href} href={it.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${active ? "bg-white/[0.06] text-neon-cyan" : "text-zinc-300 hover:bg-white/[0.04]"}`}>
                <it.icon size={18} />
                <span className="text-sm font-medium">{it.label}</span>
                {active && <motion.div layoutId="sb" className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-glow" />}
              </Link>
            )
          })}
        </nav>
        <div className="mt-6 text-[11px] text-zinc-500 px-2">Gateway: <span className="text-zinc-300">online</span></div>
      </div>
    </aside>
  )
}
