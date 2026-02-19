import { NextResponse } from "next/server";

export type BannerState = {
  drawNo: number;
  firstWinners: number;
  secondWinners: number;
  thirdWinners?: number;
  updatedAt: string;
};

// Safe banner endpoint. If KV isn't configured, it simply returns null.
export async function GET() {
  try {
    const { kv } = await import("@vercel/kv");
    const state = (await kv.get<BannerState>("banner:current")) ?? null;
    return NextResponse.json({ ok: true, state });
  } catch {
    return NextResponse.json({ ok: true, state: null });
  }
}
