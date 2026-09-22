"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await createClient().auth.signOut();
        router.push("/");
        router.refresh();
      }}
      className="rounded-full border border-line-strong bg-surface px-4 py-2 text-[13px] font-semibold text-ink-soft transition hover:border-primary hover:text-primary disabled:opacity-60"
    >
      {busy ? "로그아웃 중…" : "로그아웃"}
    </button>
  );
}
