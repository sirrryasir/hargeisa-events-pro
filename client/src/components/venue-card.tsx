import { Building2, Users, MapPin, Phone, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookingForm } from "@/components/booking-form";
import { useState } from "react";

interface Venue {
  _id: string;
  name: string;
  type: string;
  address: string;
  capacity: number;
  pricePerDay: number;
  amenities: string[];
  imageUrl?: string;
  contactPhone: string;
}

export function VenueCard({ venue }: { venue: Venue }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-none transition-all duration-200 hover:border-black group">
      <div className="aspect-[16/9] w-full bg-slate-50 relative overflow-hidden border-b border-slate-100">
        {venue.imageUrl ? (
          <Image
            src={venue.imageUrl}
            alt={venue.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-200 group-hover:text-black transition-colors">
            <Building2 size={48} strokeWidth={1} />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge className="bg-black text-white rounded-none border-none shadow-none uppercase text-[9px] font-bold tracking-widest">
            {venue.type}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold text-black uppercase tracking-tight mb-0">
            {venue.name}
          </h3>
          <div className="text-right">
            <div className="text-sm font-bold text-black">${venue.pricePerDay}</div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Per Day</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
            <MapPin className="h-4 w-4 text-slate-300 group-hover:text-black transition-colors" />
            {venue.address}
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
            <Users className="h-4 w-4 text-slate-300 group-hover:text-black transition-colors" />
            {venue.capacity} GUESTS
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
            <Phone className="h-4 w-4 text-slate-300 group-hover:text-black transition-colors" />
            {venue.contactPhone}
          </div>
        </div>
        {venue.amenities?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {venue.amenities.slice(0, 4).map((amenity) => (
              <Badge
                key={amenity}
                className="rounded-none border border-slate-200 bg-white text-[8px] font-bold uppercase tracking-widest text-slate-500"
              >
                {amenity}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-8 pt-6 border-t border-slate-100">
          <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
            <DialogTrigger render={
              <button className="flex-1 bg-black text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">
                Book Now
              </button>
            } />
            <DialogContent className="max-w-2xl rounded-none border-2 border-black">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-black uppercase tracking-tight">Direct Reservation</DialogTitle>
                <DialogDescription className="text-[10px] font-bold uppercase text-slate-400">Secure your date for {venue.name} immediately.</DialogDescription>
              </DialogHeader>
              <BookingForm 
                initialVenueId={venue._id} 
                initialVenueName={venue.name}
                onSuccess={() => setIsBookingOpen(false)} 
              />
            </DialogContent>
          </Dialog>
          
          <Link 
            href="/dashboard/calendar"
            className="flex-1 border border-black text-black py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="h-3 w-3" />
            Availability
          </Link>
        </div>
      </div>
    </div>
  );
}
