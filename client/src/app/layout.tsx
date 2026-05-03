import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hargeisa Events Pro",
    template: "%s | Hargeisa Events Pro",
  },
  description:
    "Professional event management and venue booking for Hargeisa. Manage hotels, halls, and event reservations.",
};

import { AuthProvider } from "@/components/providers/auth-provider";
import { NotificationProvider } from "@/components/notification-provider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`} suppressHydrationWarning>
        <AuthProvider>
          <NotificationProvider>
            {children}
            <Toaster position="top-right" />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
