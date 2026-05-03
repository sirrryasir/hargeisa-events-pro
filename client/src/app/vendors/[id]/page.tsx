"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Users, MapPin, Phone, ArrowLeft, CheckCircle2, Mail, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

interface Vendor {
  _id: string;
  name: string;
  email: string;
  type: string;
  description: string;
  contactPhone: string;
}

export default function VendorDetailsPage() {
  const params = useParams();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await api.get(`/vendors/${params.id}`);
        setVendor(res.data.data);
      } catch (error) {
        console.error("Failed to fetch vendor", error);
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

    if (params.id) {
      fetchVendor();
      fetchReviews();
    }
  }, [params.id]);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">Loading Vendor Profile...</div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Vendor Not Found</div>
        <Link href="/vendors">
          <Button variant="outline" className="rounded-none border-black uppercase text-[10px] font-bold tracking-widest">
            Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PublicHeader />

      <main className="flex-1 py-12 px-6 max-w-5xl mx-auto w-full">
        <div className="bg-white border border-slate-200 p-8 lg:p-12 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-12 mb-12 border-b border-slate-100 pb-12">
             <div className="w-40 h-40 bg-black flex items-center justify-center">
                <Users className="h-20 w-20 text-white" />
             </div>
             <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <Badge className="rounded-none bg-slate-100 text-black border-none hover:bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                    Verified Professional
                  </Badge>
                  {averageRating && (
                    <Badge variant="outline" className="rounded-none border-black text-black font-black flex items-center gap-1 text-[10px]">
                      <CheckCircle2 size={10} className="fill-black text-white" /> {averageRating}
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-black uppercase tracking-tighter mb-2">{vendor.name}</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{vendor.type} Expert</p>
             </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
             <div className="md:col-span-2 space-y-8">
                <div>
                   <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Info className="h-4 w-4" /> About the Professional
                   </h3>
                   <p className="text-slate-500 text-sm leading-relaxed font-medium uppercase tracking-tight">
                      {vendor.description || `${vendor.name} is a leading professional in the ${vendor.type} industry in Hargeisa. With a commitment to excellence and a track record of successful events, they provide top-tier services tailored to client needs.`}
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-slate-50 border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-black">Email</div>
                      <div className="text-xs font-bold text-black truncate">{vendor.email}</div>
                   </div>
                   <div className="p-6 bg-slate-50 border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-black">Phone</div>
                      <div className="text-xs font-bold text-black">{vendor.contactPhone || "Not provided"}</div>
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <div className="bg-black p-8 text-white">
                   <h3 className="text-xl font-black uppercase tracking-tight mb-4">Book Services</h3>
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">
                      Direct bookings for this vendor are handled through our specialized planning portal.
                   </p>
                   <Link href="/login" className="block">
                      <Button className="w-full rounded-none bg-white text-black hover:bg-slate-200 uppercase text-[10px] font-bold tracking-widest h-12">
                         Request Quote
                      </Button>
                   </Link>
                </div>
                
                <div className="p-6 border border-slate-200">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-black">Service Areas</h4>
                   <ul className="space-y-3">
                      {["Hargeisa Central", "Gacan Libaax", "Ibrahim Koodbuur"].map((area) => (
                        <li key={area} className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <CheckCircle2 className="h-3 w-3 text-black" /> {area}
                        </li>
                      ))}
                   </ul>
                </div>
             </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white border border-slate-200 p-8 lg:p-12">
          <div className="border-b border-slate-100 pb-8 mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-black text-black uppercase tracking-tighter">Client Feedback</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified testimonials from professionals</p>
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
                        Collaborated: {new Date(review.eventDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
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
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No feedback yet. Help others by sharing your experience!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
