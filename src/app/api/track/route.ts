import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

type Pick = {
  numbers: number[];
  createdAt?: number; // ms
  targetDrawNo?: number;
};

type Body = Pick | { picks: Pick[] };

function normalize(nums: number[]) {
  return nums.slice().map(Number).sort((a, b) => a - b);
}

function isBatchBody(body: Body): body is { picks: Pick[] } {
  return typeof body === "object" && body !== null && "picks" in body && Array.isArray((body as { picks: unknown }).picks);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const picks: Pick[] = isBatchBody(body) ? body.picks : [body];
    if (!picks.length) {
      return NextResponse.json({ ok: false, error: "INVALID_BODY" }, { status: 400 });
    }

    const key = "generated:picks";

    // Validate + normalize and push as a batch (still stored as individual entries)
    const entries: string[] = [];
    for (const p of picks) {
      if (!p?.numbers || !Array.isArray(p.numbers) || p.numbers.length !== 6) {
        return NextResponse.json({ ok: false, error: "INVALID_NUMBERS" }, { status: 400 });
      }

      const numbers = normalize(p.numbers);
      const createdAt = typeof p.createdAt === "number" ? p.createdAt : Date.now();
      const targetDrawNo = typeof p.targetDrawNo === "number" ? p.targetDrawNo : undefined;
      entries.push(JSON.stringify({ numbers, createdAt, targetDrawNo }));
    }

    // LPUSH supports pushing multiple values in one call
    await kv.lpush(key, ...entries);
    await kv.ltrim(key, 0, 49999); // keep last 50k

    return NextResponse.json({ ok: true, count: entries.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "SERVER_ERROR";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
