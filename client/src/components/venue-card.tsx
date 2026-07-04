import { Building2, Users, MapPin, Phone, Calendar, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { BookingForm } from "@/components/booking-form";
import { VenueForm } from "@/components/venue-form";
import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

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

export function VenueCard({ venue, onRefresh }: { venue: Venue; onRefresh?: () => void }) {
  const { data: session } = useSession();
  const isCustomer = !session || session?.user?.role === "customer";
  const isAdmin = session?.user?.role === "admin";
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/venues/${venue._id}`);
      toast.success(`${venue.name} deleted successfully.`);
      if (onRefresh) onRefresh();
    } catch (error: any) {
      console.error("Error deleting venue", error);
      toast.error(error?.response?.data?.message || "Failed to delete venue.");
    } finally {
      setIsDeleting(false);
      setIsConfirmDeleteOpen(false);
    }
  };

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
        
        {isAdmin && (
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger render={
                <button className="bg-white p-2 rounded-none shadow-sm hover:bg-slate-100 transition-colors">
                  <Edit2 className="h-4 w-4 text-black" />
                </button>
              } />
              <DialogContent className="max-w-xl rounded-none border-2 border-black">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-black uppercase tracking-tight">Edit Asset</DialogTitle>
                  <DialogDescription className="text-[10px] font-bold uppercase text-slate-400">Update details for {venue.name}.</DialogDescription>
                </DialogHeader>
                <VenueForm initialData={venue} onSuccess={() => {
                  if (onRefresh) onRefresh();
                  setIsEditOpen(false);
                }} />
              </DialogContent>
            </Dialog>

            <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
              <DialogTrigger render={
                <button 
                  className="bg-white p-2 rounded-none shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              } />
              <DialogContent className="rounded-none border-2 border-black max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-black uppercase tracking-tight">Confirm Deletion</DialogTitle>
                  <DialogDescription className="text-sm text-slate-500">
                    Are you sure you want to delete <span className="font-bold text-black">{venue.name}</span>? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsConfirmDeleteOpen(false)}
                    className="rounded-none font-bold uppercase tracking-widest text-[10px]"
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="rounded-none bg-red-600 text-white hover:bg-red-700 font-bold uppercase tracking-widest text-[10px]"
                  >
                    {isDeleting ? "Deleting..." : "Delete Venue"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        <div className="absolute top-4 right-4 z-10">
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
          {isCustomer && (
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
                  targetType="venue"
                  initialTargetId={venue._id} 
                  initialTargetName={venue.name}
                  onSuccess={() => setIsBookingOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          )}
          
          <Link 
            href={`/dashboard/calendar?venueId=${venue._id}&venueName=${encodeURIComponent(venue.name)}`}
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
