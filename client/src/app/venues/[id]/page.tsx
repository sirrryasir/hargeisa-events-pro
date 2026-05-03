"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, MapPin, Users, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { Venue } from "@/lib/types";
import { useSession } from "next-auth/react";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export default function VenueDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);

  // Booking State
  const [eventDate, setEventDate] = useState("");
  const [occupiedDates, setOccupiedDates] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await api.get(`/venues/${params.id}`);
        setVenue(res.data.data);
      } catch (error) {
        console.error("Failed to fetch venue", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await api.get(`/bookings/reviews/${params.id}`);
        setReviews(res.data.data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      }
    };

    const fetchAvailability = async () => {
      try {
        const res = await api.get(`/bookings/availability/${params.id}`);
        setOccupiedDates(res.data.data);
      } catch (error) {
        console.error("Failed to fetch availability", error);
      }
    };

    if (params.id) {
      fetchVenue();
      fetchReviews();
      fetchAvailability();
    }
  }, [params.id]);

  const handleBookingRedirect = () => {
    if (!session) {
      router.push("/login");
    } else {
      router.push("/dashboard/calendar");
    }
  };

  const isDateOccupied = (dateStr: string) => {
    return occupiedDates.includes(dateStr);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <PublicHeader />
        <main className="flex-1 py-12 px-6 max-w-5xl mx-auto w-full">
          <div className="bg-white border border-slate-200 p-8 lg:p-12 mb-12">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="w-full lg:w-1/2 space-y-4">
                <Skeleton className="aspect-square w-full rounded-none" />
                <div className="grid grid-cols-4 gap-2">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-square w-full rounded-none" />)}
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6 py-8">
                <Skeleton className="h-12 w-3/4 rounded-none" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-1/2 rounded-none" />
                  <Skeleton className="h-4 w-1/3 rounded-none" />
                </div>
                <Skeleton className="h-24 w-full rounded-none" />
                <Skeleton className="h-16 w-full rounded-none" />
              </div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Venue Not Found</div>
        <Link href="/venues">
          <Button variant="outline" className="rounded-none border-black uppercase text-[10px] font-bold tracking-widest">
            Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const galleryImages = venue.images && venue.images.length > 0 
    ? venue.images 
    : [venue.imageUrl || "/venues/default.jpg"];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PublicHeader />

      <main className="flex-1 py-12 px-6 max-w-5xl mx-auto w-full">
        <div className="bg-white border border-slate-200 p-8 lg:p-12 mb-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-1/2">
              <div className="space-y-4">
                <div className="aspect-square bg-slate-100 border border-slate-200 relative overflow-hidden">
                  <img 
                    src={galleryImages[activeImage]?.startsWith("http") ? galleryImages[activeImage] : `http://localhost:5000${galleryImages[activeImage]}`} 
                    alt={venue.name} 
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                  />
                  <Badge className="absolute top-4 left-4 rounded-none bg-black text-white hover:bg-black uppercase text-[10px] font-bold tracking-widest z-10">
                    {venue.type}
                  </Badge>
                </div>
                
                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {galleryImages.map((img, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setActiveImage(idx)}
                        className={`aspect-square border-2 transition-all ${activeImage === idx ? "border-black" : "border-transparent opacity-50 hover:opacity-100"}`}
                      >
                        <img 
                          src={img?.startsWith("http") ? img : `http://localhost:5000${img}`} 
                          className="w-full h-full object-cover" 
                          alt={`${venue.name} view ${idx + 1}`} 
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl lg:text-5xl font-black text-black uppercase tracking-tighter">{venue.name}</h1>
                {averageRating && (
                  <Badge variant="outline" className="rounded-none border-black text-black font-black flex items-center gap-1">
                    <CheckCircle2 size={10} className="fill-black text-white" /> {averageRating}
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3 text-slate-500 text-sm font-medium uppercase tracking-widest">
                  <MapPin className="h-4 w-4 text-black" />
                  {venue.address}
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm font-medium uppercase tracking-widest">
                  <Users className="h-4 w-4 text-black" />
                  Capacity: {venue.capacity} Guests
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm font-medium uppercase tracking-widest">
                  <Phone className="h-4 w-4 text-black" />
                  {venue.contactPhone}
                </div>
              </div>

              <div className="mb-8 p-6 bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Base Price Rate</div>
                <div className="text-3xl font-black text-black">${venue.pricePerDay} <span className="text-sm font-medium text-slate-400">/ Day</span></div>
              </div>

              <div className="mb-8 space-y-4">
                <h3 className="text-sm font-bold text-black uppercase tracking-widest">Live Availability Checker</h3>
                <div className="flex flex-col gap-2">
                  <Input 
                    type="date" 
                    className="rounded-none border-black h-12 text-xs font-bold uppercase"
                    min={new Date().toISOString().split("T")[0]}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                  {eventDate && (
                    <div className={`text-[10px] font-bold uppercase tracking-widest p-2 border ${
                      isDateOccupied(eventDate) ? "bg-red-50 text-red-500 border-red-100" : "bg-green-50 text-green-600 border-green-100"
                    }`}>
                      {isDateOccupied(eventDate) ? "✖ Date already booked or pending" : "✔ Date is currently available"}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-4">Included Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.amenities.map((amenity, i) => (
                    <span key={i} className="bg-slate-100 px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleBookingRedirect}
                disabled={eventDate ? isDateOccupied(eventDate) : false}
                className="w-full h-16 rounded-none bg-black text-white hover:bg-slate-800 uppercase text-xs font-bold tracking-widest disabled:opacity-50"
              >
                {session ? "Initialize Request in Portal" : "Login to Request Booking"}
              </Button>

            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white border border-slate-200 p-8 lg:p-12">
          <div className="border-b border-slate-100 pb-8 mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-black text-black uppercase tracking-tighter">Customer Experiences</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified reviews from past events</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-black">{reviews.length}</div>
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Reviews</div>
            </div>
          </div>

          <div className="grid gap-8">
            {reviews.length > 0 ? (
              reviews.map((review, i) => (
                <div key={i} className="border-b border-slate-50 last:border-0 pb-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-xs font-black text-black uppercase tracking-tight">{review.clientName}</div>
                      <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        Event held: {new Date(review.eventDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <CheckCircle2 
                          key={star} 
                          size={12} 
                          className={star <= review.rating ? "fill-black text-white" : "text-slate-100"} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed italic font-medium">"{review.feedback}"</p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-slate-50">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
