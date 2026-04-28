"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { Booking } from "@/lib/types";
import { exportToCSV } from "@/lib/export";
import { Download } from "lucide-react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function CalendarPage() {
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!session) return;

    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings");
        setBookings(res.data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
    const intervalId = setInterval(fetchBookings, 15000);

    return () => clearInterval(intervalId);
  }, [session]);

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Convert backend bookings to calendar events
  const calendarEvents = bookings.map(b => {
    const date = new Date(b.eventDate);
    return {
      id: b._id,
      title: `${b.clientName} (${b.venue?.name || 'N/A'})`,
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      status: b.status,
      color: b.status === "confirmed" ? "bg-black" : "bg-slate-400"
    };
  }).filter(e => e.month === currentDate.getMonth() && e.year === currentDate.getFullYear());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-black pb-6">
        <div>
          <h1 className="text-3xl font-bold text-black uppercase tracking-tighter">Calendar</h1>
          <p className="mt-1 text-sm text-slate-500 font-medium uppercase tracking-tight">
            Professional Venue Availability Ledger
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-none border-black hover:bg-black hover:text-white transition-all" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="w-40 text-center font-bold text-black uppercase tracking-widest text-sm">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <Button variant="outline" size="icon" className="rounded-none border-black hover:bg-black hover:text-white transition-all" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => exportToCSV(bookings as unknown as Record<string, unknown>[], "calendar-bookings")}
            variant="outline" 
            className="rounded-none border-black hover:bg-black hover:text-white transition-all uppercase text-[10px] font-bold tracking-widest h-10 px-4 ml-2"
          >
            <Download className="h-3 w-3 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3 rounded-none border-slate-200 shadow-none">
          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b border-slate-200">
              {days.map(day => (
                <div key={day} className="p-4 text-center text-[10px] font-bold text-black uppercase tracking-widest bg-slate-50">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 min-h-[600px]">
              {[...Array(firstDayOfMonth)].map((_, i) => (
                <div key={`empty-${i}`} className="border-b border-r border-slate-100 bg-slate-50/20" />
              ))}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const dayBookings = calendarEvents.filter(b => b.date === day);
                return (
                  <div key={day} className="border-b border-r border-slate-100 p-2 hover:bg-slate-50 transition-colors">
                    <span className="text-xs font-bold text-slate-300">{day}</span>
                    <div className="mt-2 space-y-1">
                      {dayBookings.map(b => (
                        <div key={b.id} className={`${b.color} text-[8px] text-white p-1 rounded-none truncate font-bold uppercase tracking-tight`} title={b.title}>
                          {b.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-none border-slate-200 shadow-none">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-black">Ledger Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-black" />
                <span className="text-[10px] font-bold uppercase text-slate-500">Confirmed</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-slate-400" />
                <span className="text-[10px] font-bold uppercase text-slate-500">Pending</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 border border-slate-200" />
                <span className="text-[10px] font-bold uppercase text-slate-500">Available</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-slate-200 shadow-none">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-black">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {calendarEvents.slice(0, 3).map(event => (
                  <div key={`upcoming-${event.id}`} className="flex flex-col gap-2 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Date: {event.date} {months[event.month]}</span>
                    <span className="text-xs font-bold text-black uppercase tracking-tight">{event.title}</span>
                    <Badge className={`w-fit rounded-none text-[8px] font-bold uppercase ${event.status === "confirmed" ? "bg-black text-white" : "bg-slate-100 text-slate-500"}`}>
                      {event.status}
                    </Badge>
                  </div>
                ))}
                {calendarEvents.length === 0 && (
                  <div className="text-xs font-medium text-slate-400">No events this month.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
