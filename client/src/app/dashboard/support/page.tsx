"use client";

import { HelpCircle, MessageSquare, Book, FileText, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-black pb-8">
        <h1 className="text-3xl font-black text-black uppercase tracking-tighter">Support Command Center</h1>
        <p className="mt-1 text-sm text-slate-500 font-medium uppercase tracking-tight">
          Assistance, Documentation, and Direct Communication Channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Knowledge Base", icon: Book, desc: "System Manuals" },
          { label: "Live Dispatch", icon: MessageSquare, desc: "Direct Support" },
          { label: "Bug Reporting", icon: FileText, desc: "Protocol Delta" },
          { label: "FAQ Ledger", icon: HelpCircle, desc: "Common Queries" },
        ].map((item, i) => (
          <Card key={i} className="rounded-none border-slate-200 shadow-none hover:border-black transition-colors group cursor-pointer">
            <CardContent className="p-6">
              <div className="mb-4 p-2 bg-slate-50 w-fit group-hover:bg-black group-hover:text-white transition-colors">
                <item.icon size={20} />
              </div>
              <div className="text-xs font-black text-black uppercase tracking-tight">{item.label}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-none border-slate-200 shadow-none">
          <CardHeader className="border-b border-slate-50 pb-6">
            <CardTitle className="text-lg font-bold text-black uppercase tracking-tight">Submit Assistance Request</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Direct transmission to support officers</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-widest">Subject Identifier</label>
              <Input placeholder="BRIEF TOPIC..." className="rounded-none border-slate-200 focus-visible:ring-black h-12 uppercase text-[10px] font-bold tracking-widest" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-black uppercase tracking-widest">Transmission Content</label>
              <textarea 
                className="w-full min-h-[150px] p-4 rounded-none border border-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black uppercase text-xs font-bold tracking-tight"
                placeholder="DETAILS OF YOUR REQUEST..."
              ></textarea>
            </div>
            <Button className="w-full rounded-none bg-black text-white h-12 text-xs font-black uppercase tracking-widest gap-2">
              <Send size={16} />
              Transmit Request
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-none border-slate-200 shadow-none">
            <CardHeader className="border-b border-slate-50 pb-6">
              <CardTitle className="text-lg font-bold text-black uppercase tracking-tight">Active Protocols</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase text-slate-400">System status and operational notes</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="divide-y divide-slate-50">
                {[
                  "Transmission latency within acceptable bounds.",
                  "Authorized access only to security settings.",
                  "System updates scheduled for Sunday 02:00 UTC.",
                ].map((note, i) => (
                  <div key={i} className="py-4 first:pt-0 last:pb-0 text-xs font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
                    • {note}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="p-8 bg-slate-50 border-l-4 border-black">
            <div className="text-xs font-black text-black uppercase tracking-widest mb-2">Emergency Hotline</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Immediate assistance for critical failures</p>
            <div className="text-2xl font-black text-black tabular-nums">+252 63 XXXXXXX</div>
          </div>
        </div>
      </div>
    </div>
  );
}
