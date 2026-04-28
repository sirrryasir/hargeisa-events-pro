"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Users, Building2, Calendar } from "lucide-react";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { Booking, Payment } from "@/lib/types";
import { exportToCSV } from "@/lib/export";

export default function ReportsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeVenues: 0,
    pendingRequests: 0,
    averageRating: 0,
    monthlyData: [] as { month: string; value: number }[],
  });

  useEffect(() => {
    if (!session) return;
    if (session.user?.role === "customer") {
      router.replace("/dashboard");
      return;
    }
    
    const fetchStats = async () => {
      try {
        const [bookingsRes, venuesRes, paymentsRes] = await Promise.all([
          api.get("/bookings"),
          api.get("/venues"),
          api.get("/payments")
        ]);

        const paymentsData = paymentsRes.data.data as Payment[];
        const bookingsData = bookingsRes.data.data as Booking[];
        const venuesData = venuesRes.data.data;
        setPayments(paymentsData);
        setBookings(bookingsData);

        const now = new Date();
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const monthlyData = Array.from({ length: 6 }).map((_, idx) => {
          const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
          const month = d.getMonth();
          const year = d.getFullYear();
          const value = paymentsData
            .filter((p) => p.status === "paid")
            .filter((p) => {
              const pd = new Date(p.paymentDate);
              return pd.getMonth() === month && pd.getFullYear() === year;
            })
            .reduce((sum, p) => sum + p.amount, 0);
          return { month: monthNames[month], value };
        });
        
        setStats(prev => ({
          ...prev,
          totalRevenue: paymentsData.filter((p: Payment) => p.status === "paid").reduce((sum: number, p: Payment) => sum + p.amount, 0),
          totalBookings: bookingsData.length,
          activeVenues: venuesData.length,
          pendingRequests: bookingsData.filter((b: Booking) => b.status === "pending").length,
          averageRating: bookingsData.filter((b: Booking) => b.rating).length > 0 
            ? bookingsData.filter((b: Booking) => b.rating).reduce((sum: number, b: Booking) => sum + (b.rating || 0), 0) / bookingsData.filter((b: Booking) => b.rating).length 
            : 4.8,
          monthlyData,
        }));
      } catch (error) {
        console.error("Error fetching report stats:", error);
      }
    };
    fetchStats();
  }, [session, router]);

  const popularVenues = Object.entries(
    bookings.reduce<Record<string, number>>((acc, b) => {
      const name = b.venue?.name || "Unknown Venue";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const peakMonthValue = Math.max(...stats.monthlyData.map((m) => m.value), 1);
  const revenueByVenue = Object.entries(
    payments
      .filter((p) => p.status === "paid")
      .reduce<Record<string, number>>((acc, p) => {
        acc[p.venueName] = (acc[p.venueName] || 0) + p.amount;
        return acc;
      }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-black pb-8">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tighter">Operational Analytics</h1>
          <p className="mt-1 text-sm text-slate-500 font-medium uppercase tracking-tight">
            Executive Performance Metrics & Market Intelligence
          </p>
        </div>
        <Button 
          onClick={() => exportToCSV([stats] as unknown as Record<string, unknown>[], "financial-report")}
          variant="outline" 
          className="rounded-none border-black hover:bg-black hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest px-6 h-12"
        >
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* High-Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Gross Revenue", value: `$${stats.totalRevenue}`, icon: TrendingUp, trend: "Live" },
          { label: "Total Volume", value: stats.totalBookings, icon: Calendar, trend: "Live" },
          { label: "Asset Density", value: stats.activeVenues, icon: Building2, trend: "Live" },
          { label: "Client Satisfaction", value: `${stats.averageRating.toFixed(1)}/5`, icon: Users, trend: "Live" },
        ].map((kpi, i) => (
          <Card key={i} className="rounded-none border-slate-200 shadow-none hover:border-black transition-colors group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-slate-50 text-slate-400 group-hover:text-black transition-colors">
                  <kpi.icon size={20} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-black">
                  {kpi.trend}
                </div>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</div>
              <div className="text-2xl font-black text-black uppercase tracking-tight">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-none border-slate-200 shadow-none">
          <CardHeader className="border-b border-slate-50 pb-6">
            <CardTitle className="text-lg font-bold text-black uppercase tracking-tight">Revenue Velocity</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Monthly Fiscal Performance (USD)</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="h-[300px] flex items-end justify-between gap-2 px-4">
              {stats.monthlyData.map((data, i) => {
                const height = (data.value / peakMonthValue) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group">
                    <div 
                      className="w-full bg-slate-100 group-hover:bg-black transition-all duration-300 relative"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                        ${data.value}
                      </div>
                    </div>
                    <div className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.month}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-slate-200 shadow-none">
          <CardHeader className="border-b border-slate-50 pb-6">
            <CardTitle className="text-lg font-bold text-black uppercase tracking-tight">Popular Venues</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Most requested venues by bookings</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {popularVenues.length === 0 && (
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                No booking data available
              </div>
            )}
            {popularVenues.map(([name, count], i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-500">{name}</span>
                  <span className="text-black">{count} Bookings</span>
                </div>
                <div className="h-1.5 w-full bg-slate-50">
                  <div className="h-full bg-black" style={{ width: `${Math.min((count / Math.max(popularVenues[0]?.[1] || 1, 1)) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-none border-slate-200 shadow-none">
        <CardHeader className="border-b border-slate-50 pb-6">
          <CardTitle className="text-lg font-bold text-black uppercase tracking-tight">Income by Venue</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Paid income totals from transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-black">Venue</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-black">Paid Income</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-black text-right">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {revenueByVenue.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    No payment data available
                  </td>
                </tr>
              )}
              {revenueByVenue.map(([name, total], i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-black uppercase tracking-tight">{name}</td>
                  <td className="px-6 py-4 text-xs font-bold text-black tabular-nums">${total}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-[8px] font-black px-2 py-0.5 uppercase tracking-widest ${
                      i === 0 ? 'bg-black text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {i === 0 ? "TOP" : "ACTIVE"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
