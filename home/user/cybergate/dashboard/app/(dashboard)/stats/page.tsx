"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";

export default function StatsPage(){
  const [top,setTop] = useState<any[]>([]);
  useEffect(()=>{ api.get("/api/stats/top").then(r=>setTop(r.data.top)) },[])
  return <div className="space-y-6">
    <h1 className="text-2xl font-semibold">Statistics</h1>
    <Card>
      <div className="text-sm text-zinc-300 mb-3">Top Users by Traffic</div>
      <div className="space-y-2">
        {top.map(t=>(
          <div key={t.id} className="flex justify-between text-sm glass px-3 py-2 rounded-lg">
            <span>{t.name}</span>
            <span className="text-neon-cyan font-mono">{(Number(t.trafficUsed)/1024/1024).toFixed(2)} MB</span>
          </div>
        ))}
        {top.length===0 && <div className="text-zinc-500 text-sm">No data yet</div>}
      </div>
    </Card>
  </div>
}
