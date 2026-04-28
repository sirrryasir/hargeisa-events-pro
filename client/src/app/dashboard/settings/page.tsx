"use client";

import { useSession } from "next-auth/react";
import { User, Shield, Bell, Globe, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-8">
      <div className="border-b border-black pb-8">
        <h1 className="text-3xl font-black text-black uppercase tracking-tighter">System Configuration</h1>
        <p className="mt-1 text-sm text-slate-500 font-medium uppercase tracking-tight">
          Manage your account security and application preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 bg-black text-white flex items-center gap-3">
            <User size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Account Profile</span>
          </div>
          <div className="p-4 bg-slate-50 text-slate-400 flex items-center gap-3 hover:bg-slate-100 transition-colors cursor-pointer">
            <Shield size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Security & Keys</span>
          </div>
          <div className="p-4 bg-slate-50 text-slate-400 flex items-center gap-3 hover:bg-slate-100 transition-colors cursor-pointer">
            <Bell size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Notifications</span>
          </div>
          <div className="p-4 bg-slate-50 text-slate-400 flex items-center gap-3 hover:bg-slate-100 transition-colors cursor-pointer">
            <Globe size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Regional Settings</span>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-none border-slate-200 shadow-none">
            <CardHeader className="border-b border-slate-50 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-black uppercase tracking-tight">Personal Information</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Public profile and contact details</CardDescription>
                </div>
                <Badge className="rounded-none bg-black text-white text-[8px] font-black uppercase tracking-widest px-2">Verified</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest">Full Name</label>
                  <Input defaultValue={session?.user?.name || ""} className="rounded-none border-slate-200 focus-visible:ring-black h-12 uppercase text-xs font-bold tracking-tight" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest">Email Address</label>
                  <Input defaultValue={session?.user?.email || ""} className="rounded-none border-slate-200 focus-visible:ring-black h-12 text-xs font-bold tracking-tight" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest">Bio / Description</label>
                <textarea 
                  className="w-full min-h-[100px] p-4 rounded-none border border-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black uppercase text-xs font-bold tracking-tight"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-slate-200 shadow-none">
            <CardHeader className="border-b border-slate-50 pb-6">
              <CardTitle className="text-lg font-bold text-black uppercase tracking-tight">Security Protocol</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Access control and session management</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50">
                <div>
                  <div className="text-[10px] font-black text-black uppercase tracking-widest">Two-Factor Authentication</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Enhanced account security</div>
                </div>
                <Button variant="outline" className="rounded-none border-black h-8 text-[9px] font-black uppercase tracking-widest px-4 hover:bg-black hover:text-white transition-all">Enable</Button>
              </div>
              
              <div className="pt-4 border-t border-slate-50 flex justify-end">
                <Button className="rounded-none bg-black text-white h-12 px-8 text-xs font-black uppercase tracking-widest gap-2">
                  <Save size={16} />
                  Persist Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
