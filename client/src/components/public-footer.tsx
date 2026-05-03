import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="py-20 px-6 border-t border-slate-200 bg-white text-center">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left mb-16">
        <div>
          <h4 className="font-black uppercase tracking-widest text-[10px] mb-6 text-black">Navigation</h4>
          <ul className="space-y-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            <li><Link href="/venues" className="hover:text-black transition-colors">Browse Venues</Link></li>
            <li><Link href="/vendors" className="hover:text-black transition-colors">Event Vendors</Link></li>
            <li><Link href="/login" className="hover:text-black transition-colors">Member Access</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black uppercase tracking-widest text-[10px] mb-6 text-black">Contact</h4>
          <ul className="space-y-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            <li>Hargeisa, Somaliland</li>
            <li>+252 63 000 000</li>
            <li>pro@hargeisaevents.com</li>
          </ul>
        </div>
        <div>
          <h4 className="font-black uppercase tracking-widest text-[10px] mb-6 text-black">Legal</h4>
          <ul className="space-y-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            <li>Terms of Service</li>
            <li>Privacy Protocol</li>
          </ul>
        </div>
      </div>
      <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.2em]">
        © 2026 Hargeisa Events Pro. Strictly Professional.
      </p>
    </footer>
  );
}
