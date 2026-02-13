import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  alternates: { canonical: "https://www.645sajunumber.com/privacy" },
  openGraph: { url: "https://www.645sajunumber.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">개인정보처리방침</h1>
          <Link href="/" className="text-sm text-zinc-300 underline underline-offset-4">
            홈으로
          </Link>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-6 text-zinc-300">
          <p>본 사이트(645sajunumber.com, 이하 “사이트”)는 로또 번호 조합 생성 서비스를 제공합니다.</p>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-zinc-100">1. 수집하는 정보</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                사용자가 입력하는 <b>생년월일/시간/이니셜</b>은 추천 번호 생성에 사용되며, 원칙적으로 <b>별도로 저장하지 않습니다</b>.
              </li>
              <li>
                서비스 품질 개선 및 통계 목적을 위해, 사용자가 생성한 <b>로또 번호 조합(6개 숫자)</b>은 개인을 식별할 수 없는 형태로
                저장될 수 있습니다.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-zinc-100">2. 쿠키 및 광고</h2>
            <p>
              사이트는 Google AdSense 등 제3자 광고 서비스를 사용할 수 있으며, 광고 제공을 위해 쿠키 또는 유사한 기술이 사용될 수
              있습니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
