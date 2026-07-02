"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, QrCode, Trash2, Copy as CloneIcon } from "lucide-react";

type Link = {
  id: string; uuid: string; name: string; path: string; enabled: boolean;
  trafficUsed: string; trafficLimit: string | null;
};

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [name, setName] = useState("");

  const load = () => api.get("/api/links").then(r => setLinks(r.data.links));
  useEffect(()=>{ load() },[]);

  const create = async () => {
    if(!name) return;
    await api.post("/api/links", { name });
    setName("");
    toast.success("Link created");
    load();
  };

  const copyUri = async (id:string) => {
    const { data } = await api.get(`/api/links/${id}/config`);
    await navigator.clipboard.writeText(data.uri);
    toast.success("VLESS URI copied");
  };

  const clone = async (id:string) => { await api.post(`/api/links/${id}/clone`); load(); toast.success("Cloned") };
  const remove = async (id:string) => { await api.delete(`/api/links/${id}`); load(); toast.success("Deleted") };
  const toggle = async (l:Link) => { await api.put(`/api/links/${l.id}`, { enabled: !l.enabled }); load() };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Link Manager</h1>
      <Card>
        <div className="flex gap-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="New link name, e.g. Tokyo-1"
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-neon-cyan/50"/>
          <button onClick={create} className="btn-glow px-4 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30">Create</button>
        </div>
      </Card>
      <div className="grid md:grid-cols-2 gap-4">
        {links.map(l => (
          <Card key={l.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{l.name}</div>
                <div className="text-xs text-zinc-400 font-mono mt-1">{l.uuid}</div>
                <div className="text-xs text-zinc-500 mt-2">Used: {(Number(l.trafficUsed)/1024/1024).toFixed(2)} MB • Path: {l.path}</div>
              </div>
              <label className="text-xs flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={l.enabled} onChange={()=>toggle(l)} />
                Enabled
              </label>
            </div>
            <div className="flex gap-2 mt-4 text-zinc-300">
              <button onClick={()=>copyUri(l.id)} className="glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:text-neon-cyan"><Copy size={14}/> Copy URI</button>
              <button onClick={()=>clone(l.id)} className="glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"><CloneIcon size={14}/> Clone</button>
              <button onClick={()=>remove(l.id)} className="glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:text-red-400"><Trash2 size={14}/> Delete</button>
            </div>
          </Card>
        ))}
        {links.length===0 && <div className="text-zinc-500">No links yet.</div>}
      </div>
    </div>
  )
}
