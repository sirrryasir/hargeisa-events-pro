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
  targetId: z.string().min(1, "Please select an asset"),
  clientName: z.string().min(2, "Client name is required"),
  clientPhone: z.string().min(7, "Valid phone number is required"),
  eventType: z.string().min(1, "Please select an event type"),
  eventDate: z.string().min(1, "Event date is required"),
  guestCount: z.number().min(1, "Minimum 1 guest"),
  notes: z.string().optional(),
});

interface BookingFormProps {
  onSuccess?: () => void;
  targetType?: "venue" | "vendor";
  initialTargetId?: string;
  initialTargetName?: string;
  initialDate?: string;
}

export function BookingForm({ onSuccess, targetType = "venue", initialTargetId, initialTargetName, initialDate }: BookingFormProps) {
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
      targetId: initialTargetId || "",
      clientName: "",
      clientPhone: "",
      eventType: "",
      eventDate: initialDate || "",
      guestCount: 0,
      notes: "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const selectedVenueId = form.watch("targetId");
  const selectedDate = form.watch("eventDate");

  useEffect(() => {
    const checkAvailability = async () => {
      if (targetType !== "venue" || !selectedVenueId || !selectedDate) {
        setIsAvailable(true);
        return;
      }

      setAvailabilityLoading(true);
      try {
        const res = await api.get(`/bookings/availability/${selectedVenueId}`);
        const occupiedDates = res.data.data;
        const isTaken = occupiedDates.includes(selectedDate);
        setIsAvailable(!isTaken);
        if (isTaken) {
          setError("This venue is already booked or has a pending request for the selected date");
        } else {
          setError(null);
        }
      } catch (err) {
        console.error("Availability check failed:", err);
      } finally {
        setAvailabilityLoading(false);
      }
    };

    const delayDebounce = setTimeout(checkAvailability, 500);
    return () => clearTimeout(delayDebounce);
  }, [selectedVenueId, selectedDate, targetType]);

  async function onSubmit(values: z.infer<typeof bookingSchema>) {
    if (!isAvailable) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: any = {
        clientName: values.clientName,
        clientPhone: values.clientPhone,
        eventType: values.eventType,
        eventDate: values.eventDate,
        guestCount: values.guestCount,
        notes: values.notes,
      };
      
      if (targetType === "venue") {
        payload.venue = values.targetId;
      } else {
        payload.vendor = values.targetId;
      }

      await api.post("/bookings", payload);
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to create booking. Please check for double-bookings.";
      setError(message);
      if (err.response?.status !== 400) {
        console.error("Error creating booking:", err);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-6">
          {initialTargetId ? (
            <FormItem>
              <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black">Target {targetType}</FormLabel>
              <FormControl>
                <Input 
                  value={initialTargetName || venues.find(v => v._id === initialTargetId)?.name || "Selected Asset"} 
                  readOnly 
                  className="rounded-none border-slate-200 bg-slate-50 text-slate-500 font-bold h-12 cursor-not-allowed" 
                />
              </FormControl>
            </FormItem>
          ) : (
            <FormField
              control={form.control}
              name="targetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black">Target Venue</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-slate-200 focus:border-black font-bold h-12">
                        <SelectValue placeholder="Select a venue">
                          {venues.find(v => v._id === field.value)?.name}
                        </SelectValue>
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

        {error && (
          <div className="bg-red-50 border border-red-100 p-3">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{error}</span>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full rounded-none bg-black text-white h-12 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-none disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={isSubmitting || !isAvailable || availabilityLoading}
        >
          {isSubmitting ? "Processing..." : availabilityLoading ? "Checking Availability..." : !isAvailable ? "Date Unavailable" : "Create Booking Request"}
        </Button>
      </form>
    </Form>
  );
}
