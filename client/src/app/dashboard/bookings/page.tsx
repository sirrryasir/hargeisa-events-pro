"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components/booking-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { Booking } from "@/lib/types";
import { exportToCSV } from "@/lib/export";
import { Download } from "lucide-react";

export default function BookingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      if (session.user?.role === "customer") {
        router.replace("/dashboard/my-bookings");
        return;
      }
      fetchBookings();
    }
  }, [session, router]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/bookings/${id}`, { status: newStatus });
      fetchBookings();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.eventType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-12 text-center font-bold text-black uppercase tracking-widest">Accessing Ledger...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-black pb-8">
        <div>
          <h1 className="text-3xl font-bold text-black uppercase tracking-tighter">Bookings</h1>
          <p className="mt-1 text-sm text-slate-500 font-medium uppercase tracking-tight">
            Comprehensive Event Reservation Ledger
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => exportToCSV(bookings as unknown as Record<string, unknown>[], "bookings-ledger")}
            variant="outline" 
            className="rounded-none border-black hover:bg-black hover:text-white transition-all uppercase text-xs font-bold tracking-widest h-12 px-6"
          >
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Dialog>
            <DialogTrigger render={
              <Button className="bg-black text-white rounded-none hover:bg-slate-800 uppercase text-xs font-bold tracking-widest gap-2 h-12 px-6">
                <Plus className="h-4 w-4" />
                New Booking
              </Button>
            } />
            <DialogContent className="max-w-2xl rounded-none border-2 border-black">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-black uppercase tracking-tight">Create Booking</DialogTitle>
                <DialogDescription className="text-xs font-bold uppercase text-slate-400">
                  New reservation entry for the Hargeisa events pipeline.
                </DialogDescription>
              </DialogHeader>
              <BookingForm onSuccess={fetchBookings} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="SEARCH LEDGER..." 
            className="pl-10 rounded-none border-slate-200 focus-visible:ring-black h-12 uppercase text-[10px] font-bold tracking-widest"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-none border border-slate-200 bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-slate-200 hover:bg-transparent">
              <TableHead className="pl-6 font-bold text-black uppercase text-[10px] tracking-widest py-4">Client Identifier</TableHead>
              <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest">Venue Asset</TableHead>
              <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest">Type</TableHead>
              <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest">Date</TableHead>
              <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest">Status</TableHead>
              <TableHead className="pr-6 text-right font-bold text-black uppercase text-[10px] tracking-widest">Operations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking._id} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                <TableCell className="pl-6 font-bold text-black py-4">
                  {booking.clientName}
                </TableCell>
                <TableCell className="font-medium text-slate-600">{booking.venue?.name || "N/A"}</TableCell>
                <TableCell className="capitalize text-slate-500 font-medium">{booking.eventType}</TableCell>
                <TableCell className="tabular-nums font-medium text-slate-600">
                  {new Date(booking.eventDate).toLocaleDateString('en-GB')}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`rounded-none px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                      booking.status === "confirmed" ? "bg-black text-white" : 
                      booking.status === "rejected" ? "bg-red-500 text-white" :
                      "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                  >
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Select 
                    onValueChange={(val: string | null) => val && handleStatusUpdate(booking._id, val)}
                    value={booking.status}
                  >
                    <SelectTrigger className="w-[100px] h-8 rounded-none border-black text-[9px] font-bold uppercase">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-black">
                      <SelectItem value="pending" className="text-[9px] font-bold uppercase">Pending</SelectItem>
                      <SelectItem value="confirmed" className="text-[9px] font-bold uppercase">Confirm</SelectItem>
                      <SelectItem value="rejected" className="text-[9px] font-bold uppercase">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
