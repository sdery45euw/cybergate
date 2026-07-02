"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardHome() {
  const [overview, setOverview] = useState<any>({});
  const [traffic, setTraffic] = useState<any[]>([]);
  const [live, setLive] = useState(0);

  useEffect(() => {
    api.get("/api/stats/overview").then(r => setOverview(r.data));
    api.get("/api/stats/traffic").then(r => setTraffic(r.data.points));
    const wsUrl = (process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080") + "/live";
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (ev) => { try { const j = JSON.parse(ev.data); setLive(j.live ?? 0)} catch {} };
    return () => ws.close();
  }, []);

  const stats = [
    { label: "Live Connections", value: live },
    { label: "Total Traffic", value: overview.totalTraffic ? (Number(overview.totalTraffic)/1024/1024).toFixed(1) + " MB" : "—" },
    { label: "Links", value: overview.links ?? "—" },
    { label: "CPU Load", value: overview.cpu ?? "—" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Gateway Overview</h1>
        <span className="text-xs text-zinc-400">Realtime • CyberGate</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s,i)=>(
          <motion.div key={s.label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}>
            <Card>
              <div className="text-zinc-400 text-xs">{s.label}</div>
              <div className="text-2xl font-semibold mt-2 neon-text">{s.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>
      <Card>
        <div className="text-sm text-zinc-300 mb-3">Traffic – Last 14 days</div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={traffic}>
              <XAxis dataKey="date" stroke="#666" fontSize={11} />
              <YAxis stroke="#666" fontSize={11} />
              <Tooltip contentStyle={{ background: "#0b0f1c", border: "1px solid rgba(255,255,255,0.1)"}} />
              <Line type="monotone" dataKey="down" stroke="#00f5ff" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="up" stroke="#9d00ff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
