"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { Category, Vet } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { btnPrimary, inputBase } from "@/components/ui";
import { CatFace } from "@/components/icons/CatArt";
import { Check } from "@/components/icons/Ico";
import { won } from "@/lib/format";

export function ConsultForm({
  vet,
  categories,
}: {
  vet: Vet;
  categories: Category[];
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [guardian, setGuardian] = useState("");
  const [contact, setContact] = useState("");
  const [catName, setCatName] = useState("");
  const [catAge, setCatAge] = useState("");
  const [condition, setCondition] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setChecked(true);
      if (data.user) {
        setGuardian(
          (data.user.user_metadata?.name as string | undefined) ??
            data.user.email?.split("@")[0] ??
            "",
        );
        setContact(data.user.email ?? "");
      }
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!catName.trim()) return setError("고양이 이름을 적어주세요.");
    if (message.trim().length < 15)
      return setError("상담 내용을 15자 이상 조금 더 자세히 적어주세요.");

    setBusy(true);
    const supabase = createClient();
    const { error: err } = await supabase.from("consultations").insert({
      user_id: user!.id,
      vet_id: vet.id,
      guardian: guardian.trim(),
      contact: contact.trim(),
      cat_name: catName.trim(),
      cat_age: catAge.trim() || null,
      condition: condition || null,
      message: message.trim(),
    });
    setBusy(false);

    if (err) {
      setError("상담 신청에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    setDone(true);
  }

  if (!checked) {
    return <div className="h-64 animate-pulse rounded-[24px] bg-cream-deep" />;
  }

  if (!user) {
    return (
      <div className="rounded-[24px] border border-line bg-surface p-7 text-center">
        <CatFace fur="cream" mood="curious" size={84} className="mx-auto" />
        <p className="mt-4 text-[16px] font-extrabold">
          상담은 로그인 후 신청할 수 있어요
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
          답변을 안전하게 전달드리기 위해 로그인이 필요합니다.
        </p>
        <Link
          href={`/login?redirect=/vets/${vet.slug}`}
          className={btnPrimary + " mt-6"}
        >
          로그인하고 상담 신청
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-[24px] border border-sage/30 bg-sage-soft/50 p-7 text-center">
        <div className="relative mx-auto w-fit">
          <CatFace fur="sage" mood="happy" size={92} />
          <span className="absolute -right-1 bottom-0 grid h-8 w-8 place-items-center rounded-full bg-sage text-white">
            <Check size={18} strokeWidth={3} />
          </span>
        </div>
        <p className="mt-4 text-[17px] font-extrabold">상담 신청이 접수됐어요</p>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">
          {vet.name} 수의사가 영업일 기준 1~2일 안에 답변드립니다.
          <br />
          답변이 준비되면 남겨주신 연락처로 알려드릴게요.
        </p>
        <button
          type="button"
          onClick={() => router.push("/vets")}
          className={btnPrimary + " mt-6"}
        >
          다른 수의사 보기
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[24px] border border-line bg-surface p-6 sm:p-7"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[17px] font-extrabold">상담 신청하기</h3>
        <span className="text-[13px] font-bold text-primary">
          {vet.consult_fee === 0 ? "무료" : won(vet.consult_fee)}
        </span>
      </div>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">
        적어주신 내용이 자세할수록 답변도 구체적이 됩니다. 지금 먹는 사료와
        최근 검사 수치가 있다면 함께 적어주세요.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="보호자 이름">
          <input
            className={inputBase}
            value={guardian}
            onChange={(e) => setGuardian(e.target.value)}
            placeholder="김집사"
          />
        </Field>
        <Field label="연락받을 곳">
          <input
            className={inputBase}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="이메일 또는 휴대폰"
          />
        </Field>
        <Field label="고양이 이름" required>
          <input
            className={inputBase}
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="보리"
          />
        </Field>
        <Field label="나이">
          <input
            className={inputBase}
            value={catAge}
            onChange={(e) => setCatAge(e.target.value)}
            placeholder="12살 3개월"
          />
        </Field>
        <Field label="진단명 · 걱정되는 부분" className="sm:col-span-2">
          <select
            className={inputBase}
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="">선택 안 함</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
            <option value="아직 진단 전">아직 진단 전이에요</option>
            <option value="기타">기타</option>
          </select>
        </Field>
        <Field label="상담 내용" required className="sm:col-span-2">
          <textarea
            className={inputBase + " min-h-[140px] resize-y"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              "예) 12살 보리가 신부전 3기 진단을 받았어요. 처방식으로 바꾸라고 하셨는데 두 종류를 시도했는데 다 거부합니다. 지금은 원래 먹던 사료에 습식을 섞어 주고 있는데 이대로 괜찮을까요? 최근 크레아티닌 2.8, BUN 42였습니다."
            }
          />
        </Field>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl bg-primary-soft px-4 py-3 text-[12.5px] text-primary-deep">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy || !vet.consult_open}
        className={btnPrimary + " mt-5 w-full"}
      >
        {!vet.consult_open
          ? "지금은 상담을 받지 않습니다"
          : busy
            ? "보내는 중…"
            : `${vet.name} 수의사에게 상담 신청`}
      </button>

      <p className="mt-4 text-[11.5px] leading-relaxed text-ink-faint">
        온라인 상담은 검사·진찰 없이 이루어지므로 진단을 대신할 수 없습니다.
        호흡 곤란, 반복 구토, 배뇨 곤란 같은 응급 증상은 즉시 병원에 가주세요.
        이 사이트는 데모이며 실제 답변이 발송되지는 않습니다.
      </p>
    </form>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={"block " + className}>
      <span className="mb-1.5 block text-[12.5px] font-bold">
        {label}
        {required ? <span className="ml-1 text-primary">*</span> : null}
      </span>
      {children}
    </label>
  );
}
