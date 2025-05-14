import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Foldit, Tektur } from "next/font/google";
import "./globals.css";
import CometsInBackground from '@/background/CometsInBackground';
import BlackholeEffect from '@/background/BlackholeEffect';
import StarfieldBackground from '@/background/StarfieldBackground';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const foldit = Foldit({
  variable: "--font-foldit",
  subsets: ["latin"],
  display: 'swap',
  weight: ["400", "700"], // Only specify available weights
});

const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
  display: 'swap',
  weight: "400", // Or specify exact weights needed
});

export const metadata: Metadata = {
  title: "Kiran Kalluri",
  description: "Kiran Kalluri's portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${foldit.variable} ${tektur.variable}`}>
      <body className="relative">
        {/* Starfield: Background stars */}
        <StarfieldBackground />

        {/* Comets: Particle layer */}
        <CometsInBackground />

        {/* Blackhole: Interactive gravity field */}
        <BlackholeEffect />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}