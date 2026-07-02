import { cn } from "@/lib/cn";
import { ReactNode } from "react";

export function Card({ children, className }: { children: ReactNode, className?: string }) {
  return <div className={cn("glass rounded-2xl p-5 shadow-glow", className)}>{children}</div>
}
