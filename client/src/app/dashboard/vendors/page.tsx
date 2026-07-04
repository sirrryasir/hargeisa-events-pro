"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Building2, Music, Camera, Utensils, Paintbrush, Plus, Edit2, Trash2 } from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { VendorForm } from "@/components/vendor-form";
import { BookingForm } from "@/components/booking-form";
import api from "@/lib/api";
import { toast } from "sonner";

interface Vendor {
  _id: string;
  name: string;
  type: string;
  rating: number;
  projects: number;
  status: "available" | "busy";
  contactEmail?: string;
  contactPhone?: string;
  contactPerson?: string;
  description?: string;
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
  const isAdmin = session?.user?.role === "admin";
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);
  const [processingDeleteVendorId, setProcessingDeleteVendorId] = useState<string | null>(null);
  const [confirmDeleteVendor, setConfirmDeleteVendor] = useState<Vendor | null>(null);

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

  const handleDelete = async (vendor: Vendor) => {
    setProcessingDeleteVendorId(vendor._id);
    try {
      await api.delete(`/vendors/${vendor._id}`);
      toast.success(`${vendor.name} deleted successfully.`);
      fetchVendors();
    } catch (error: any) {
      console.error("Error deleting vendor", error);
      toast.error(error?.response?.data?.message || "Failed to delete vendor.");
    } finally {
      setProcessingDeleteVendorId(null);
      setConfirmDeleteVendor(null);
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
        {session?.user?.role === "admin" && (
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
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-50 text-slate-400 group-hover:text-black transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Dialog open={editingVendorId === vendor._id} onOpenChange={(isOpen) => setEditingVendorId(isOpen ? vendor._id : null)}>
                        <DialogTrigger render={
                          <button className="p-2 text-slate-400 hover:text-black transition-colors rounded-none hover:bg-slate-50">
                            <Edit2 className="h-4 w-4" />
                          </button>
                        } />
                        <DialogContent className="rounded-none border-2 border-black max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-black uppercase tracking-tight">Edit Vendor</DialogTitle>
                            <DialogDescription className="text-xs font-bold uppercase text-slate-400">
                              Update service provider details.
                            </DialogDescription>
                          </DialogHeader>
                          <VendorForm 
                            initialData={vendor}
                            onSuccess={() => {
                              setEditingVendorId(null);
                              fetchVendors();
                            }} 
                          />
                        </DialogContent>
                      </Dialog>

                      <button 
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-none hover:bg-red-50"
                        onClick={() => setConfirmDeleteVendor(vendor)}
                        disabled={processingDeleteVendorId === vendor._id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
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

                {session?.user?.role === "customer" && (
                  <Dialog>
                    <DialogTrigger render={
                      <Button 
                        className="w-full mt-6 rounded-none bg-black text-white hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest transition-all"
                      >
                        Book Service
                      </Button>
                    } />
                    <DialogContent className="rounded-none border-2 border-black max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-black text-black uppercase tracking-tight">Service Request</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold uppercase text-slate-400">Requesting {vendor.name} for your event.</DialogDescription>
                      </DialogHeader>
                      <BookingForm 
                        targetType="vendor"
                        initialTargetId={vendor._id}
                        initialTargetName={vendor.name}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!confirmDeleteVendor} onOpenChange={(open) => !open && setConfirmDeleteVendor(null)}>
        <DialogContent className="rounded-none border-2 border-black max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-black uppercase tracking-tight">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Are you sure you want to delete <span className="font-bold text-black">{confirmDeleteVendor?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteVendor(null)}
              className="rounded-none font-bold uppercase tracking-widest text-[10px]"
              disabled={!!processingDeleteVendorId}
            >
              Cancel
            </Button>
            <Button
              onClick={() => confirmDeleteVendor && handleDelete(confirmDeleteVendor)}
              disabled={!!processingDeleteVendorId}
              className="rounded-none bg-red-600 text-white hover:bg-red-700 font-bold uppercase tracking-widest text-[10px]"
            >
              {processingDeleteVendorId ? "Deleting..." : "Delete Vendor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {session?.user?.role === "admin" && (
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
