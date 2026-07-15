import Link from "next/link";

export default function ProjectsPage() {
  return (
    <main className="flex min-h-[100svh] items-center justify-center px-4 text-center text-white">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Work in progress</h1>
        <Link href="/" className="rounded underline underline-offset-4">
          Go back
        </Link>
      </div>
    </main>
  );
}
