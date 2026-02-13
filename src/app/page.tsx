import type { Metadata } from "next";
import AdsenseHome from "@/components/AdsenseHome";
import NumberGenerator from "@/components/NumberGenerator";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.645sajunumber.com/",
  },
  openGraph: {
    url: "https://www.645sajunumber.com/",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/*
        Static (server-rendered) content block for AdSense reviewers/crawlers.
        Keeps meaningful publisher content visible even before any client-side hydration.
      */}
      <section className="mx-auto max-w-xl px-5 pt-10">
        <h1 className="text-2xl font-semibold tracking-tight">645사주넘버</h1>
        <p className="mt-2 text-sm text-zinc-400">
          생년월일(선택: 태어난 시간)과 영문 이니셜을 기반으로 이번 주 로또 번호 조합을 추천합니다. 입력값은 브라우저에서만
          처리되며 서버에 저장하지 않습니다.
        </p>
        <div className="mt-3 text-xs text-zinc-500">
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
      </section>

      <NumberGenerator variant="home" drawNo={914} />

      {/* Extra publisher content (helps AdSense + indexing) */}
      <section className="mx-auto mt-10 max-w-xl px-5 text-sm leading-7 text-zinc-300">
        <h2 className="text-base font-semibold text-zinc-100">이 사이트는 무엇인가요?</h2>
        <p className="mt-2">
          645사주넘버는 생년월일(선택: 태어난 시간)과 영문 이니셜을 바탕으로 1~45 범위에서 중복 없이 6개 숫자를 추천합니다.
          입력값은 브라우저에서만 처리되며, 원칙적으로 서버에 저장하지 않습니다.
        </p>
        <h2 className="mt-6 text-base font-semibold text-zinc-100">주의</h2>
        <p className="mt-2">
          로또는 확률 게임이며, 이 사이트의 결과는 당첨을 보장하지 않습니다. 재미/참고용으로 이용해주세요.
        </p>
        <div className="mt-4 text-xs text-zinc-500">
          <a href="/how-it-works" className="underline underline-offset-4 hover:text-zinc-300">작동 원리</a>
          <span className="mx-2 text-zinc-700">·</span>
          <a href="/lotto-number-recommendation" className="underline underline-offset-4 hover:text-zinc-300">사주 기반 로또 번호 추천</a>
          <span className="mx-2 text-zinc-700">·</span>
          <a href="/faq" className="underline underline-offset-4 hover:text-zinc-300">FAQ</a>
        </div>
      </section>

      <AdsenseHome />
    </main>
  );
}
