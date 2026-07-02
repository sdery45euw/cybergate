"use client";
import { Card } from "@/components/ui/card";

export default function Settings(){
  return <div className="space-y-6">
    <h1 className="text-2xl font-semibold">Settings</h1>
    <div className="grid md:grid-cols-2 gap-4">
      {["General","Security","Proxy","Gateway","Appearance","Backup / Restore"].map(s=>(
        <Card key={s}><div className="font-medium">{s}</div><div className="text-zinc-500 text-sm mt-1">Configure {s.toLowerCase()} options in the API. Full UI coming soon.</div></Card>
      ))}
    </div>
  </div>
}
