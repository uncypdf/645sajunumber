import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">페이지를 찾을 수 없습니다</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          주소가 잘못되었거나, 삭제된 페이지일 수 있습니다. 아래 링크에서 계속 탐색할 수 있습니다.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link className="underline underline-offset-4" href="/">
            홈으로
          </Link>
          <Link className="underline underline-offset-4" href="/how-it-works">
            작동 원리
          </Link>
          <Link className="underline underline-offset-4" href="/faq">
            FAQ
          </Link>
          <Link className="underline underline-offset-4" href="/lotto-number-recommendation">
            사주 기반 로또 번호 추천
          </Link>
          <Link className="underline underline-offset-4" href="/contact">
            문의
          </Link>
          <Link className="underline underline-offset-4" href="/privacy">
            개인정보처리방침
          </Link>
          <Link className="underline underline-offset-4" href="/terms">
            이용약관
          </Link>
        </div>
      </div>
    </main>
  );
}
