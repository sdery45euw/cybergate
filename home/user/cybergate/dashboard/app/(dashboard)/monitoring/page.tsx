"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";

export default function Monitoring(){
  const [logs,setLogs]=useState<any[]>([]);
  const load=()=>api.get("/api/monitoring/logs").then(r=>setLogs(r.data.logs));
  useEffect(()=>{ load(); const t=setInterval(load,4000); return ()=>clearInterval(t)},[]);
  return <div className="space-y-6">
    <h1 className="text-2xl font-semibold">Monitoring • Live Logs</h1>
    <Card>
      <div className="text-xs font-mono space-y-1 max-h-[560px] overflow-auto">
        {logs.map((l,i)=>(
          <div key={l.id||i} className="text-zinc-400">{new Date(l.createdAt).toLocaleTimeString()} • {l.link?.name || l.linkId} • ↑{l.bytesUp} ↓{l.bytesDown} • {l.ip||'-'}</div>
        ))}
        {logs.length===0 && <div className="text-zinc-500">No logs yet</div>}
      </div>
    </Card>
  </div>
}
