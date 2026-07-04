"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VenueCard } from "@/components/venue-card";
import { VenueForm } from "@/components/venue-form";
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
import { Venue } from "@/lib/types";

export default function VenuesPage() {
  const { data: session } = useSession();
  const isCustomer = session?.user?.role === "customer";
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchVenues = async () => {
    try {
      const res = await api.get("/venues");
      setVenues(res.data.data);
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchVenues();
    }
  }, [session]);

  if (isLoading) return <div className="p-12 text-center font-bold text-black uppercase tracking-widest">Scanning Inventory...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-black pb-8">
        <div>
          <h1 className="text-3xl font-bold text-black uppercase tracking-tighter">Venue Inventory</h1>
          <p className="mt-1 text-sm text-slate-500 font-medium uppercase tracking-tight">
            Premium Hotels and Event Halls in Hargeisa.
          </p>
        </div>
        {session?.user?.role === "admin" && (
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger render={
              <Button className="bg-black text-white rounded-none hover:bg-slate-800 uppercase text-xs font-bold tracking-widest gap-2 h-12 px-8 transition-all">
                <Plus className="h-4 w-4" />
                Add Asset
              </Button>
            } />
            <DialogContent className="max-w-xl rounded-none border-2 border-black">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-black uppercase tracking-tight">Asset Registration</DialogTitle>
                <DialogDescription className="text-[10px] font-bold uppercase text-slate-400">Add a new premium venue to the Hargeisa Pro inventory.</DialogDescription>
              </DialogHeader>
              <VenueForm onSuccess={() => {
                fetchVenues();
                setIsAddOpen(false);
              }} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <VenueCard key={venue._id} venue={venue} onRefresh={fetchVenues} />
        ))}
      </div>
    </div>
  );
}
