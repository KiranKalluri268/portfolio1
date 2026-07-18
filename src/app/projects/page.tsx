import type { Metadata } from "next";
import BackNavigationButton from "@/components/BackNavigationButton";

export const metadata: Metadata = {
  title: "Projects",
  description: "Detailed software project case studies by Saikiran Kalluri are coming soon.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ProjectsPage() {
  return (
    <main className="flex min-h-[100svh] items-center justify-center px-4 text-center text-white">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Work in progress</h1>
        <BackNavigationButton className="cursor-pointer rounded border-0 bg-transparent underline underline-offset-4">
          Go back
        </BackNavigationButton>
      </div>
    </main>
  );
}
