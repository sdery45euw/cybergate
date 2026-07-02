import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "CyberGate – VLESS Gateway",
  description: "Modern cyberpunk VLESS over WebSocket gateway"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-display bg-bg min-h-screen">
        <Toaster richColors theme="dark" />
        {children}
      </body>
    </html>
  );
}
