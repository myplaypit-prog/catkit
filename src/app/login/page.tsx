"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { btnPrimary, inputBase } from "@/components/ui";
import { Check } from "@/components/icons/Ico";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = sp.get("redirect") ?? "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!email.trim() || password.length < 6) {
      setError("이메일과 6자 이상의 비밀번호를 입력해 주세요.");
      return;
    }

    setBusy(true);
    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { name: name.trim() || undefined } },
        });
        if (err) throw err;

        // 이메일 확인이 꺼져 있으면 곧바로 세션이 생깁니다.
        if (data.session) {
          router.push(redirectTo as never);
          router.refresh();
          return;
        }
        setNotice(
          "가입 확인 메일을 보냈어요. 메일의 링크를 눌러 인증을 마치면 로그인됩니다.",
        );
        setMode("signin");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (err) throw err;
        router.push(redirectTo as never);
        router.refresh();
        return;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      setError(
        msg.includes("Invalid login credentials")
          ? "이메일 또는 비밀번호가 올바르지 않습니다."
          : msg.includes("already registered")
            ? "이미 가입된 이메일이에요. 로그인해 주세요."
            : msg || "처리 중 문제가 발생했습니다.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
      {/* 소개 */}
      <div className="order-2 lg:order-1">
        <div className="relative mx-auto max-w-[320px]">
          <Image
            src="/illustrations/cat-calico.png"
            alt="삼색 고양이 일러스트"
            width={512}
            height={512}
            className="animate-floaty w-full drop-shadow-[0_18px_28px_rgba(122,88,60,0.14)]"
          />
        </div>
        <div className="mt-8 space-y-3">
          {[
            "주문 내역과 배송 상태를 한 곳에서",
            "수의사 상담 신청과 답변 확인",
            "다음에 또 담을 처방식 기억해 두기",
          ].map((t) => (
            <p key={t} className="flex items-center gap-2.5 text-[14px] text-ink-soft">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sage-soft text-sage">
                <Check size={14} strokeWidth={3} />
              </span>
              {t}
            </p>
          ))}
        </div>
      </div>

      {/* 폼 */}
      <div className="order-1 lg:order-2">
        <h1 className="text-[28px] font-extrabold tracking-tight">
          {mode === "signin" ? "다시 오셨네요" : "무병장수에 오신 걸 환영해요"}
        </h1>
        <p className="mt-2 text-[14px] text-ink-soft">
          {mode === "signin"
            ? "주문과 상담 내역을 이어서 보려면 로그인해 주세요."
            : "이메일과 비밀번호만 있으면 바로 시작할 수 있어요."}
        </p>

        <form
          onSubmit={submit}
          className="mt-7 space-y-4 rounded-[24px] border border-line bg-surface p-6 sm:p-7"
        >
          {mode === "signup" ? (
            <label className="block">
              <span className="mb-1.5 block text-[12.5px] font-bold">
                보호자 이름
              </span>
              <input
                className={inputBase}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="김집사"
                autoComplete="name"
              />
            </label>
          ) : null}

          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-bold">이메일</span>
            <input
              className={inputBase}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-bold">비밀번호</span>
            <input
              className={inputBase}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6자 이상"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
            />
          </label>

          {error ? (
            <p className="rounded-2xl bg-primary-soft px-4 py-3 text-[12.5px] leading-relaxed text-primary-deep">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="rounded-2xl bg-sage-soft px-4 py-3 text-[12.5px] leading-relaxed text-sage">
              {notice}
            </p>
          ) : null}

          <button type="submit" disabled={busy} className={btnPrimary + " w-full"}>
            {busy
              ? "처리 중…"
              : mode === "signin"
                ? "로그인"
                : "가입하고 시작하기"}
          </button>

          <p className="text-center text-[13px] text-ink-soft">
            {mode === "signin" ? "아직 계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setNotice(null);
              }}
              className="font-bold text-primary underline underline-offset-2"
            >
              {mode === "signin" ? "회원가입" : "로그인"}
            </button>
          </p>
        </form>

        <p className="mt-4 text-center text-[11.5px] leading-relaxed text-ink-faint">
          학습·시연용 데모입니다. 실제 개인정보 대신 테스트 이메일을 사용해 주세요.
          <br />
          <Link href="/" className="underline underline-offset-2">
            로그인 없이 둘러보기
          </Link>
        </p>
      </div>
    </div>
  );
}
