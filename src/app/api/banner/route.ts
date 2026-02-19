import { NextResponse } from "next/server";

export type BannerState = {
  drawNo: number;
  firstWinners: number;
  secondWinners: number;
  thirdWinners?: number;
  fourthWinners?: number;
  fifthWinners?: number;
  updatedAt: string;
};

async function fetchBannerFromDhlottery(): Promise<BannerState | null> {
  const res = await fetch("https://www.dhlottery.co.kr/selectMainInfo.do", {
    next: { revalidate: 60 * 60 },
    headers: {
      "user-agent": "Mozilla/5.0 (645sajunumber)",
    },
  });

  if (!res.ok) return null;
  const j = await res.json();

  const lt645: Array<any> | undefined = j?.data?.result?.pstLtEpstInfo?.lt645;
  if (!Array.isArray(lt645) || lt645.length === 0) return null;

  const latest = lt645
    .map((x) => Number(x?.ltEpsd))
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => a - b)
    .at(-1);

  const item = lt645.find((x) => Number(x?.ltEpsd) === latest);
  if (!item || !latest) return null;

  const state: BannerState = {
    drawNo: latest,
    firstWinners: Number(item?.rnk1WnNope ?? 0) || 0,
    secondWinners: Number(item?.rnk2WnNope ?? 0) || 0,
    thirdWinners: Number.isFinite(Number(item?.rnk3WnNope)) ? Number(item?.rnk3WnNope) : undefined,
    fourthWinners: Number.isFinite(Number(item?.rnk4WnNope)) ? Number(item?.rnk4WnNope) : undefined,
    fifthWinners: Number.isFinite(Number(item?.rnk5WnNope)) ? Number(item?.rnk5WnNope) : undefined,
    updatedAt: new Date().toISOString(),
  };

  return state;
}

// Banner endpoint.
// - If KV is configured and has data, we use it.
// - Otherwise, we derive it from dhlottery main info JSON.
export async function GET() {
  try {
    const { kv } = await import("@vercel/kv");
    const kvState = (await kv.get<BannerState>("banner:current")) ?? null;
    if (kvState) return NextResponse.json({ ok: true, state: kvState });
  } catch {
    // ignore and fallback
  }

  try {
    const state = await fetchBannerFromDhlottery();
    return NextResponse.json({ ok: true, state });
  } catch {
    return NextResponse.json({ ok: true, state: null });
  }
}
