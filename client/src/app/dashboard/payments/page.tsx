"use client";

import { useEffect, useState } from "react";
import { Download, CreditCard, Receipt, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { exportToCSV } from "@/lib/export";

interface Payment {
  _id: string;
  transactionId: string;
  clientName: string;
  venueName: string;
  amount: number;
  type: string;
  status: "paid" | "pending" | "failed";
  paymentDate: string;
}

export default function PaymentBilling() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    const fetchPayments = async () => {
      try {
        const res = await api.get("/payments");
        setPayments(res.data.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [session]);

  if (isLoading) return <div className="p-12 text-center font-bold text-black uppercase tracking-widest">Compiling Ledger...</div>;

  const totalRevenue = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="border-b border-black pb-8">
        <h1 className="text-3xl font-bold text-black uppercase tracking-tighter">Financial Ledger</h1>
        <p className="mt-1 text-sm text-slate-500 font-medium uppercase tracking-tight">
          Transaction History and Revenue Analytics
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-none border-slate-200 shadow-none">
          <CardContent className="flex items-center gap-6 p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-black text-white">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Revenue</p>
              <p className="text-2xl font-bold text-black">${totalRevenue}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-slate-200 shadow-none">
          <CardContent className="flex items-center gap-6 p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-slate-100 text-slate-400">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending</p>
              <p className="text-2xl font-bold text-black">${pendingPayments}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-slate-200 shadow-none">
          <CardContent className="flex items-center gap-6 p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-slate-50 text-slate-400">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transactions</p>
              <p className="text-2xl font-bold text-black">{payments.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-none border-slate-200 shadow-none">
        <CardHeader className="border-b border-slate-100 pb-6">
          <CardTitle className="text-lg font-bold text-black uppercase tracking-tight">Recent Transactions</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase text-slate-400">
            HGS Market — Automated Verification Ledger
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead className="pl-6 font-bold text-black uppercase text-[10px] tracking-widest py-4">TXN Identifier</TableHead>
                <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest">Client & Asset</TableHead>
                <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest">Amount</TableHead>
                <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest">Type</TableHead>
                <TableHead className="font-bold text-black uppercase text-[10px] tracking-widest">Status</TableHead>
                <TableHead className="pr-6 text-right font-bold text-black uppercase text-[10px] tracking-widest">Export</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((trx) => (
                <TableRow key={trx._id} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 font-mono text-[10px] text-slate-400 font-bold">
                    {trx.transactionId}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-black uppercase text-xs tracking-tight">{trx.clientName}</span>
                      <span className="text-[10px] font-medium text-slate-400">{trx.venueName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-black">${trx.amount}</TableCell>
                  <TableCell className="text-[10px] font-bold uppercase text-slate-400">{trx.type}</TableCell>
                  <TableCell>
                    <Badge className={`rounded-none px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                      trx.status === "paid" ? "bg-black text-white" : "bg-white text-slate-300 border border-slate-200"
                    }`}>
                      {trx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button 
                      onClick={() => exportToCSV([trx] as unknown as Record<string, unknown>[], `transaction-${trx.transactionId}`)}
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-black hover:text-white rounded-none"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
