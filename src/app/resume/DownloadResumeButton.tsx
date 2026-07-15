"use client";

import { useState } from "react";

export default function DownloadResumeButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPdf = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const [{ pdf }, { default: ResumePdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./ResumePdfDocument"),
      ]);
      const blob = await pdf(<ResumePdfDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "Saikiran-Kalluri-Resume.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={downloadPdf}
      disabled={isGenerating}
      className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
      aria-label="Download resume as a PDF"
    >
      {isGenerating ? "Preparing PDF…" : "Download PDF"}
    </button>
  );
}
