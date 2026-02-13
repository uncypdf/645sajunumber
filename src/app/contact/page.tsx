import type { Metadata } from "next";
import Link from "next/link";
import ObfuscatedEmail from "@/components/ObfuscatedEmail";

export const metadata: Metadata = {
  title: "문의",
  alternates: { canonical: "https://www.645sajunumber.com/contact" },
  openGraph: { url: "https://www.645sajunumber.com/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">문의</h1>
          <Link href="/" className="text-sm text-zinc-300 underline underline-offset-4">
            홈으로
          </Link>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-6 text-zinc-300">
          <p>문의/제휴/오류 제보는 아래 이메일로 연락 주세요.</p>

          <ObfuscatedEmail user="htmandu" domain="gmail.com" />

          <p className="text-xs text-zinc-500">
            스팸 방지를 위해 이메일을 일부 변형해 표시합니다. ‘복사’ 버튼을 누르면 정확한 주소가 복사됩니다.
          </p>

          <div className="pt-2">
            <Link href="/privacy" className="text-sm text-zinc-300 underline underline-offset-4">
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
