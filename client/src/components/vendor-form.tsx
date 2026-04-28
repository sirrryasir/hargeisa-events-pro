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

const vendorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().min(1, "Category is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  phone: z.string().min(7, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  description: z.string().optional(),
});

interface VendorFormProps {
  onSuccess?: () => void;
}

export function VendorForm({ onSuccess }: VendorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: "",
      category: "",
      contactPerson: "",
      phone: "",
      email: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof vendorSchema>) {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await api.post("/vendors", {
        name: values.name,
        type: values.category,
        contactEmail: values.email,
        contactPhone: values.phone,
      });
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating vendor:", error);
      setSubmitError("Failed to submit vendor application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        {submitError && (
          <div className="border border-red-200 bg-red-50 p-3 text-[10px] font-bold uppercase tracking-widest text-red-600">
            {submitError}
          </div>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black">Company Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Hargeisa Sounds" className="rounded-none border-slate-200 focus:border-black font-bold h-12" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black">Service Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-none border-slate-200 focus:border-black font-bold h-12">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-none border-2 border-black">
                    <SelectItem value="sounds">Sound System</SelectItem>
                    <SelectItem value="decor">Decoration</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black">Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" className="rounded-none border-slate-200 focus:border-black font-bold h-12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+252 63..." className="rounded-none border-slate-200 focus:border-black font-bold h-12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black">Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="vendor@example.com" className="rounded-none border-slate-200 focus:border-black font-bold h-12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black">Service Description</FormLabel>
              <FormControl>
                <Input placeholder="What do you offer?" className="rounded-none border-slate-200 focus:border-black font-bold h-12" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full rounded-none bg-black text-white h-12 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  );
}
