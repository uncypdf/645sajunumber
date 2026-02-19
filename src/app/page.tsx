import type { Metadata } from "next";
import NumberGenerator from "@/components/NumberGenerator";
import { fetchLatestLotto645DrawNo } from "@/lib/dhlottery";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.645sajunumber.com/",
  },
  openGraph: {
    url: "https://www.645sajunumber.com/",
  },
};

export const revalidate = 3600; // 1 hour

export default async function Home() {
  const latestDrawNo = await fetchLatestLotto645DrawNo();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/*
        Static (server-rendered) content block for AdSense reviewers/crawlers.
        Keeps meaningful publisher content visible even before any client-side hydration.
      */}
      <NumberGenerator variant="home" latestDrawNo={latestDrawNo} />

      {/* Extra publisher content (helps AdSense + indexing) */}
      {/* AdSense disabled during review to avoid policy flags. Re-enable after approval. */}
      {/* <AdsenseHome /> */}
    </main>
  );
}
