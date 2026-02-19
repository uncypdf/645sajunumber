import type { Metadata } from "next";
import NumberGenerator from "@/components/NumberGenerator";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.645sajunumber.com/",
  },
  openGraph: {
    url: "https://www.645sajunumber.com/",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/*
        Static (server-rendered) content block for AdSense reviewers/crawlers.
        Keeps meaningful publisher content visible even before any client-side hydration.
      */}
      <NumberGenerator variant="home" drawNo={914} />

      {/* Extra publisher content (helps AdSense + indexing) */}
      {/* AdSense disabled during review to avoid policy flags. Re-enable after approval. */}
      {/* <AdsenseHome /> */}
    </main>
  );
}
