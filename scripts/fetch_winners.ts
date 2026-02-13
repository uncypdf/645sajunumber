import fs from "node:fs";

// Winner dataset source (CSV) from GitHub.
// Note: official dhlottery API is often IP-blocked; using a maintained dataset is more reliable.
// Format per line: n1,n2,n3,n4,n5,n6,bonus
const CSV_URL =
  "https://raw.githubusercontent.com/ioahKwon/Korean-Lottery-games-Analysis/master/data/lotto.csv";

function comboKey(nums: number[]) {
  return nums
    .slice()
    .sort((a, b) => a - b)
    .map((n) => String(n).padStart(2, "0"))
    .join("-");
}

async function fetchText(url: string) {
  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      accept: "text/plain,*/*",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

async function main() {
  const outPath = "src/data/winners.json";

  const csv = await fetchText(CSV_URL);
  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const draws: Array<{
    drawNo: number;
    date: string | null;
    numbers: number[];
    bonus: number | null;
    key: string;
  }> = [];

  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split(",").map((s) => Number(s.trim()));
    if (parts.length < 6) continue;
    const numbers = parts.slice(0, 6);
    const bonus = parts.length >= 7 ? parts[6] : null;
    const key = comboKey(numbers);

    draws.push({
      // Dataset doesn't include draw number/date. We store a sequential id.
      drawNo: i + 1,
      date: null,
      numbers,
      bonus,
      key,
    });
  }

  const latest = draws.length ? draws[draws.length - 1].drawNo : null;
  console.log(`Fetched ${draws.length} rows from dataset. Latest index: ${latest}`);

  fs.mkdirSync("src/data", { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ latest, draws }, null, 2));
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
