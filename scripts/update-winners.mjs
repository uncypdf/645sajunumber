import fs from "node:fs";
import path from "node:path";

const DATA_PATH = path.join(process.cwd(), "src", "data", "winners.json");

function comboKey(nums) {
  return nums
    .slice()
    .sort((a, b) => a - b)
    .map((n) => String(n).padStart(2, "0"))
    .join("-");
}

async function fetchDraw(drawNo) {
  const url = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drawNo}`;
  const res = await fetch(url, {
    headers: {
      // Some environments behave better with UA.
      "user-agent": "645sajunumber-bot/1.0",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  if (j.returnValue !== "success") return null;

  const numbers = [j.drwtNo1, j.drwtNo2, j.drwtNo3, j.drwtNo4, j.drwtNo5, j.drwtNo6]
    .map((x) => Number(x))
    .filter((x) => Number.isFinite(x));
  const bonus = Number(j.bnusNo);
  const date = j.drwNoDate || null;

  if (numbers.length !== 6 || !Number.isFinite(bonus)) {
    throw new Error(`Malformed draw payload for ${drawNo}`);
  }

  return {
    drawNo,
    date,
    numbers: numbers.sort((a, b) => a - b),
    bonus,
    key: comboKey(numbers),
  };
}

async function main() {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const data = JSON.parse(raw);

  const existing = new Map();
  for (const d of data.draws || []) existing.set(Number(d.drawNo), d);

  let latest = Number(data.latest ?? 0);
  if (!Number.isFinite(latest) || latest < 0) latest = 0;

  const added = [];
  // Try to append up to +20 draws in one run.
  for (let n = latest + 1; n <= latest + 20; n++) {
    // eslint-disable-next-line no-await-in-loop
    const draw = await fetchDraw(n);
    if (!draw) break;
    if (!existing.has(draw.drawNo)) {
      existing.set(draw.drawNo, draw);
      added.push(draw.drawNo);
    }
    latest = Math.max(latest, draw.drawNo);
  }

  const draws = Array.from(existing.values()).sort((a, b) => Number(a.drawNo) - Number(b.drawNo));

  const out = {
    latest,
    draws,
  };

  fs.writeFileSync(DATA_PATH, JSON.stringify(out, null, 2) + "\n", "utf8");

  console.log(`latest=${latest}`);
  console.log(`added=${added.length ? added.join(",") : "(none)"}`);
}

await main();
