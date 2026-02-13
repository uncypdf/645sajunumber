// Live fetch of lotto results from a maintained GitHub CSV.
// We use this instead of the official dhlottery API which can be IP-blocked.
// Format per line: n1,n2,n3,n4,n5,n6,bonus

export type LiveDraw = {
  drawNo: number; // sequential index (assumed to match official drawNo)
  numbers: number[];
  bonus: number;
};

export const CSV_URL =
  "https://raw.githubusercontent.com/ioahKwon/Korean-Lottery-games-Analysis/master/data/lotto.csv";

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      accept: "text/plain,*/*",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

export async function fetchLatestDraw(): Promise<LiveDraw> {
  const csv = await fetchText(CSV_URL);
  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) throw new Error("EMPTY_CSV");

  const last = lines[lines.length - 1];
  const parts = last.split(",").map((s) => Number(s.trim()));
  if (parts.length < 7 || parts.some((n) => !Number.isFinite(n))) {
    throw new Error("INVALID_LAST_ROW");
  }

  return {
    drawNo: lines.length,
    numbers: parts.slice(0, 6),
    bonus: parts[6],
  };
}

export function matchRank(pick: number[], draw: LiveDraw): 0 | 1 | 2 | 3 {
  const set = new Set(draw.numbers);
  const matchCount = pick.filter((n) => set.has(n)).length;
  if (matchCount === 6) return 1;
  if (matchCount === 5 && pick.includes(draw.bonus)) return 2;
  if (matchCount === 5) return 3;
  return 0;
}
