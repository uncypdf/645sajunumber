import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import { fetchLatestDraw, matchRank } from "@/lib/winnersLive";

type PickEntry = { numbers: number[]; createdAt: number; targetDrawNo?: number };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "MISSING_ADMIN_TOKEN" }, { status: 500 });
  }
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const latest = await fetchLatestDraw();

    const raw = (await kv.lrange<string>("generated:picks", 0, 49999)) ?? [];
    const entries: PickEntry[] = raw
      .map((s) => {
        try {
          return JSON.parse(s) as PickEntry;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as PickEntry[];

    // Only count picks that were intended for this draw.
    const window = entries.filter((e) => e.targetDrawNo === latest.drawNo);

    let first = 0;
    let second = 0;
    let third = 0;

    for (const e of window) {
      const r = matchRank(e.numbers, latest);
      if (r === 1) first += 1;
      if (r === 2) second += 1;
      if (r === 3) third += 1;
    }

    const state = {
      drawNo: latest.drawNo,
      firstWinners: first,
      secondWinners: second,
      thirdWinners: third,
      updatedAt: new Date().toISOString(),
    };

    await kv.set("banner:current", state);

    return NextResponse.json({
      ok: true,
      latest,
      countedWindow: {
        targetDrawNo: latest.drawNo,
        picksCount: window.length,
      },
      state,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "CHECK_FAILED";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
