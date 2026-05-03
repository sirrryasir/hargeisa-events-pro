"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  Users, 
  Building2, 
  CalendarDays, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Booking, Payment } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShieldCheck, Info, Lock } from "lucide-react";
import { VenueForm } from "@/components/venue-form";
import { VendorForm } from "@/components/vendor-form";

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = session?.user?.role || "customer";
  const firstName = session?.user?.name?.split(" ")[0] || "User";

  const [liveStats, setLiveStats] = useState({ bookings: "0", venues: "0", revenue: "$0", pending: "0" });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bRes, vRes, pRes] = await Promise.all([
          api.get("/bookings"),
          api.get("/venues"),
          api.get("/payments").catch(() => ({ data: { data: [] } }))
        ]);
        const bookings = bRes.data.data;
        const venues = vRes.data.data;
        const payments = pRes.data.data;

        setLiveStats({
          bookings: bookings.length.toString(),
          venues: venues.length.toString(),
          revenue: `$${payments.filter((p: Payment) => p.status === "paid").reduce((s: number, p: Payment) => s + p.amount, 0).toLocaleString()}`,
          pending: bookings.filter((b: Booking) => b.status === "pending").length.toString()
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  const adminStats = [
    { label: "Total Bookings", value: liveStats.bookings, icon: Users, trend: "+12%", href: "/dashboard/bookings" },
    { label: "Venues Active", value: liveStats.venues, icon: Building2, trend: "Stable", href: "/dashboard/venues" },
    { label: "Pending Requests", value: liveStats.pending, icon: Clock, trend: "-3%", href: "/dashboard/bookings" },
    { label: "Total Revenue", value: liveStats.revenue, icon: TrendingUp, trend: "+8%", href: "/dashboard/payments" },
  ];

  const customerStats = [
    { label: "Active Bookings", value: liveStats.bookings, icon: CalendarDays, trend: "Upcoming", href: "/dashboard/my-bookings" },
    { label: "Pending Payment", value: "$0", icon: AlertCircle, trend: "Due in 3d", href: "/dashboard/payments" },
    { label: "Completed Events", value: "0", icon: CheckCircle2, trend: "History", href: "/dashboard/my-bookings" },
    { label: "Reward Points", value: "450", icon: TrendingUp, trend: "Elite", href: "/dashboard/my-bookings" },
  ];

  const stats = role === "admin" ? adminStats : customerStats;

  return (
    <div className="space-y-8">
      <div className="border-b border-black pb-8">
        <h1 className="text-3xl font-black text-black uppercase tracking-tighter">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-slate-500 font-medium uppercase tracking-tight">
          System Status: Optimal | Role: {role.toUpperCase()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href || "#"}>
            <Card className="rounded-none border-slate-200 shadow-none hover:border-black transition-colors group cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-slate-50 text-slate-400 group-hover:text-black transition-colors">
                    <stat.icon size={20} />
                  </div>
                  <div className="text-[10px] font-bold text-black uppercase tracking-widest bg-slate-100 px-2 py-0.5">
                    {stat.trend}
                  </div>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-2xl font-black text-black uppercase tracking-tight">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {role === "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="rounded-none border-slate-200 shadow-none bg-slate-50">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-black uppercase tracking-tight">Create Venue</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Onboard a new event location</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger render={
                  <Button className="w-full bg-black text-white rounded-none hover:bg-slate-800 uppercase text-xs font-bold tracking-widest h-12">
                    Open Venue Form
                  </Button>
                } />
                <DialogContent className="max-w-2xl rounded-none border-2 border-black">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-black uppercase tracking-tight">New Venue Asset</DialogTitle>
                  </DialogHeader>
                  <VenueForm onSuccess={() => {}} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          
          <Card className="rounded-none border-slate-200 shadow-none bg-slate-50">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-black uppercase tracking-tight">Create Vendor</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Onboard a new professional service</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger render={
                  <Button className="w-full bg-black text-white rounded-none hover:bg-slate-800 uppercase text-xs font-bold tracking-widest h-12">
                    Open Vendor Form
                  </Button>
                } />
                <DialogContent className="rounded-none border-2 border-black max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-black uppercase tracking-tight">Onboard Vendor</DialogTitle>
                  </DialogHeader>
                  <VendorForm onSuccess={() => {}} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-none border-slate-200 shadow-none">
          <CardHeader className="border-b border-slate-50 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-black uppercase tracking-tight">
                  {role === "admin" ? "Recent Activity Ledger" : "Your Event Timeline"}
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase text-slate-400">
                  Latest system logs and status changes
                </CardDescription>
              </div>
              <Badge className="rounded-none bg-black text-white text-[8px] font-bold uppercase tracking-widest">
                Real-time
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                      {item}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-black uppercase tracking-tight">
                        {role === "admin" ? `System Notification #00${item}` : `Event Update #00${item}`}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Today | 14:2{item} PM
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    Processing
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-slate-200 shadow-none">
          <CardHeader className="border-b border-slate-50 pb-6">
            <CardTitle className="text-lg font-bold text-black uppercase tracking-tight">Security Alert</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Authorized personnel notification</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="p-6 bg-slate-50 border-l-4 border-black space-y-4">
              <div className="text-[10px] font-black text-black uppercase tracking-widest">Protocol Delta-6</div>
              <p className="text-xs font-bold text-slate-500 uppercase leading-relaxed tracking-tight">
                All system actions are being logged under the Hargeisa Pro security framework. Ensure all client data is handled with strict confidentiality.
              </p>
              
              <Dialog>
                <DialogTrigger render={
                  <Button variant="outline" className="w-full rounded-none border-black hover:bg-black hover:text-white transition-all uppercase text-[10px] font-bold tracking-widest h-10">
                    View Protocols
                  </Button>
                } />
                <DialogContent className="rounded-none border-2 border-black max-w-xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-black uppercase tracking-tight">System Protocols</DialogTitle>
                    <DialogDescription className="text-[10px] font-bold uppercase text-slate-400">Security and Operational Guidelines</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 pt-6">
                    <div className="flex gap-4">
                      <div className="p-3 bg-slate-100 text-black h-fit"><ShieldCheck size={24}/></div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest mb-1">Data Privacy</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-tight">All booking and payment data must be kept confidential and never shared with unauthorized third parties.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="p-3 bg-slate-100 text-black h-fit"><Lock size={24}/></div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest mb-1">Access Control</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-tight">Maintain unique credentials and report any suspicious activity to system administrators immediately.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="p-3 bg-slate-100 text-black h-fit"><Info size={24}/></div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest mb-1">Audit Logging</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-tight">Every action (create, update, delete) is time-stamped and associated with your user ID for accountability.</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
