"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { Button } from "@/components/button";

export function RefreshPropertiesButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => router.refresh())}
      className="w-full px-4 py-3 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
    >
      <Icon name="refresh" className={`size-4 ${isPending ? "animate-spin" : ""}`} />
      {isPending ? "Actualizando…" : "Actualizar"}
    </Button>
  );
}
