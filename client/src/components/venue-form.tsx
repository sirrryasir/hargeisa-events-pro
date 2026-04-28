"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
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

const venueSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.string().min(1, "Type is required").refine((val) => ["hotel", "hall"].includes(val), { message: "Invalid type" }),
  address: z.string().min(5, "Address is required"),
  capacity: z.number().min(10, "Minimum capacity 10"),
  pricePerDay: z.number().min(1, "Price is required"),
  imageUrl: z.string().optional(),
  amenities: z.string().optional(),
  contactPhone: z.string().min(7, "Contact phone is required"),
});

interface VenueFormProps {
  onSuccess?: () => void;
}

export function VenueForm({ onSuccess }: VenueFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof venueSchema>>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: "",
      type: "hotel",
      address: "",
      capacity: 100,
      pricePerDay: 500,
      imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2074&auto=format&fit=crop",
      amenities: "",
      contactPhone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof venueSchema>) {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        amenities: values.amenities
          ? values.amenities
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : [],
      };
      await api.post("/venues", payload);
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating venue:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Venue Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Mansoor Hotel" className="rounded-none border-slate-200 focus:border-black uppercase text-xs font-bold" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Asset Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-none border-slate-200 focus:border-black uppercase text-xs font-bold">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-none border-black">
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="hall">Event Hall</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Max Capacity</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    className="rounded-none border-slate-200 focus:border-black text-xs font-bold"
                    {...field} 
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Physical Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Independence Ave, Hargeisa" className="rounded-none border-slate-200 focus:border-black uppercase text-xs font-bold" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact Phone</FormLabel>
              <FormControl>
                <Input placeholder="e.g. +252 63..." className="rounded-none border-slate-200 focus:border-black text-xs font-bold" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Venue Photo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." className="rounded-none border-slate-200 focus:border-black text-xs font-bold" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Amenities (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="Parking, Catering, AC, Wi-Fi" className="rounded-none border-slate-200 focus:border-black text-xs font-bold" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pricePerDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Base Price (Per Day)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                  <Input 
                    type="number" 
                    className="pl-8 rounded-none border-slate-200 focus:border-black text-xs font-bold"
                    {...field} 
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-12 bg-black text-white rounded-none hover:bg-slate-800 uppercase text-xs font-bold tracking-widest mt-4" disabled={isSubmitting}>
          {isSubmitting ? "Adding to Inventory..." : "Register Venue Asset"}
        </Button>
      </form>
    </Form>
  );
}
