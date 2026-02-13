import type { Metadata } from "next";
import NumberGenerator from "@/components/NumberGenerator";

export function generateMetadata({ params }: { params: { drawNo: string } }): Metadata {
  const drawNo = Number(params.drawNo);
  const safe = Number.isFinite(drawNo) ? drawNo : 0;

  const title = `${safe}회 로또 운명 숫자 | 645사주넘버`;
  const description = "이번주 당신의 사주 기운을 반영해 운명 숫자 조합을 추천합니다. 발표 전까지 동일하게 유지됩니다.";

  const url = `https://www.645sajunumber.com/draw/${safe}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  };
}

export default async function DrawPage({ params }: { params: { drawNo: string } }) {
  const drawNo = Number(params.drawNo);
  if (!Number.isFinite(drawNo) || drawNo <= 0) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-xl px-5 py-10">
          <h1 className="text-2xl font-semibold">잘못된 회차 번호</h1>
          <p className="mt-2 text-sm text-zinc-400">예: /draw/1156</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Server-rendered content block to avoid “thin/empty page” signals during review/crawling */}
      <section className="mx-auto max-w-xl px-5 pt-10">
        <h1 className="text-2xl font-semibold tracking-tight">{drawNo}회 로또 운명 숫자</h1>
        <p className="mt-2 text-sm text-zinc-400">
          이번주 발표 전까지 동일하게 유지되는 ‘당신 전용’ 숫자 조합입니다. 생년월일(선택: 태어난 시간)과 영문 이니셜을
          입력하면 브라우저에서만 계산됩니다(서버 저장 없음).
        </p>
        <div className="mt-3 text-xs text-zinc-500">
          <a href="/" className="underline underline-offset-4 hover:text-zinc-300">
            홈으로
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
        </div>
      </section>

      <NumberGenerator variant="draw" drawNo={drawNo} />
    </main>
  );
}
