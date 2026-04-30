"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Building2, Music, Camera, Utensils, Paintbrush, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VendorForm } from "@/components/vendor-form";
import api from "@/lib/api";

interface Vendor {
  _id: string;
  name: string;
  type: string;
  rating: number;
  projects: number;
  status: "available" | "busy";
}

const getVendorIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "decoration": return Paintbrush;
    case "catering": return Utensils;
    case "sound system": return Music;
    case "photography": return Camera;
    default: return Building2;
  }
};

export default function VendorsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchVendors = async () => {
    try {
      const res = await api.get("/vendors");
      setVendors(res.data.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchVendors();
    }
  }, [session]);

  if (isLoading) return <div className="p-12 text-center font-bold text-black uppercase tracking-widest">Scanning Directory...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-black pb-6">
        <div>
          <h1 className="text-3xl font-bold text-black uppercase tracking-tighter">Vendor Directory</h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Professional service providers for Hargeisa events.
          </p>
        </div>
        {session?.user?.role !== "customer" && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger render={
              <Button className="bg-black text-white rounded-none hover:bg-slate-800 uppercase text-xs font-bold tracking-widest gap-2 h-12 px-6">
                <Plus className="h-4 w-4" />
                Apply to Directory
              </Button>
            } />
            <DialogContent className="rounded-none border-2 border-black max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-black uppercase tracking-tight">Onboard Vendor</DialogTitle>
                <DialogDescription className="text-xs font-bold uppercase text-slate-400">
                  Register a new professional service provider.
                </DialogDescription>
              </DialogHeader>
              <VendorForm onSuccess={() => {
                setIsFormOpen(false);
                fetchVendors();
              }} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vendors.map((vendor) => {
          const Icon = getVendorIcon(vendor.type);
          return (
            <Card key={vendor._id} className="rounded-none border-slate-200 hover:border-black transition-colors group shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="p-2 bg-slate-50 text-slate-400 group-hover:text-black transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <Badge className={`rounded-none text-[9px] uppercase font-bold tracking-widest ${
                  vendor.status === "available" ? "bg-black text-white" : "bg-slate-100 text-slate-400"
                }`}>
                  {vendor.status}
                </Badge>
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle className="text-lg font-bold text-black uppercase tracking-tight">{vendor.name}</CardTitle>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">{vendor.type}</div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Rating</div>
                    <div className="text-sm font-bold text-black">★ {vendor.rating}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Projects</div>
                    <div className="text-sm font-bold text-black">{vendor.projects}</div>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger render={
                    <Button 
                      className="w-full mt-6 rounded-none bg-black text-white hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                      Book Service
                    </Button>
                  } />
                  <DialogContent className="rounded-none border-2 border-black max-w-sm">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black text-black uppercase tracking-tight">Service Request</DialogTitle>
                      <DialogDescription className="text-[10px] font-bold uppercase text-slate-400">Requesting {vendor.name} for your event.</DialogDescription>
                    </DialogHeader>
                    <div className="py-6 text-center">
                      <div className="w-16 h-16 bg-slate-50 border-2 border-black flex items-center justify-center mx-auto mb-4">
                        <Icon size={32} />
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-tight mb-6">A notification will be sent to this vendor to contact you regarding availability.</p>
                      <Button 
                        onClick={() => {
                          alert(`Request sent to ${vendor.name}`);
                        }}
                        className="w-full rounded-none bg-black text-white h-12 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800"
                      >
                        Confirm Request
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {session?.user?.role !== "customer" && (
        <div className="mt-12 p-12 border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-slate-50 flex items-center justify-center text-slate-200 mb-4">
            <Building2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-black uppercase tracking-tight">Vendor Onboarding</h3>
          <p className="text-slate-500 max-w-sm mt-2 mb-8 text-sm font-medium">
            Expand your business reach within the Hargeisa Pro professional event ecosystem.
          </p>
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="bg-black text-white rounded-none hover:bg-slate-800 uppercase text-xs font-bold tracking-widest"
          >
            Apply to Directory
          </Button>
        </div>
      )}
    </div>
  );
}
