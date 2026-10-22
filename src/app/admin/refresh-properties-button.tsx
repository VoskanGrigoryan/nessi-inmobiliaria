"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";

export function RefreshPropertiesButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => router.refresh())}
      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 border border-navy/15 px-4 py-3 text-sm text-navy hover:border-gold disabled:cursor-wait disabled:opacity-60 sm:w-auto"
    >
      <Icon name="refresh" className={`size-4 ${isPending ? "animate-spin" : ""}`} />
      {isPending ? "Actualizando…" : "Actualizar"}
    </button>
  );
}
