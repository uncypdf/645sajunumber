import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "사주 기반 로또 번호 추천",
  alternates: { canonical: "https://www.645sajunumber.com/lotto-number-recommendation" },
  openGraph: { url: "https://www.645sajunumber.com/lotto-number-recommendation" },
};

export default function LottoNumberRecommendationPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">사주 기반 로또 번호 추천</h1>
          <Link href="/" className="text-sm text-zinc-300 underline underline-offset-4">
            홈으로
          </Link>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-7 text-zinc-300">
          <p>
            어떤 날은 이유 없이 끌리는 숫자가 있고, 어떤 날은 괜히 피하고 싶은 숫자가 있습니다. 이 사이트는
            <b> 생년월일(선택 시 시간)</b>과 <b>이니셜</b>을 바탕으로, 그날의 흐름에 어울리는 번호 조합을 만들어 드리는
            <b> 사주 기반 운명 로또번호 생성기</b>입니다.
          </p>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-zinc-100">생년월일 로또 번호 추천, 왜들 찾을까?</h2>
            <p>
              로또는 결국 확률 게임이지만, 사람은 ‘나만의 기준’을 갖고 싶어합니다. 생년월일은 가장 개인적인 정보 중 하나라서,
              여기에 의미를 부여하면 번호 선택이 조금 더 납득 가능해지고 재미도 생기죠.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-zinc-100">이 사이트는 어떤 방식으로 추천하나요?</h2>
            <p>
              입력한 생년월일(및 선택한 시간)과 이니시셜을 바탕으로 ‘오늘의 흐름’을 만드는 시드(seed)를 만들고, 1~45 범위에서
              중복 없이 6개 숫자를 선택합니다. 또한 <b>과거 1등 당첨 조합과 동일한 조합은 제외</b>하여 같은 조합이 반복되는 느낌을
              줄였습니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-zinc-100">주의: 당첨을 보장하지 않습니다</h2>
            <p>이 페이지와 생성 결과는 재미/참고용이며, 당첨을 보장하지 않습니다.</p>
          </section>

          <div className="pt-2 text-sm text-zinc-300">
            <Link href="/" className="underline underline-offset-4">
              지금 번호 생성하러 가기
            </Link>
            <span className="mx-2 text-zinc-700">·</span>
            <Link href="/how-it-works" className="underline underline-offset-4">
              작동 원리
            </Link>
            <span className="mx-2 text-zinc-700">·</span>
            <Link href="/faq" className="underline underline-offset-4">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
