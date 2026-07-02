"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function ApiKeys(){
  const [tokens,setTokens]=useState<any[]>([])
  const load=()=>api.get("/api/tokens").then(r=>setTokens(r.data.tokens))
  useEffect(()=>{load()},[])
  const create=async()=>{
    const { data } = await api.post("/api/tokens",{name:"CyberGate Token"})
    await navigator.clipboard.writeText(data.raw)
    toast.success("API token copied to clipboard")
    load()
  }
  return <div className="space-y-6">
    <div className="flex items-center justify-between"><h1 className="text-2xl font-semibold">API Tokens</h1>
    <button onClick={create} className="btn-glow px-3 py-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-sm">New Token</button></div>
    <Card>
      {tokens.map(t=> <div key={t.id} className="text-sm py-2 border-b border-white/5 last:border-0 flex justify-between"><span>{t.name}</span><span className="text-zinc-500">{new Date(t.createdAt).toLocaleDateString()}</span></div>)}
      {tokens.length===0 && <div className="text-zinc-500 text-sm">No tokens yet.</div>}
    </Card>
    <Card>
      <div className="text-sm">REST API: <code className="text-neon-cyan">/api/*</code> • Swagger: <code>/docs</code></div>
    </Card>
  </div>
}
