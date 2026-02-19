export async function fetchLatestLotto645DrawNo(): Promise<number | null> {
  try {
    const res = await fetch("https://www.dhlottery.co.kr/selectMainInfo.do", {
      // Revalidate hourly (server-side cache). Keeps home mostly static but updated.
      next: { revalidate: 60 * 60 },
      headers: {
        "user-agent": "Mozilla/5.0 (645sajunumber)",
      },
    });

    if (!res.ok) return null;
    const j = await res.json();

    const lt645: Array<{ ltEpsd?: number }> | undefined = j?.data?.result?.pstLtEpstInfo?.lt645;
    if (!Array.isArray(lt645) || lt645.length === 0) return null;

    const max = Math.max(
      ...lt645
        .map((x) => Number(x?.ltEpsd))
        .filter((n) => Number.isFinite(n) && n > 0)
    );

    return Number.isFinite(max) ? max : null;
  } catch {
    return null;
  }
}
