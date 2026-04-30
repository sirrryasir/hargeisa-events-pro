"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Building2, 
  CalendarDays, 
  Users, 
  Store, 
  CreditCard, 
  BarChart3,
  LogOut,
  Settings,
  User
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role || "customer";

  const adminNav = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Venues", href: "/dashboard/venues", icon: Building2 },
    { name: "Bookings", href: "/dashboard/bookings", icon: Users },
    { name: "Availability", href: "/dashboard/calendar", icon: CalendarDays },
    { name: "Vendors", href: "/dashboard/vendors", icon: Store },
    { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  ];

  const customerNav = [
    { name: "My Bookings", href: "/dashboard/my-bookings", icon: CalendarDays },
    { name: "Browse Venues", href: "/dashboard/venues", icon: Building2 },
    { name: "Availability", href: "/dashboard/calendar", icon: CalendarDays },
    { name: "Vendor Directory", href: "/dashboard/vendors", icon: Store },
    { name: "My Invoices", href: "/dashboard/payments", icon: CreditCard },
    { name: "Support", href: "/dashboard/support", icon: Users },
  ];

  const navigation = role === "customer" ? customerNav : adminNav;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col shrink-0 min-h-screen">
      <div className="h-24 flex flex-col justify-center px-6 border-b border-slate-200">
        <span className="text-xl font-black text-black tracking-tighter uppercase">
          HARGEISA<span className="text-slate-400">PRO</span>
        </span>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 bg-black rounded-full" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{role} ACCESS</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-4">
          {role === "customer" ? "Client Services" : "Operations Control"}
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-3 text-xs font-bold rounded-none border-l-2 transition-all uppercase tracking-tight ${
                isActive 
                  ? "bg-slate-50 text-black border-black" 
                  : "text-slate-400 border-transparent hover:text-black hover:bg-slate-50"
              }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 transition-colors ${
                isActive ? "text-black" : "text-slate-300 group-hover:text-black"
              }`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 space-y-1">
        <div className="flex items-center gap-3 px-3 py-3 mb-2">
          <div className="w-8 h-8 bg-slate-100 flex items-center justify-center text-slate-400">
            <User size={16} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] font-bold text-black uppercase truncate">{session?.user?.name || "Accessing..."}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate">{session?.user?.email}</span>
          </div>
        </div>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
        >
          <Settings className="h-4 w-4" />
          System Settings
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
}
