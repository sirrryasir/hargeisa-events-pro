"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Calendar, FileText, Download, Building2, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { Booking } from "@/lib/types";
import { generateInvoicePDF } from "@/lib/pdf";

export default function MyBookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [ratingDraft, setRatingDraft] = useState<Record<string, number>>({});
  const [feedbackDraft, setFeedbackDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await api.get("/bookings");
        setBookings(res.data.data);
      } catch (error) {
        console.error("Error fetching my bookings:", error);
      }
    };
    if (session) fetchMyBookings();
  }, [session]);

  const handleDownloadInvoice = (booking: any) => {
    const paymentData = {
      transactionId: booking._id.slice(-8).toUpperCase(),
      clientName: booking.clientName,
      venueName: booking.venue?.name || "Service Reservation",
      amount: booking.venue?.pricePerDay || 0,
      type: booking.eventType,
      status: booking.status === 'confirmed' ? 'paid' : 'pending',
      paymentDate: booking.eventDate
    };
    generateInvoicePDF(paymentData);
  };

  const handleFeedbackSubmit = async (id: string) => {
    try {
      const rating = ratingDraft[id];
      const feedback = feedbackDraft[id] || "";
      if (!rating) return;
      await api.patch(`/bookings/${id}`, { rating, feedback });
      const res = await api.get("/bookings");
      setBookings(res.data.data);
      setRatingDraft((prev) => ({ ...prev, [id]: 0 }));
      setFeedbackDraft((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await api.patch(`/bookings/${id}`, { status: "cancelled" });
      const res = await api.get("/bookings");
      setBookings(res.data.data);
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-black pb-8">
        <h1 className="text-3xl font-black text-black uppercase tracking-tighter">My Reservations</h1>
        <p className="mt-1 text-sm text-slate-500 font-medium uppercase tracking-tight">
          Client Portal: Active Bookings & Documentation
        </p>
      </div>

      <div className="grid gap-6">
        {bookings.length > 0 ? (
          bookings.map((booking: Booking) => (
            <Card key={booking._id} className="rounded-none border-slate-200 shadow-none hover:border-black transition-colors">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 bg-slate-50 p-8 border-r border-slate-100 flex flex-col justify-center">
                    <Badge className={`w-fit rounded-none text-[8px] font-black uppercase tracking-widest mb-4 ${
                      booking.status === 'confirmed' ? 'bg-black text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {booking.status}
                    </Badge>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reservation ID</div>
                    <div className="text-xs font-black text-black tracking-widest uppercase truncate">#{booking._id.slice(-8)}</div>
                  </div>
                  
                  <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Building2 size={12} /> Target Asset
                      </div>
                      <div className="text-sm font-black text-black uppercase tracking-tight flex items-center gap-2">
                        {booking.venue ? (
                          <>
                            {booking.venue.name} <Badge className="text-[8px] bg-slate-100 text-slate-500 rounded-none uppercase">Venue</Badge>
                          </>
                        ) : booking.vendor ? (
                          <>
                            {booking.vendor.name} <Badge className="text-[8px] bg-slate-100 text-slate-500 rounded-none uppercase">Vendor</Badge>
                          </>
                        ) : "N/A"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Calendar size={12} /> Event Date
                      </div>
                      <div className="text-sm font-black text-black uppercase tracking-tight">
                        {new Date(booking.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      {booking.status === 'confirmed' && !booking.rating && (
                        <Dialog>
                          <DialogTrigger render={
                            <Button variant="outline" className="rounded-none border-black text-[10px] font-bold uppercase tracking-widest h-10 px-6 hover:bg-black hover:text-white transition-all">
                              <Star size={14} className="mr-2" /> Rate
                            </Button>
                          } />
                          <DialogContent className="max-w-md rounded-none border-2 border-black">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold uppercase">Customer Experience Feedback</DialogTitle>
                              <DialogDescription className="text-[10px] font-bold uppercase text-slate-400">Share your thoughts on {booking.venue?.name}.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex gap-2 justify-center">
                                {[1,2,3,4,5].map((star) => (
                                  <button 
                                    key={star} 
                                    onClick={() => setRatingDraft((prev) => ({ ...prev, [booking._id]: star }))}
                                    className="p-2 hover:scale-110 transition-transform"
                                  >
                                    <Star size={24} className={star <= (ratingDraft[booking._id] || 0) ? "fill-black" : "text-slate-200"} />
                                  </button>
                                ))}
                              </div>
                              <Textarea
                                placeholder="How was your experience?"
                                className="rounded-none border-slate-200 focus:border-black text-xs font-bold"
                                value={feedbackDraft[booking._id] || ""}
                                onChange={(e) => setFeedbackDraft((prev) => ({ ...prev, [booking._id]: e.target.value }))}
                              />
                            </div>
                            <DialogFooter>
                              <Button 
                                onClick={() => handleFeedbackSubmit(booking._id)}
                                className="rounded-none bg-black text-white hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest h-10 px-8"
                              >
                                Submit Review
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}

                      {booking.status === 'pending' && (
                        <Dialog>
                          <DialogTrigger render={
                            <Button variant="destructive" className="rounded-none text-[10px] font-bold uppercase tracking-widest h-10 px-6 bg-red-50 text-red-500 border-red-100 hover:bg-red-500 hover:text-white transition-all">
                              Cancel
                            </Button>
                          } />
                          <DialogContent className="max-w-md rounded-none border-2 border-black">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold uppercase">Confirm Cancellation</DialogTitle>
                              <DialogDescription className="text-[10px] font-bold uppercase text-slate-400">This action will remove your reservation request.</DialogDescription>
                            </DialogHeader>
                            <div className="py-6 text-center">
                              <p className="text-sm font-bold text-slate-600">Are you sure you want to cancel your booking for <span className="text-black uppercase">{booking.venue?.name || booking.vendor?.name}</span>?</p>
                            </div>
                            <DialogFooter className="flex gap-4">
                              <DialogClose render={<Button variant="outline" className="flex-1 rounded-none uppercase font-bold">Keep Booking</Button>} />
                              <Button 
                                onClick={() => handleCancelBooking(booking._id)}
                                variant="destructive"
                                className="flex-1 rounded-none bg-red-600 text-white hover:bg-red-700 text-[10px] font-bold uppercase tracking-widest h-10"
                              >
                                Yes, Cancel
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button 
                        variant="outline" 
                        className="rounded-none border-black text-[10px] font-bold uppercase tracking-widest h-10 px-6 hover:bg-black hover:text-white transition-all"
                      >
                        <FileText size={14} className="mr-2" /> Details
                      </Button>
                      <Button 
                        onClick={() => handleDownloadInvoice(booking)}
                        className="rounded-none bg-black text-white text-[10px] font-bold uppercase tracking-widest h-10 px-6 hover:bg-slate-800 transition-all"
                      >
                        <Download size={14} className="mr-2" /> Invoice
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-100">
            <Calendar className="mx-auto text-slate-200 mb-4" size={48} />
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Active Reservations Found</div>
          </div>
        )}
      </div>
    </div>
  );
}
