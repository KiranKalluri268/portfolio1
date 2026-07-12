"use client";

import { useSmoothScroll, type SectionId } from "@/context/SmoothScrollContext";

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

const SECTION_IDS = new Set<SectionId>(["hero", "projects", "experience", "skills", "contact"]);

export default function SkipLink({ href, children }: SkipLinkProps) {
  const { scrollToSection } = useSmoothScroll();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const id = href.slice(1);
    if (id === "main-content") return;
    if (!SECTION_IDS.has(id as SectionId)) return;
    event.preventDefault();
    scrollToSection(id as SectionId);
    document.getElementById(id)?.focus({ preventScroll: true });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
    >
      {children}
    </a>
  );
}
