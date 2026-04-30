"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { Venue } from "@/lib/types";

const bookingSchema = z.object({
  venue: z.string().min(1, "Please select a venue"),
  clientName: z.string().min(2, "Client name is required"),
  clientPhone: z.string().min(7, "Valid phone number is required"),
  eventType: z.string().min(1, "Please select an event type"),
  eventDate: z.string().min(1, "Event date is required"),
  guestCount: z.number().min(1, "Minimum 1 guest"),
  notes: z.string().optional(),
});

interface BookingFormProps {
  onSuccess?: () => void;
  initialVenueId?: string;
  initialVenueName?: string;
}

export function BookingForm({ onSuccess, initialVenueId, initialVenueName }: BookingFormProps) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await api.get("/venues");
        setVenues(res.data.data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, []);

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      venue: initialVenueId || "",
      clientName: "",
      clientPhone: "",
      eventType: "",
      eventDate: "",
      guestCount: 0,
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof bookingSchema>) {
    setIsSubmitting(true);
    try {
      await api.post("/bookings", values);
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-6">
          {initialVenueId ? (
            <FormItem>
              <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black">Target Venue</FormLabel>
              <FormControl>
                <Input 
                  value={initialVenueName} 
                  readOnly 
                  className="rounded-none border-slate-200 bg-slate-50 text-slate-500 font-bold h-12 cursor-not-allowed" 
                />
              </FormControl>
            </FormItem>
          ) : (
            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black">Target Venue</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-slate-200 focus:border-black font-bold h-12">
                        <SelectValue placeholder="Select a venue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none border-2 border-black">
                      {venues.map((venue) => (
                        <SelectItem key={venue._id} value={venue._id}>
                          {venue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px] font-bold uppercase" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black">Event Classification</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-none border-slate-200 focus:border-black font-bold h-12">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-none border-2 border-black">
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[10px] font-bold uppercase" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black">Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Amina Abdi" className="rounded-none border-slate-200 focus:border-black font-bold h-12" {...field} />
                </FormControl>
                <FormMessage className="text-[10px] font-bold uppercase" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clientPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+252 63..." className="rounded-none border-slate-200 focus:border-black font-bold h-12" {...field} />
                </FormControl>
                <FormMessage className="text-[10px] font-bold uppercase" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black">Event Date</FormLabel>
                <FormControl>
                  <Input type="date" className="rounded-none border-slate-200 focus:border-black font-bold h-12" {...field} />
                </FormControl>
                <FormMessage className="text-[10px] font-bold uppercase" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guestCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black">Guest Count</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0"
                    className="rounded-none border-slate-200 focus:border-black font-bold h-12"
                    {...field} 
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
                <FormMessage className="text-[10px] font-bold uppercase" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black">Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Special requirements..." className="rounded-none border-slate-200 focus:border-black font-bold h-12" {...field} />
              </FormControl>
              <FormMessage className="text-[10px] font-bold uppercase" />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full rounded-none bg-black text-white h-12 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-none" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Create Booking Request"}
        </Button>
      </form>
    </Form>
  );
}
