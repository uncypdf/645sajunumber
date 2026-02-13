"use client";

import { useMemo } from "react";

export default function ObfuscatedEmail({ user, domain }: { user: string; domain: string }) {
  const email = useMemo(() => `${user}@${domain}`, [user, domain]);

  function copy() {
    navigator.clipboard.writeText(email);
  }

  // Render as text but keep a working mailto (assembled client-side)
  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href={`mailto:${email}`} className="font-mono text-zinc-200 underline underline-offset-4">
        {user}
        <span className="mx-1 text-zinc-500">[at]</span>
        {domain.replace(".", " [dot] ")}
      </a>
      <button
        onClick={copy}
        className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-900"
      >
        복사
      </button>
    </div>
  );
}
