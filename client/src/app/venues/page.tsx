"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, MapPin, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { Venue } from "@/lib/types";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await api.get("/venues");
        setVenues(res.data.data);
      } catch (error) {
        console.error("Failed to fetch venues", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVenues();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PublicHeader />

      <main className="flex-1 py-12 px-6 max-w-7xl mx-auto w-full">
        <div className="mb-12 border-b border-black pb-8">
          <h1 className="text-4xl lg:text-5xl font-black text-black uppercase tracking-tighter">Premium Venues</h1>
          <p className="mt-2 text-slate-500 font-medium uppercase tracking-widest text-sm">
            Discover and book the finest event spaces in Somaliland.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 py-20">
            Loading Venues...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue) => (
              <Card key={venue._id} className="rounded-none border-slate-200 shadow-none hover:border-black transition-colors overflow-hidden flex flex-col">
                <div className="aspect-video relative bg-slate-100 border-b border-slate-100">
                  {venue.imageUrl ? (
                    <img 
                      src={venue.imageUrl.startsWith("http") ? venue.imageUrl : `http://localhost:5000${venue.imageUrl}`} 
                      alt={venue.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-slate-300" />
                    </div>
                  )}
                  <Badge className="absolute top-4 right-4 rounded-none bg-white text-black hover:bg-white uppercase text-[10px] font-bold tracking-widest">
                    {venue.type}
                  </Badge>
                </div>
                <CardHeader className="pb-4">
                  <h3 className="text-xl font-black text-black uppercase tracking-tight">{venue.name}</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-widest">
                    <MapPin className="h-3 w-3" />
                    {venue.address}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pb-6">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-black" />
                      <span className="text-xs font-bold text-black">{venue.capacity} <span className="text-slate-400">Max</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-black">${venue.pricePerDay} <span className="text-slate-400">/ Day</span></span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.slice(0, 3).map((amenity, i) => (
                      <span key={i} className="bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        {amenity}
                      </span>
                    ))}
                    {venue.amenities.length > 3 && (
                      <span className="bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        +{venue.amenities.length - 3} More
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-6 px-6">
                  <Link href={`/venues/${venue._id}`} className="w-full">
                    <Button className="w-full rounded-none bg-black text-white hover:bg-slate-800 uppercase text-[10px] font-bold tracking-widest h-12">
                      View Details & Book
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
