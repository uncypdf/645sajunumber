"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import winners from "@/data/winners.json";
import { recommendNumbers, type RecommendResult, type WinnersData } from "@/lib/lotto";

const winnersData = winners as unknown as WinnersData;

function SlotDigit({ digit, hidden }: { digit: number; hidden?: boolean }) {
  const key = useMemo(() => String(digit), [digit]);
  const h = 24;
  const loops = 3;
  const offset = -((loops * 10 + digit) * h);

  return (
    <span
      key={key}
      aria-hidden={hidden}
      className={
        "relative inline-flex h-6 w-4 items-center justify-center overflow-hidden rounded bg-zinc-950/70 text-sm font-semibold text-zinc-100" +
        (hidden ? " opacity-0" : "")
      }
    >
      <span
        className="block"
        style={
          {
            lineHeight: `${h}px`,
            animation: "saju-slot 900ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards",
            ["--slot-to" as never]: `${offset}px`,
          } as CSSProperties
        }
      >
        {Array.from({ length: loops * 10 + 10 }, (_, i) => (
          <span key={i} className="block h-6 w-4 text-center">
            {i % 10}
          </span>
        ))}
      </span>
    </span>
  );
}

function SlotNumber({ n }: { n: number }) {
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  const hideTens = n < 10;

  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-zinc-950 px-3 py-2">
      <SlotDigit digit={tens} hidden={hideTens} />
      <SlotDigit digit={ones} />
    </span>
  );
}

function kstIsoFromBirthdateHour(birthdate: string, ampm: "AM" | "PM", hour12: number) {
  const hour = ((hour12 % 12) + (ampm === "PM" ? 12 : 0)) % 24;
  const baseMs = Date.parse(`${birthdate}T00:00:00+09:00`);
  const ms = baseMs + hour * 60 * 60 * 1000;
  return new Date(ms).toISOString();
}

function nextDrawCutoffUtcMs(): number {
  // Lotto draw: Sat 20:45 KST (== 11:45 UTC)
  const nowUtc = Date.now();
  const shiftedNow = new Date(nowUtc + 9 * 60 * 60 * 1000);

  const dow = shiftedNow.getUTCDay(); // 0=Sun ... 6=Sat (based on KST)
  const daysUntilSat = (6 - dow + 7) % 7;

  const y = shiftedNow.getUTCFullYear();
  const m = shiftedNow.getUTCMonth();
  const d = shiftedNow.getUTCDate() + daysUntilSat;

  let cutoffUtc = Date.UTC(y, m, d, 11, 45, 0);
  if (nowUtc >= cutoffUtc) cutoffUtc += 7 * 24 * 60 * 60 * 1000;
  return cutoffUtc;
}

function drawPeriodIdKst(): string {
  const cutoffUtc = nextDrawCutoffUtcMs();
  const cutoffKst = new Date(cutoffUtc + 9 * 60 * 60 * 1000);
  const y = cutoffKst.getUTCFullYear();
  const m = String(cutoffKst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(cutoffKst.getUTCDate()).padStart(2, "0");
  return `drawCutoff:${y}-${m}-${d}T20:45+09:00`;
}

function drawCutoffLabelKst(): string {
  const cutoffUtc = nextDrawCutoffUtcMs();
  const cutoffKst = new Date(cutoffUtc + 9 * 60 * 60 * 1000);
  const m = cutoffKst.getUTCMonth() + 1;
  const d = cutoffKst.getUTCDate();
  return `${m}/${d} (토) 20:45(KST) 발표 전까지`;
}

function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "server";
  const key = "saju_uid";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const uid = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  window.localStorage.setItem(key, uid);
  return uid;
}

export default function NumberGenerator({
  variant = "home",
  drawNo,
}: {
  variant?: "home" | "draw";
  drawNo?: number;
}) {

  const [birthdate, setBirthdate] = useState("");
  const [initials, setInitials] = useState("");

  const [ampm, setAmpm] = useState<"" | "AM" | "PM">("");
  const [hour12, setHour12] = useState<number | "">("");

  const [results, setResults] = useState<RecommendResult[] | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [pending, setPending] = useState<RecommendResult[] | null>(null);
  const [showSlots, setShowSlots] = useState(false);

  function buildTimestampForSeed(nonce?: string) {
    const periodId = drawPeriodIdKst();
    const uid = getOrCreateUserId();
    const birthTimePart = birthdate && ampm && hour12 !== "" ? kstIsoFromBirthdateHour(birthdate, ampm, Number(hour12)) : "";
    const parts = [periodId, `uid=${uid}`];
    if (birthTimePart) parts.push(`birthTime=${birthTimePart}`);
    if (nonce) parts.push(`nonce=${nonce}`);
    return parts.join("|");
  }

  function generate(count: number) {
    if (!birthdate) return alert("생년월일을 입력해줘");
    if (!initials.trim()) return alert("영문 이니셜을 입력해줘");
    if (isAnimating) return;

    const out: RecommendResult[] = [];
    for (let i = 0; i < count; i++) {
      // For 5개 생성: 첫번째 조합은 1개 생성과 동일하게(=nonce 없음) 고정
      const nonce = count > 1 && i > 0 ? String(i + 1) : undefined;
      const ts = buildTimestampForSeed(nonce);
      out.push(recommendNumbers({ birthdate, initials, timestamp: ts }, winnersData, { maxRetries: 500 }));
    }

    setResults(null);
    setPending(out);
    setIsAnimating(true);
    setShowSlots(false);

    const t1 = window.setTimeout(() => setShowSlots(true), 900);
    const t2 = window.setTimeout(() => {
      setResults(out);
      setPending(null);
      setIsAnimating(false);
      setShowSlots(false);
    }, 1500);

    void t1;
    void t2;
}
  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1200);
  }

  async function copy(text: string, msg = "복사 완료!") {
    try {
      await navigator.clipboard.writeText(text);
      showToast(msg);
    } catch {
      showToast("복사에 실패했어요. 다시 시도해주세요.");
    }
  }

  function saveThisWeek(numbers: number[]) {
    const key = `saved:${drawPeriodIdKst()}`;
    window.localStorage.setItem(key, JSON.stringify({ numbers, savedAt: Date.now() }));
    showToast("이번주 번호 저장 완료!");
  }

  return (
    <>
      {toast && (
        <div className="fixed bottom-4 left-0 right-0 z-[60] flex justify-center px-4">
          <div className="rounded-full border border-zinc-800 bg-zinc-950/90 px-4 py-2 text-sm text-zinc-100 shadow">
            {toast}
          </div>
        </div>
      )}

      {isAnimating && pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            <div className="relative">
              <Image
                src="/saju-book-illustration.svg"
                alt="사주책 일러스트"
                width={1200}
                height={700}
                className="h-64 w-full object-cover"
                priority
              />

              <div className="pointer-events-none absolute inset-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 top-10 h-44 w-60 -translate-x-1/2 rounded-lg border border-amber-200/20 bg-amber-50/10"
                    style={{
                      transformOrigin: "left center",
                      animation: `saju-page-flip 300ms ease-out ${i * 120}ms forwards`,
                    }}
                  />
                ))}
              </div>

              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center">
                {showSlots ? (
                  <div className="flex flex-wrap justify-center gap-2" style={{ animation: "saju-pop 180ms ease-out" }}>
                    {pending[0].numbers.map((n) => (
                      <SlotNumber key={n} n={n} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300">
                    이번주 기운 보는 중… 페이지를 넘기는 중…
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-zinc-500">
              <div>이번주 운명 조합 소환 중</div>
              <button
                onClick={() => {
                  setIsAnimating(false);
                  setPending(null);
                  setShowSlots(false);
                }}
                className="rounded-md border border-zinc-800 px-2 py-1 text-zinc-200 hover:bg-zinc-900"
              >
                스킵
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-xl px-5 py-10">

        <div className="mb-6">
          {variant === "home" ? (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">사주로또완전정복</h1>
              <p className="mt-2 text-sm text-zinc-400">
                <span className="italic">사주의 음양오행과 대운에 기반한 운명의 숫자 조합을 만들어드립니다.</span>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">{drawNo}회 로또 운명 숫자</h1>
              <p className="mt-2 text-sm text-zinc-400">
                <span className="italic">이번주 발표 전까지 동일하게 유지되는 ‘당신 전용’ 숫자 조합입니다.</span>
              </p>
            </>
          )}
        </div>

        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-zinc-400">
          <li>같은 사주를 입력하면 이번 주 추첨결과가 나오기 전 까지 같은 숫자 조합이 나옵니다.</li>
          <li>사용자가 입력한 데이터(생년월일시/이니셜)는 서버에 저장되지 않습니다.</li>
          <li>
            1회차부터 <b className="text-zinc-300">{winnersData.latest ?? "최근"}회차</b>까지 역대 당첨 조합은 추천에서 제외됩니다.
          </li>
        </ul>

        <div className="mt-8 space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm text-zinc-300">생년월일</div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="min-w-[12rem] flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100"
                />

                <select
                  value={ampm}
                  onChange={(e) => setAmpm(e.target.value as "" | "AM" | "PM")}
                  className="w-24 flex-none rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-2 text-zinc-100"
                  aria-label="시간 AM/PM(옵션)"
                >
                  <option value="">시간</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>

                <select
                  value={hour12}
                  onChange={(e) => setHour12(e.target.value ? Number(e.target.value) : "")}
                  disabled={!ampm}
                  className="w-20 flex-none rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-2 text-zinc-100 disabled:opacity-50"
                  aria-label="시간(시, 옵션)"
                >
                  <option value="">시</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-[11px] text-zinc-500">시간은 옵션(선택사항)입니다.</div>
            </div>

            <label className="space-y-2">
              <div className="text-sm text-zinc-300">영문 이니셜</div>
              <input
                placeholder="ex. LJH"
                value={initials}
                onChange={(e) => setInitials(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              onClick={() => generate(1)}
              disabled={isAnimating}
              className="w-full rounded-lg bg-zinc-100 px-4 py-2 font-medium text-zinc-950 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              운명 숫자 조합 1개 받기
            </button>
            <button
              onClick={() => generate(5)}
              disabled={isAnimating}
              className="w-full rounded-lg bg-zinc-100 px-4 py-2 font-medium text-zinc-950 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              운명 숫자 조합 5개 받기
            </button>
          </div>

          <div className="text-[11px] text-zinc-500">
            {drawCutoffLabelKst()} · 같은 입력이면 번호는 고정!
          </div>
        </div>

        {results && (
          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-zinc-400">이번주 당신의 사주 기운 추천 조합</div>
                <div className="mt-0.5 text-[11px] text-zinc-500">{drawCutoffLabelKst()}</div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() =>
                    void copy(
                      results.map((r) => r.numbers.join(", ")).join("\n"),
                      "전체 번호 복사 완료!"
                    )
                  }
                  className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-900"
                >
                  전체 복사
                </button>
                <button
                  onClick={() => {
                    saveThisWeek(results[0].numbers);
                  }}
                  className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-900"
                >
                  이번주 번호 저장
                </button>
                <button
                  onClick={() => void copy(window.location.href, "공유 링크 복사 완료!")}
                  className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-900"
                >
                  공유 링크 복사
                </button>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              {results.map((r, idx) => (
                <div key={`${r.key}-${idx}`} className="flex flex-wrap gap-2">
                  {results.length > 1 && <div className="w-full text-xs text-zinc-500">#{idx + 1}</div>}
                  {r.numbers.map((n) => (
                    <span
                      key={`${idx}-${n}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-lg font-semibold"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-1 text-xs text-zinc-500">
              <div>
                key: <span className="font-mono text-zinc-400">{results[0]?.key}</span>
              </div>
              <div>
                seed: <span className="font-mono text-zinc-400">{results[0]?.seed}</span>
              </div>
              <div>
                timestamp: <span className="font-mono text-zinc-400">{results[0]?.timestamp}</span>
              </div>
              <div>
                과거 1등 조합 제외: <b className="text-zinc-300">ON</b>
              </div>
            </div>
          </div>
        )}

        {variant === "home" && (
          <div className="mt-8 space-y-3 text-xs text-zinc-500">
            <p>입력한 정보는 브라우저에서만 사용되며 서버로 전송/저장하지 않습니다.</p>

            <a
              href="https://www.dhlottery.co.kr/"
              target="_blank"
              rel="noreferrer"
              className="mx-auto flex w-full max-w-xs items-center justify-center rounded-xl bg-white px-5 py-3 text-base font-semibold text-black hover:bg-zinc-100"
            >
              로또 사러가기
            </a>

            <div className="text-[11px] text-zinc-500">
              <a href="/lotto-number-recommendation" className="underline underline-offset-4 hover:text-zinc-300">
                사주 기반 로또 번호 추천
              </a>
              <span className="mx-2 text-zinc-700">·</span>
              <a href="/how-it-works" className="underline underline-offset-4 hover:text-zinc-300">
                작동 원리
              </a>
              <span className="mx-2 text-zinc-700">·</span>
              <a href="/faq" className="underline underline-offset-4 hover:text-zinc-300">
                FAQ
              </a>
              <span className="mx-2 text-zinc-700">·</span>
              <a href="/privacy" className="underline underline-offset-4 hover:text-zinc-300">
                개인정보처리방침
              </a>
              <span className="mx-2 text-zinc-700">·</span>
              <a href="/contact" className="underline underline-offset-4 hover:text-zinc-300">
                문의
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
