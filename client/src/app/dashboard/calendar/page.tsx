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

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

import { BookingForm } from "@/components/booking-form";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CalendarPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const preSelectedVenueId = searchParams.get("venueId");
  const preSelectedVenueName = searchParams.get("venueName");
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [newBookingDate, setNewBookingDate] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/public");
      setBookings(res.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    if (!session) return;
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
      ...b,
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
                  <div 
                    key={day} 
                    onClick={() => {
                      if (dayBookings.length === 0 && session?.user?.role === "customer") {
                        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        setNewBookingDate(dateStr);
                      }
                    }}
                    className={`border-b border-r border-slate-100 p-2 hover:bg-slate-50 transition-colors ${
                      session?.user?.role === "customer" && dayBookings.length === 0 ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-300">{day}</span>
                    <div className="mt-2 space-y-1">
                      {dayBookings.map(b => (
                        <div 
                          key={b.id} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(b as unknown as Booking);
                          }}
                          className={`${b.color} text-[8px] text-white p-1 rounded-none truncate font-bold uppercase tracking-tight cursor-pointer hover:opacity-80 transition-opacity`} 
                          title={b.title}
                        >
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
                  <div 
                    key={`upcoming-${event.id}`} 
                    className="flex flex-col gap-2 border-b border-slate-50 pb-4 last:border-0 last:pb-0 cursor-pointer hover:bg-slate-50 p-2 transition-colors"
                    onClick={() => setSelectedBooking(event as unknown as Booking)}
                  >
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

      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="max-w-md rounded-none border-black">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-sm font-black uppercase tracking-tighter">Event Protocol Details</DialogTitle>
                <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  System ID: {selectedBooking?._id}
                </DialogDescription>
              </div>
              <Badge className={`rounded-none text-[8px] font-bold uppercase ${selectedBooking?.status === "confirmed" ? "bg-black text-white" : "bg-slate-100 text-slate-500"}`}>
                {selectedBooking?.status}
              </Badge>
            </div>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Client Name</span>
                <p className="text-xs font-bold text-black uppercase">{selectedBooking?.clientName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Client Email</span>
                <p className="text-xs font-bold text-black lowercase">{selectedBooking?.user?.email || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Venue Details</span>
                <p className="text-xs font-bold text-black uppercase">{selectedBooking?.venue?.name}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Event Date</span>
                <p className="text-xs font-bold text-black uppercase">
                  {selectedBooking ? new Date(selectedBooking.eventDate).toLocaleDateString() : ''}
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border border-slate-100">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Additional Requirements</span>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {selectedBooking?.notes || "No specialized requirements logged for this event entry."}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Financial Status</span>
                <span className="text-xs font-black text-black uppercase">
                  {selectedBooking?.status === 'confirmed' ? 'Payment Verified' : 'Awaiting Settlement'}
                </span>
              </div>
              <Button 
                onClick={() => setSelectedBooking(null)}
                className="rounded-none bg-black text-white hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest h-10 px-8"
              >
                Close Record
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!newBookingDate} onOpenChange={(open) => !open && setNewBookingDate(null)}>
        <DialogContent className="max-w-2xl rounded-none border-black">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-sm font-black uppercase tracking-tighter">Initialize New Event Request</DialogTitle>
            <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Date Lock: {newBookingDate}
            </DialogDescription>
          </DialogHeader>
          <BookingForm 
            initialDate={newBookingDate || undefined} 
            initialTargetId={preSelectedVenueId || undefined}
            initialTargetName={preSelectedVenueName || undefined}
            onSuccess={() => {
              setNewBookingDate(null);
              fetchBookings();
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CalendarPageWrapper() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold text-black uppercase tracking-widest">Loading Ledger...</div>}>
      <CalendarPage />
    </Suspense>
  );
}
