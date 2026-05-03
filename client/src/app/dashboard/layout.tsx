"use client";

import { Sidebar } from "@/components/sidebar";
import { NotificationBell } from "@/components/notification-bell";

import { useState } from "react";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Desktop & Mobile Header */}
        <header className="h-20 lg:h-24 border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 -ml-2"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 lg:h-4 lg:w-4 bg-black rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-widest text-black">Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <NotificationBell />
            <div className="h-8 w-[1px] bg-slate-100" />
            <div className="flex flex-col items-end">
              <span className="text-[9px] lg:text-[10px] font-bold text-black uppercase tracking-tight">System Online</span>
              <span className="hidden sm:block text-[8px] lg:text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Lat: 9.5624° N | Lon: 44.0670° E</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-50/50">
          <div className="p-4 lg:p-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
