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
  title: "Saikiran Kalluri | MERN Full Stack Developer, DevOps Engineer & Cloud Engineer| Telangana, India",
  description: "Portfolio of Saikiran Kalluri (SaiKiran), a Software Engineer and AI Enthusiastic from Telangana, India. Specializing in Web Development(MERN Stack),DevOps, AWS, C++, and Java. View projects by Saikiran Kalluri.",
  keywords: ["Saikiran Kalluri", "Sai Kiran Kalluri", "Kiran Kalluri", "SaiKiran", "Kiran", "AWS Engineer", "C++ Developer", "Java Developer", "Full Stack Developer", "Cloud Engineer", "DevOps Engineer", "AI Enthusiastic", "Telangana", "India"],
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
  "knowsAbout": ["AWS", "React", "Node.js", "JAVA", "Python", "C++", "MERN Stack", "DevOps", "Git", "Github", "Docker", "Linux", "CI/CD", "GCP"],
  "worksFor": {
    "@type": "Organization",
    "name": "Freelance"
  },
  "image": {
    "@type": "ImageObject",
    "url": "https://saikirankalluri.vercel.app/images/kiran_passphoto.jpg",
    "width": 500,
    "height": 500
  },
  "sameAs": [
    "https://www.linkedin.com/in/saikiran-kalluri",
    "https://github.com/KiranKalluri268",
    "https://www.instagram.com/kiran_kalluri__08",
    "https://www.facebook.com/saikiran.88s",
    "https://x.com/KiranKalluri_08"
  ]
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