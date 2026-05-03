"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, MapPin, Star, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

interface Vendor {
  _id: string;
  name: string;
  type: string;
  description: string;
  contactPhone: string;
}

export default function VendorsCatalogPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get("/vendors");
        setVendors(res.data.data);
      } catch (error) {
        console.error("Failed to fetch vendors", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendors();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PublicHeader />

      <main className="flex-1 py-12 px-6 max-w-7xl mx-auto w-full">
        <div className="mb-12 border-b border-black pb-8">
          <h1 className="text-5xl font-black text-black uppercase tracking-tighter mb-2">Our Vendor Network</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Premium service providers for every event scale.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[400px] bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendors.map((vendor) => (
              <Card key={vendor._id} className="rounded-none border-slate-200 overflow-hidden group hover:border-black transition-all">
                <CardHeader className="p-0">
                  <div className="h-48 bg-black flex items-center justify-center relative overflow-hidden">
                    <Users className="h-16 w-16 text-white/20 group-hover:scale-110 transition-transform duration-500" />
                    <Badge className="absolute top-4 left-4 rounded-none bg-white text-black hover:bg-white uppercase text-[10px] font-bold tracking-widest border-none">
                      {vendor.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-black uppercase tracking-tight">{vendor.name}</h3>
                  </div>
                  <p className="text-slate-500 text-xs font-medium line-clamp-2 uppercase tracking-tight mb-6">
                    {vendor.description || "A professional event service provider specializing in " + vendor.type + "."}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Tag className="h-3 w-3 text-black" />
                      Category: {vendor.type}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Link href={`/vendors/${vendor._id}`} className="w-full">
                    <Button className="w-full rounded-none bg-black text-white hover:bg-slate-800 uppercase text-[10px] font-bold tracking-widest h-12 gap-2">
                      View Profile <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && vendors.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No vendors found in the directory.</p>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
