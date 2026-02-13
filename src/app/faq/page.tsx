import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  alternates: { canonical: "https://www.645sajunumber.com/faq" },
  openGraph: { url: "https://www.645sajunumber.com/faq" },
};

const faqs = [
  {
    q: "로또 번호 추천이 정말 도움이 되나요?",
    a: "이 사이트는 재미/참고용 번호 조합을 생성합니다. 당첨을 보장하지 않으며, 결과는 확률 게임의 특성상 무작위성과 운에 크게 좌우됩니다.",
  },
  {
    q: "사주 기반 ‘실시간 운명 반영’은 무엇을 의미하나요?",
    a: "입력한 생년월일(선택 시 시간)과 이니셜, 그리고 번호를 생성한 시각 정보를 조합해 매번 다른 시드(seed)를 만들고 번호를 생성합니다. 동일한 입력이라도 생성 시각에 따라 결과가 달라질 수 있습니다.",
  },
  {
    q: "과거 1등 당첨 조합 제외는 어떤 방식인가요?",
    a: "역대 1등 당첨 번호 조합 데이터와 비교하여, 과거에 이미 1등으로 나온 동일 조합은 다시 추천되지 않도록 재생성(리롤)합니다.",
  },
  {
    q: "사용자 정보(생년월일/이니셜)를 저장하나요?",
    a: "생년월일/시간/이니셜은 브라우저에서 번호를 생성하는 용도로 사용되며, 원칙적으로 서버에 저장하지 않습니다.",
  },
  {
    q: "그럼 서버에는 무엇을 저장하나요?",
    a: "서비스 통계 및 ‘이번 회차에 사이트 생성번호로 1등/2등이 있었는지’ 같은 공지 계산을 위해, 생성된 로또 번호 조합(6개 숫자)만 개인을 식별할 수 없는 형태로 저장될 수 있습니다.",
  },
  {
    q: "시간 입력은 왜 옵션인가요?",
    a: "시간 정보가 없어도 번호 생성이 가능하도록 했습니다. 원하면 AM/PM과 시(분 제외)를 선택해 변수를 추가할 수 있습니다.",
  },
];

export default function FaqPage() {
  // JSON-LD FAQ schema (helps search engines understand Q&A)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">FAQ</h1>
          <Link href="/" className="text-sm text-zinc-300 underline underline-offset-4">
            홈으로
          </Link>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <div className="mt-6 space-y-6 text-sm leading-6 text-zinc-300">
          {faqs.map((f) => (
            <div key={f.q} className="space-y-2">
              <h2 className="text-base font-semibold text-zinc-100">{f.q}</h2>
              <p>{f.a}</p>
            </div>
          ))}

          <div className="pt-2">
            <Link href="/how-it-works" className="text-sm text-zinc-300 underline underline-offset-4">
              작동 원리
            </Link>
            <span className="mx-2 text-zinc-700">·</span>
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
