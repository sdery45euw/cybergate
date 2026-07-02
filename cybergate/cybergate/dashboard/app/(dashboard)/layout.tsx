"use client";
import Sidebar from "@/components/layout/Sidebar";
import ParticlesBg from "@/components/layout/ParticlesBg";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <ParticlesBg />
      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
        <Sidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
