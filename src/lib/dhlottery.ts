export type DrawResult = {
  drawNo: number;
  drawDate: string; // YYYY-MM-DD
  numbers: number[]; // 6 numbers
  bonus: number;
};

// Official endpoint (public). Sometimes rate-limited from certain IPs.
const BASE = "https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=";

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      accept: "application/json,text/plain,*/*",
    },
    // Avoid caching stale draw results.
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return (await res.json()) as unknown;
}

export async function fetchDraw(drwNo: number): Promise<DrawResult | null> {
  const j = (await fetchJson(`${BASE}${drwNo}`)) as Record<string, unknown>;
  // When invalid, the API returns { returnValue: 'fail' }
  if (!j || j.returnValue !== "success") return null;

  const numbers = [j.drwtNo1, j.drwtNo2, j.drwtNo3, j.drwtNo4, j.drwtNo5, j.drwtNo6].map((x) =>
    Number(x)
  );
  const bonus = Number(j.bnusNo);
  const drawDate = String(j.drwNoDate);

  return {
    drawNo: Number(j.drwNo),
    drawDate,
    numbers,
    bonus,
  };
}

// Find the latest draw by probing upward from a starting guess.
// Keeps requests small.
export async function findLatestDraw(startGuess = 1200): Promise<DrawResult> {
  // First, move down until we find a valid draw.
  let lo = startGuess;
  while (lo > 1) {
    const d = await fetchDraw(lo);
    if (d) break;
    lo -= 1;
  }

  // Now go up until it fails (cap steps).
  let cur = lo;
  let last: DrawResult | null = await fetchDraw(cur);
  if (!last) {
    // fallback: scan from 1 upward (should never happen)
    for (let i = 1; i < startGuess + 500; i++) {
      const d = await fetchDraw(i);
      if (d) last = d;
    }
    if (!last) throw new Error("Could not find any valid draw result from dhlottery API");
    return last;
  }

  for (let step = 0; step < 50; step++) {
    const next = await fetchDraw(cur + 1);
    if (!next) break;
    cur += 1;
    last = next;
  }

  return last;
}

export function kstCutoffMs(drawDate: string) {
  // Draw happens on drawDate, usually Saturday evening.
  // We use 20:45 KST as a conservative cutoff.
  return Date.parse(`${drawDate}T20:45:00+09:00`);
}

export function matchRank(pick: number[], draw: DrawResult): 0 | 1 | 2 {
  const set = new Set(draw.numbers);
  const matchCount = pick.filter((n) => set.has(n)).length;
  if (matchCount === 6) return 1;
  if (matchCount === 5 && pick.includes(draw.bonus)) return 2;
  return 0;
}
