import crypto from "node:crypto";

export type RecommendInput = {
  birthdate: string; // YYYY-MM-DD
  initials: string; // e.g., JHL
  timestamp: string; // ISO string
};

function normalizeInitials(s: string) {
  return s.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 10);
}

export function seedString(input: RecommendInput) {
  const birth = input.birthdate.trim();
  const initials = normalizeInitials(input.initials);
  const ts = input.timestamp.trim();
  return `${birth}|${initials}|${ts}`;
}

function hashToUint32(seed: string) {
  const h = crypto.createHash("sha256").update(seed).digest();
  // Use first 4 bytes
  return h.readUInt32LE(0);
}

// Small fast PRNG
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function comboKey(nums: number[]) {
  return nums
    .slice()
    .sort((a, b) => a - b)
    .map((n) => String(n).padStart(2, "0"))
    .join("-");
}

export type WinnersData = {
  latest: number | null;
  draws: Array<{ drawNo: number; date: string; numbers: number[]; bonus: number; key: string }>;
};

export type RecommendResult = {
  numbers: number[];
  key: string;
  seed: string;
  timestamp: string;
  excludedReason?: "PAST_JACKPOT_COMBO";
};

export function recommendNumbers(
  input: RecommendInput,
  winners: WinnersData | null,
  options?: { maxRetries?: number }
): RecommendResult {
  const seed = seedString(input);
  const base = hashToUint32(seed);
  const maxRetries = options?.maxRetries ?? 200;

  const pastKeys = winners ? new Set(winners.draws.map((d) => d.key)) : new Set<string>();

  for (let i = 0; i < maxRetries; i++) {
    const rng = mulberry32((base + i) >>> 0);

    const picked = new Set<number>();
    while (picked.size < 6) {
      const n = 1 + Math.floor(rng() * 45);
      picked.add(n);
    }

    const numbers = Array.from(picked).sort((a, b) => a - b);
    const key = comboKey(numbers);

    if (pastKeys.size > 0 && pastKeys.has(key)) {
      continue; // re-roll
    }

    return { numbers, key, seed, timestamp: input.timestamp };
  }

  // Fallback: return last attempt even if it matches (extremely unlikely)
  const rng = mulberry32(base);
  const picked = new Set<number>();
  while (picked.size < 6) picked.add(1 + Math.floor(rng() * 45));
  const numbers = Array.from(picked).sort((a, b) => a - b);
  const key = comboKey(numbers);
  return {
    numbers,
    key,
    seed,
    timestamp: input.timestamp,
    excludedReason: winners && pastKeys.has(key) ? "PAST_JACKPOT_COMBO" : undefined,
  };
}
