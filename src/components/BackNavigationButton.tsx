"use client";

import { useRouter } from "next/navigation";

interface BackNavigationButtonProps {
  children: React.ReactNode;
  className?: string;
  fallbackHref?: string;
}

export default function BackNavigationButton({
  children,
  className,
  fallbackHref = "/",
}: BackNavigationButtonProps) {
  const router = useRouter();

  const goBack = () => {
    const hasLocalHistory = document.referrer
      ? new URL(document.referrer).origin === window.location.origin
      : window.history.length > 1;

    if (hasLocalHistory) router.back();
    else router.push(fallbackHref);
  };

  return (
    <button type="button" onClick={goBack} className={className}>
      {children}
    </button>
  );
}
