import Link from "next/link";
import { ArrowRight, Building2, Calendar, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between border-b border-black">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-black flex items-center justify-center">
            <Building2 className="text-white h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-black uppercase">
            HARGEISA<span className="text-slate-400">PRO</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/login" className="text-xs font-bold text-black uppercase tracking-widest border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all">Log In</Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-24 lg:py-40 text-center max-w-5xl mx-auto border-b border-slate-100">
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-black uppercase mb-8 leading-[0.9]">
            Hargeisa&apos;s Event <br/> Infrastructure
          </h1>
          <p className="text-lg text-slate-500 mb-12 max-w-xl mx-auto font-medium uppercase tracking-tight">
            The strictly professional choice for venue owners and event organizers. Modernizing Somaliland&apos;s grand celebrations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-black text-white rounded-none hover:bg-slate-800 px-12 h-16 text-xs font-bold uppercase tracking-widest gap-3">
                Enter Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="w-12 h-12 border-2 border-black flex items-center justify-center text-black">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-black uppercase tracking-tight">Real-time Scheduling</h3>
              <p className="text-slate-500 text-sm font-medium">Eliminate double-bookings with our centralized availability calendar designed for high-stakes events.</p>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 border-2 border-black flex items-center justify-center text-black">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-black uppercase tracking-tight">Client Management</h3>
              <p className="text-slate-500 text-sm font-medium">Maintain a professional ledger of all clients, preferences, and communication history.</p>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 border-2 border-black flex items-center justify-center text-black">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-black uppercase tracking-tight">Financial Integrity</h3>
              <p className="text-slate-500 text-sm font-medium">Track deposits, generate professional invoices, and monitor revenue with advanced reporting.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-black text-center">
        <p className="text-black font-bold uppercase text-[10px] tracking-[0.2em]">© 2026 Hargeisa Events Pro. Strictly Professional.</p>
      </footer>
    </div>
  );
}
