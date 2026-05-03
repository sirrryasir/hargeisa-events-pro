"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, Save, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        setFormData(prev => ({
          ...prev,
          name: res.data.data.name,
          email: res.data.data.email
        }));
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast.error("Could not load profile settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setIsSaving(true);
    try {
      await api.patch("/auth/profile", {
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined
      });
      toast.success("Profile updated successfully");
      setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-12 text-center font-bold text-black uppercase tracking-widest">Accessing Secure Vault...</div>;

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="border-b border-black pb-8">
        <h1 className="text-3xl font-black text-black uppercase tracking-tighter">Security & Identity</h1>
        <p className="mt-1 text-sm text-slate-500 font-medium uppercase tracking-tight">
          Manage your professional credentials and account access
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <Card className="rounded-none border-slate-200 shadow-none">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</Label>
              <div className="relative">
                <Input 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="rounded-none border-slate-200 focus:border-black pl-10 h-12 text-xs font-bold"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</Label>
              <div className="relative">
                <Input 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="rounded-none border-slate-200 focus:border-black pl-10 h-12 text-xs font-bold"
                  type="email"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-slate-200 shadow-none">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} /> Authentication
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Leave blank to keep current password</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">New Password</Label>
                <div className="relative">
                  <Input 
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="rounded-none border-slate-200 focus:border-black pl-10 h-12 text-xs font-bold"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Confirm Password</Label>
                <div className="relative">
                  <Input 
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    className="rounded-none border-slate-200 focus:border-black pl-10 h-12 text-xs font-bold"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          disabled={isSaving}
          className="rounded-none bg-black text-white h-14 px-8 uppercase text-xs font-black tracking-widest hover:bg-slate-800 disabled:opacity-50"
        >
          {isSaving ? "Synchronizing..." : "Update Credentials"}
        </Button>
      </form>
    </div>
  );
}
