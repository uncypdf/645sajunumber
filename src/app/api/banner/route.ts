import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export type BannerState = {
  drawNo: number;
  firstWinners: number;
  secondWinners: number;
  thirdWinners?: number;
  updatedAt: string;
};

export async function GET() {
  const state = (await kv.get<BannerState>("banner:current")) ?? null;
  return NextResponse.json({ ok: true, state });
}
