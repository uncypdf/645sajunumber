import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관",
  alternates: { canonical: "https://www.645sajunumber.com/terms" },
  openGraph: { url: "https://www.645sajunumber.com/terms" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">이용약관</h1>
          <Link href="/" className="text-sm text-zinc-300 underline underline-offset-4">
            홈으로
          </Link>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-6 text-zinc-300">
          <p>
            본 약관은 645사주넘버(이하 “서비스”) 이용과 관련하여 서비스 제공자와 이용자 간의 권리·의무 및 책임사항을 규정합니다.
          </p>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-zinc-100">1. 서비스의 성격</h2>
            <p>
              본 서비스는 사용자가 입력한 정보(생년월일/선택 시 시간/이니셜)를 바탕으로 <b>재미·참고용</b> 로또 번호 조합을 생성하는
              유틸리티입니다. 당첨을 보장하지 않으며, 결과는 확률 게임의 특성상 무작위성과 운에 좌우됩니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-zinc-100">2. 책임의 제한</h2>
            <p>
              서비스 제공자는 서비스 이용으로 인해 발생한 직접/간접 손해에 대해 법령이 허용하는 범위 내에서 책임을 지지 않습니다.
              로또 구매 및 참여에 따른 모든 판단과 책임은 이용자에게 있습니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-zinc-100">3. 변경</h2>
            <p>
              서비스 제공자는 필요 시 약관 및 서비스 내용을 변경할 수 있습니다. 중요한 변경은 사이트 내 공지 또는 적절한 방식으로 안내합니다.
            </p>
          </section>

          <div className="pt-2">
            <Link href="/privacy" className="text-sm text-zinc-300 underline underline-offset-4">
              개인정보처리방침
            </Link>
            <span className="mx-2 text-zinc-700">·</span>
            <Link href="/contact" className="text-sm text-zinc-300 underline underline-offset-4">
              문의
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
