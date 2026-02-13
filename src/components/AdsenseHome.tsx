"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Renders AdSense ONLY on the home page (/).
 *
 * Env vars (set in Vercel):
 * - NEXT_PUBLIC_ADSENSE_CLIENT: "ca-pub-xxxxxxxxxxxxxxxx"
 * - NEXT_PUBLIC_ADSENSE_SLOT:   "1234567890"
 */
export default function AdsenseHome() {
  const pathname = usePathname();

  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

  const enabled = pathname === "/" && !!client && !!slot;

  useEffect(() => {
    if (!enabled) return;

    // Delay ad request until the user has seen some content / interacted.
    // Helps avoid "pages without content" / premature ad loads during reviews.
    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch {
        // ignore
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", fire);
      window.removeEventListener("keydown", fire);
    };

    const onScroll = () => {
      // when user scrolls a bit, load ads
      if (window.scrollY > 120) fire();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", fire, { once: true });
    window.addEventListener("keydown", fire, { once: true });

    // fallback: fire after a short delay (in case no scroll)
    const t = window.setTimeout(fire, 2500);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", fire);
      window.removeEventListener("keydown", fire);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <section className="mx-auto mt-10 max-w-xl px-5" aria-label="광고">
      <Script
        async
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client!)}`}
        crossOrigin="anonymous"
      />

      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </section>
  );
}
