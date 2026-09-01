"use client";

import { useState } from "react";

function formatNumber(value: string) {
  if (!value) return "";
  return Number(value).toLocaleString("ko-KR");
}

export default function Home() {
  const [price, setPrice] = useState("");
  const [productName, setProductName] = useState("");
  const [salary, setSalary] = useState("");
  const [monthlyUses, setMonthlyUses] = useState("");
  const [useMonths, setUseMonths] = useState(12);
  const [reason, setReason] = useState<"need" | "nice" | "want">("nice");
  const [result, setResult] = useState<null | {
    verdict: string;
    emoji: string;
    message: string;
    score: number;
    burden: number;
    costPerUse: number;
  }>(null);

  function judgePurchase() {
    const p = Number(price);
    const s = Number(salary);
    const uses = Number(monthlyUses);

    if (p <= 0 || s <= 0 || uses <= 0) {
      alert("숫자를 제대로 입력해줘 👀");
      return;
    }

    const totalUses = uses * useMonths;
    const burden = (p / s) * 100;
    const costPerUse = p / totalUses;

    // 1. 감당 가능성: 최대 30점
    let affordabilityScore = 0;

    if (burden <= 3) affordabilityScore = 30;
    else if (burden <= 5) affordabilityScore = 27;
    else if (burden <= 10) affordabilityScore = 22;
    else if (burden <= 20) affordabilityScore = 15;
    else if (burden <= 30) affordabilityScore = 8;
    else affordabilityScore = 2;

    // 2. 실제 사용량: 최대 25점
    let usageScore = 0;

    if (totalUses >= 300) usageScore = 25;
    else if (totalUses >= 150) usageScore = 22;
    else if (totalUses >= 72) usageScore = 18;
    else if (totalUses >= 36) usageScore = 13;
    else if (totalUses >= 12) usageScore = 7;
    else usageScore = 2;

    // 3. 1회 사용비용: 최대 20점
    let valueScore = 0;

    if (costPerUse <= 1000) valueScore = 20;
    else if (costPerUse <= 3000) valueScore = 18;
    else if (costPerUse <= 5000) valueScore = 16;
    else if (costPerUse <= 10000) valueScore = 12;
    else if (costPerUse <= 20000) valueScore = 8;
    else if (costPerUse <= 50000) valueScore = 4;
    else valueScore = 1;

    // 4. 필요성: 최대 25점
    let necessityScore = 0;

    if (reason === "need") necessityScore = 25;
    else if (reason === "nice") necessityScore = 15;
    else necessityScore = 5;

    const score =
      affordabilityScore +
      usageScore +
      valueScore +
      necessityScore;

    let message = "";

    if (score >= 70) {
      if (reason === "need") {
        message = "필요한 데다 충분히 쓸 것 같네요. 이번 건 허락.";
      } else if (totalUses >= 150) {
        message = "갖고 싶은 건 맞는데, 이 정도로 쓸 거면 변호는 됩니다.";
      } else if (burden <= 5) {
        message = "지갑에 큰 타격도 없습니다. 이번엔 사도 됩니다.";
      } else {
        message = "비싸긴 한데, 충분히 쓸 거면 돈값은 합니다.";
      }

      setResult({
        verdict: "사도 됨",
        emoji: "🟢",
        message,
        score,
        burden,
        costPerUse,
      });
    } else if (score >= 45) {
      if (reason === "want" && burden > 20) {
        message = "필요한 것도 아닌데 월급의 이만큼을 태우겠다고요?";
      } else if (reason === "want") {
        message = "필요한 건 아니라고 직접 실토하셨습니다. 하루만 더 참아봅시다.";
      } else if (burden > 20) {
        message = "물건은 괜찮은데, 이번 달의 당신은 안 괜찮습니다.";
      } else if (totalUses < 36) {
        message = "사는 시간보다 처박아두는 시간이 더 길 것 같습니다.";
      } else if (costPerUse > 20000) {
        message = "한 번 쓸 때마다 이 돈이면, 조금 더 고민하는 게 맞습니다.";
      } else {
        message = "살 이유도 있지만, 오늘 당장 살 이유까지는 없습니다.";
      }

      setResult({
        verdict: "좀만 기다려",
        emoji: "🟡",
        message,
        score,
        burden,
        costPerUse,
      });
    } else {
      if (reason === "want" && burden > 30) {
        message = "갖고 싶었던 마음보다 카드값이 더 오래갑니다.";
      } else if (reason === "want") {
        message = "필요한 것도 아니라고 직접 실토하셨습니다. 내려놓으세요.";
      } else if (burden > 30) {
        message = "사고 나서 기뻐하는 시간보다 카드값 갚는 시간이 더 길겠죠.";
      } else if (totalUses < 12) {
        message = "사는 순간보다 서랍에 있는 시간이 더 길 것 같습니다.";
      } else if (costPerUse > 50000) {
        message = "한 번 쓸 때마다 이 가격이면 그냥 잠깐 빌리는 게 낫겠습니다.";
      } else {
        message = "장바구니에서 조용히 나오십시오.";
      }

      setResult({
        verdict: "니 주제에 이건 좀",
        emoji: "🔴",
        message,
        score,
        burden,
        costPerUse,
      });
    }
  }

  async function shareResult() {
    if (!result) return;

    const siteUrl = window.location.origin;

    const shareText = `🛑 지름신 억제기

  ${productName || "이 물건"}: ${result.emoji} ${result.verdict}

  구매 점수: ${result.score}점
  월급 대비 가격: ${result.burden.toFixed(1)}%
  1회 사용 비용: ${Math.round(result.costPerUse).toLocaleString()}원

  "${result.message}"

  너도 판정받아봐 👇
  ${siteUrl}`;

    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    try {
      if (isMobile && navigator.share) {
        await navigator.share({
          title: "지름신 억제기 판정 결과",
          text: shareText,
          url: siteUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert("판정 결과와 링크를 복사했어 📋\n카톡이나 SNS에 붙여넣어봐!");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-10">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-10 text-center">
          <div className="mb-3 text-5xl">🛑</div>

          <h1 className="text-4xl font-black tracking-tight text-zinc-900">
            지름신 억제기
          </h1>

          <p className="mt-3 text-base text-zinc-500">
            사고 싶은 건 알겠는데,
            <br />
            일단 계산부터 해보자.
          </p>
        </header>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <div className="space-y-6">

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                뭘 사려고?
              </label>

              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="예: 에어팟 프로"
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-lg text-zinc-900 placeholder:text-zinc-400 placeholder:opacity-100 outline-none transition focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                사고 싶은 물건 가격
              </label>

              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatNumber(price)}
                  onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
                  placeholder="180,000"
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-4 pr-12 text-lg text-zinc-900 placeholder:text-zinc-400 placeholder:opacity-100 outline-none transition focus:border-zinc-400"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  원
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                월급
              </label>

              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatNumber(salary)}
                  onChange={(e) => setSalary(e.target.value.replace(/\D/g, ""))}
                  placeholder="3,500,000"
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-4 pr-12 text-lg text-zinc-900 placeholder:text-zinc-400 placeholder:opacity-100 outline-none transition focus:border-zinc-400"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  원
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                한 달에 몇 번 쓸 것 같아?
              </label>

              <div className="relative">
                <input
                  type="number"
                  value={monthlyUses}
                  onChange={(e) => setMonthlyUses(e.target.value)}
                  placeholder="4"
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-4 pr-12 text-lg text-zinc-900 placeholder:text-zinc-400 placeholder:opacity-100 outline-none transition focus:border-zinc-400"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  회
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                얼마나 오래 쓸 것 같아?
              </label>

              <div className="grid grid-cols-5 gap-2">
                {[
                  { months: 3, label: "3개월" },
                  { months: 6, label: "6개월" },
                  { months: 12, label: "1년" },
                  { months: 24, label: "2년" },
                  { months: 36, label: "3년+" },
                ].map((option) => (
                  <button
                    key={option.months}
                    type="button"
                    onClick={() => setUseMonths(option.months)}
                    className={`rounded-xl py-3 text-sm font-bold transition ${
                      useMonths === option.months
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                솔직히 왜 사려고 해?
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "need", label: "🧰 꼭 필요해" },
                  { value: "nice", label: "🙂 있으면 좋아" },
                  { value: "want", label: "😈 그냥 갖고 싶어" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setReason(option.value as "need" | "nice" | "want")
                    }
                    className={`rounded-xl py-3 text-sm font-bold transition ${
                      reason === option.value
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={judgePurchase}
              className="w-full rounded-2xl bg-zinc-900 py-4 text-lg font-black text-white transition hover:bg-zinc-800"
            >
              지름신을 막아볼까? 👀
            </button>
          </div>
        </section>

        {result && (
          <section className="mt-6 rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-zinc-200">
            <div className="text-5xl">{result.emoji}</div>

            <p className="mt-3 text-sm font-bold text-zinc-400">
              구매 점수 {result.score}점
            </p>

            <h2 className="mt-2 text-3xl font-black text-zinc-900">
              {productName ? `${productName}, ${result.verdict}` : result.verdict}
            </h2>

            <p className="mt-3 text-zinc-600">{result.message}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-zinc-100 p-4">
                <p className="text-xs text-zinc-500">월급 대비 가격</p>
                <p className="mt-1 text-xl font-black">
                  {result.burden.toFixed(1)}%
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-100 p-4">
                <p className="text-xs text-zinc-500">1회 사용 비용</p>
                <p className="mt-1 text-xl font-black">
                  {Math.round(result.costPerUse).toLocaleString()}원
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={shareResult}
              className="mt-6 w-full rounded-2xl border border-zinc-200 bg-white py-3.5 text-sm font-bold text-zinc-800 transition hover:bg-zinc-50"
            >
              결과 공유하기 📤
            </button>

            <p className="mt-5 text-xs text-zinc-400">
              * 선택한 예상 사용기간을 기준으로 계산합니다.
            </p>
          </section>
        )}

        <p className="mt-6 text-center text-xs text-zinc-400">
          판단은 냉정하게. 소비는 당신 마음대로.
        </p>
      </div>
    </main>
  );
}