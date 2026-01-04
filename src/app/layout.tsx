import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Foldit, Tektur } from "next/font/google";
import "./globals.css";
import CometsInBackground from '@/background/CometsInBackground';
import BlackholeEffect from '@/background/BlackholeEffect';
import StarfieldBackground from '@/background/StarfieldBackground';
import { AudioProvider } from "@/context/AudioContextProvider";
import { ScrollProvider } from "@/context/ScrollManager";
import { ProjectViewProvider } from "@/context/ProjectViewContext";
import { ScrollManagerProvider } from "@/context/ScrollManagerContext";
import { GlobalProvider } from "@/context/GlobalContext";
import { UnifiedScrollProvider } from "@/context/UnifiedScrollManager";


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
  title: "Saikiran Kalluri | Full Stack Developer & C++ Engineer | Telangana",
  description: "Portfolio of Saikiran Kalluri (Sai Kiran), a Software Engineer from Telangana. Specializing in AWS, C++, and Web Development. View projects by Saikiran Kalluri.",
  keywords: ["Saikiran Kalluri", "Sai Kiran Kalluri", "Kiran Kalluri", "AWS Engineer", "C++ Developer"],
  verification: {
    google: "3EakCwstiUdkMkdhG4C9U2iG3xAVbQnaDxh9ButJ7yM",
  },
};

const jsonLd = {
  "@context": "http://schema.org",
  "@type": "Person",
  "name": "Sai Kiran Kalluri",
  "alternateName": ["Kiran Kalluri", "Sai Kiran", "Saikiran Kalluri"],
  "url": "https://saikirankalluri.vercel.app",
  "jobTitle": "Software Engineer",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Telangana",
    "addressCountry": "India"
  },
  "knowsAbout": ["AWS", "C++", "React", "Node.js", "Computer Vision"],
  "worksFor": {
    "@type": "Organization",
    "name": "Freelance"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${foldit.variable} ${tektur.variable}`}>
      <body className="relative bg-black">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <UnifiedScrollProvider>
          <GlobalProvider>
            <ScrollManagerProvider>
              <ScrollProvider>
                <ProjectViewProvider>
                  <AudioProvider>
                    {/* Starfield: Background stars */}
                    <StarfieldBackground />

                    {/* Comets: Particle layer */}
                    <CometsInBackground />

                    {/* Blackhole: Interactive gravity field */}
                    <BlackholeEffect />

                    {/* Your main content */}
                    <div className="relative z-10">
                      {children}
                    </div>
                  </AudioProvider>
                </ProjectViewProvider>
              </ScrollProvider>
            </ScrollManagerProvider>
          </GlobalProvider>
        </UnifiedScrollProvider>
      </body>
    </html>
  );
}