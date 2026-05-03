"use client";

import Link from "next/link";
import { Building2, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function PublicHeader() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="px-6 lg:px-12 h-20 flex items-center justify-between border-b border-slate-200 sticky top-0 bg-white z-50">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-black flex items-center justify-center">
          <Building2 className="text-white h-6 w-6" />
        </div>
        <span className="text-xl font-bold tracking-tighter text-black uppercase">
          HARGEISA<span className="text-slate-400">PRO</span>
        </span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8">
        <Link href="/venues" className="text-xs font-bold text-black uppercase tracking-widest hover:text-slate-500 transition-colors">Venues</Link>
        <Link href="/vendors" className="text-xs font-bold text-black uppercase tracking-widest hover:text-slate-500 transition-colors">Vendors</Link>
        <Link href={session ? "/dashboard" : "/login"} className="text-xs font-bold text-black uppercase tracking-widest border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all">
          {session ? "Dashboard" : "Portal Access"}
        </Link>
      </nav>

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden text-black p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-20 bg-white z-40 md:hidden flex flex-col p-6 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-6 pt-12">
            <Link 
              href="/venues" 
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-black text-black uppercase tracking-tighter"
            >
              Venues
            </Link>
            <Link 
              href="/vendors" 
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-black text-black uppercase tracking-tighter"
            >
              Vendors
            </Link>
            <Link 
              href={session ? "/dashboard" : "/login"} 
              onClick={() => setIsMenuOpen(false)}
              className="mt-4 text-xs font-bold text-black uppercase tracking-widest border-2 border-black px-6 py-4 text-center hover:bg-black hover:text-white transition-all"
            >
              {session ? "Enter Dashboard" : "Portal Access"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
