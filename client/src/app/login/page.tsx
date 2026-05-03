"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const callbackUrl = "/dashboard";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid credentials. Please try again.");
        setIsLoading(false);
      } else {
        // Use window.location.href for a hard redirect to ensure session synchronization
        window.location.href = callbackUrl;
      }
    } catch {
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 bg-black items-center justify-center mb-6">
            <Building2 className="text-white h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-black uppercase">
            HARGEISA PRO
          </h1>
          <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            MANAGEMENT ACCESS PORTAL
          </p>
        </div>

        <Card className="rounded-none border-2 border-black shadow-none">
          <CardHeader className="space-y-1 border-b border-slate-100 pb-6">
            <CardTitle className="text-xl font-bold uppercase tracking-tight">System Login</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-slate-400">
              Authorized Personnel Only
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={onSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 text-[10px] font-bold uppercase tracking-widest border border-red-200">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Security Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hargeisapro.com"
                  className="rounded-none border-slate-200 focus-visible:ring-black h-12 uppercase text-[10px] font-bold tracking-widest"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Access Key</Label>
                  <Button variant="link" className="h-auto p-0 text-[10px] font-bold uppercase tracking-widest text-slate-300" type="button">
                    Reset
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-none border-slate-200 focus-visible:ring-black h-12"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full bg-black text-white rounded-none h-12 font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors" disabled={isLoading}>
                {isLoading ? "AUTHENTICATING..." : "VERIFY ACCESS"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-[8px] font-bold uppercase text-slate-300 tracking-widest py-6 border-t border-slate-50">
            <span>By signing in, you agree to the</span>
            <Link href="#" className="underline underline-offset-4 hover:text-black">
              Security Protocol
            </Link>
          </CardFooter>
        </Card>

        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Request Access?{" "}
          <Link href="#" className="text-black hover:underline underline-offset-4">
            System Admin
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
