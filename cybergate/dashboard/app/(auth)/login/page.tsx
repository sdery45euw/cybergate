"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import ParticlesBg from "@/components/layout/ParticlesBg";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@cybergate.local");
  const [password, setPassword] = useState("ChangeMe123!");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("cg_access", data.accessToken);
      toast.success("Welcome to CyberGate");
      router.push("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    } finally { setLoading(false) }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <ParticlesBg />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[24px] p-10 w-full max-w-md shadow-glow">
        <h1 className="text-3xl font-bold neon-text mb-2">CyberGate</h1>
        <p className="text-zinc-400 mb-8 text-sm">VLESS over WebSocket Gateway • Admin Login</p>
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-cyan/60" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-cyan/60" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button disabled={loading} className="w-full btn-glow bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/40 rounded-xl py-3 font-semibold">
            {loading ? "..." : "Enter Gateway"}
          </button>
        </form>
        <p className="text-xs text-zinc-500 mt-6">Default: admin@cybergate.local / ChangeMe123!</p>
      </motion.div>
    </div>
  )
}
