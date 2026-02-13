import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "작동 원리",
  alternates: { canonical: "https://www.645sajunumber.com/how-it-works" },
  openGraph: { url: "https://www.645sajunumber.com/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">작동 원리</h1>
          <Link href="/" className="text-sm text-zinc-300 underline underline-offset-4">
            홈으로
          </Link>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-6 text-zinc-300">
          <p>
            이 사이트는 <b>로또 번호 추천 생성기</b>입니다. 입력한 정보(생년월일/선택 시 시간/이니셜)와 번호를 생성한 시각을
            조합해 하나의 seed(시드)를 만들고, 그 시드로부터 번호 조합을 생성합니다.
          </p>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-zinc-100">1) 입력값 → 시드(seed) 생성</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>생년월일(필수)</li>
              <li>시간(옵션: AM/PM + 시)</li>
              <li>영문 이니셜(필수)</li>
              <li>생성 시각(자동)</li>
            </ul>
            <p className="text-xs text-zinc-500">동일한 입력이라도 생성 시각이 달라질 수 있습니다.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-zinc-100">2) 1~45 중 6개를 고르고 정렬</h2>
            <p>
              1~45 사이의 숫자 중 생년월일시와 상생이 되는 수를 추가하고 상극이 되는 수를 제외하여 1~45 범위에서 중복 없이 6개를
              선택합니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-zinc-100">3) 과거 1등 조합 제외(리롤)</h2>
            <p>생성된 6개 조합이 과거 1등 당첨 조합과 동일하면 다시 생성합니다(횟수 제한 내에서 반복).</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-zinc-100">주의</h2>
            <p>로또는 확률 게임이며, 이 사이트의 결과는 당첨을 보장하지 않습니다. 재미/참고용으로 사용해주세요.</p>
          </section>

          <div className="pt-2">
            <Link href="/faq" className="text-sm text-zinc-300 underline underline-offset-4">
              FAQ 보기
            </Link>
            <span className="mx-2 text-zinc-700">·</span>
            <Link href="/privacy" className="text-sm text-zinc-300 underline underline-offset-4">
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
