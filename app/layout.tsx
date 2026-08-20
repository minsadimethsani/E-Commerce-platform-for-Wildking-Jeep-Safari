import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wildking Jeep Safari | Luxury Wildlife Expeditions Sri Lanka",
  description: "Book custom 4x4 Land Cruiser safaris in Yala, Udawalawe, Wilpattu & Minneriya. Guaranteed leopard & elephant sightings with master wildlife trackers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050b14] text-zinc-100 selection:bg-amber-400 selection:text-emerald-950 relative">
        {/* Dynamic White Thin Rounded Corner Border Frame around the entire Landing Page Viewport */}
        <div 
          className="pointer-events-none fixed inset-2 sm:inset-4 z-50 rounded-2xl sm:rounded-3xl border border-white/60 ring-1 ring-white/30 animate-dynamic-white-border"
          aria-hidden="true"
        />
        
        {children}
      </body>
    </html>
  );
}

