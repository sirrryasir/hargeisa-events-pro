import Link from "next/link";
import { ArrowRight, Calendar, Users, ShieldCheck, Star, MapPin, CheckCircle2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-24 lg:py-48 text-center max-w-6xl mx-auto overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none -z-10">
             <div className="w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:40px_40px]"></div>
          </div>
          
          <Badge className="mb-6 rounded-none bg-slate-100 text-black border-none hover:bg-slate-100 px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
            The standard in event infrastructure
          </Badge>
          
          <h1 className="text-7xl lg:text-9xl font-black tracking-tighter text-black uppercase mb-8 leading-[0.85]">
            GRAND<br/>CELEBRATIONS
          </h1>
          <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto font-medium uppercase tracking-tight leading-relaxed">
            From luxury wedding halls to world-class sound engineering. 
            The strictly professional choice for Somaliland&apos;s most prestigious events.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/venues">
              <Button size="lg" className="bg-black text-white rounded-none hover:bg-slate-800 px-12 h-16 text-[10px] font-bold uppercase tracking-widest gap-3">
                Browse Venues <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/vendors">
              <Button size="lg" variant="outline" className="border-2 border-black text-black rounded-none hover:bg-black hover:text-white px-12 h-16 text-[10px] font-bold uppercase tracking-widest">
                Our Vendor Network
              </Button>
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-6">
             <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
               <div className="max-w-xl">
                 <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-4">A complete ecosystem</h2>
                 <p className="text-slate-500 font-medium uppercase tracking-tight text-sm">
                   We provide everything needed to execute a flawless event, from the physical space to the technical support.
                 </p>
               </div>
               <Link href="/venues" className="text-xs font-bold text-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-slate-400 hover:border-slate-400 transition-all">
                 View All Services
               </Link>
             </div>

             <div className="grid md:grid-cols-4 gap-4">
               {[
                 { title: "Luxury Halls", desc: "Premium indoor spaces", icon: Building2 },
                 { title: "Sound & Light", desc: "Expert engineering", icon: Star },
                 { title: "Catering", desc: "Traditional & Modern", icon: Users },
                 { title: "Security", desc: "Professional safety", icon: ShieldCheck }
               ].map((item, i) => (
                 <div key={i} className="bg-white p-8 border border-slate-200 hover:border-black transition-colors group">
                   <item.icon className="h-8 w-8 text-black mb-6" />
                   <h3 className="font-bold text-black uppercase tracking-tight text-lg mb-2">{item.title}</h3>
                   <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">{item.desc}</p>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* Statistics / Trust Section */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div className="relative aspect-square bg-slate-100 border border-slate-200">
               <div className="absolute inset-12 border-2 border-black/5 flex flex-col justify-center p-12">
                  <div className="text-8xl font-black text-black tracking-tighter mb-4">98%</div>
                  <div className="text-xl font-bold text-black uppercase tracking-tight">Satisfaction Rate</div>
                  <div className="mt-8 text-slate-400 text-sm font-medium uppercase tracking-widest leading-relaxed">
                    Trusted by the largest corporations and families in Hargeisa for over 5 years.
                  </div>
               </div>
            </div>
            <div className="space-y-12">
               <div>
                 <h2 className="text-5xl font-black text-black uppercase tracking-tighter leading-none mb-6">Built for scale</h2>
                 <p className="text-slate-500 font-medium uppercase tracking-tight leading-relaxed">
                    Hargeisa Events Pro isn&apos;t just a booking site. It&apos;s a management framework that ensures reliability, transparency, and excellence.
                 </p>
               </div>
               
               <div className="space-y-8">
                 {[
                   { t: "Verified Vendors", d: "Every service provider on our platform is vetted for quality." },
                   { t: "Automated Billing", d: "Receive professional PDF invoices and secure payment logs." },
                   { t: "Conflict-Free", d: "Our intelligent booking system eliminates scheduling errors." }
                 ].map((feat, i) => (
                   <div key={i} className="flex gap-6">
                     <div className="flex-shrink-0 w-6 h-6 rounded-full bg-black flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                     </div>
                     <div>
                       <h4 className="font-bold text-black uppercase tracking-tight mb-2">{feat.t}</h4>
                       <p className="text-slate-400 text-sm font-medium">{feat.d}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-black text-white px-6 text-center">
           <div className="max-w-4xl mx-auto">
             <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-8 leading-tight">Ready to host your next masterpiece?</h2>
             <p className="text-slate-400 font-medium uppercase tracking-widest mb-12 text-sm">Join the network of professional event organizers in Somaliland.</p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/venues">
                  <Button size="lg" className="bg-white text-black hover:bg-slate-200 rounded-none px-12 h-16 text-[10px] font-bold uppercase tracking-widest">
                    Start Searching
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black rounded-none px-12 h-16 text-[10px] font-bold uppercase tracking-widest transition-all">
                    Business Portal
                  </Button>
                </Link>
             </div>
           </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
