import { Icon } from "@/components/icon";

export default function Loading() {
  return (
    <main role="status" aria-live="polite" className="flex min-h-[60vh] flex-1 items-center justify-center">
      <span className="inline-flex items-center gap-3 text-sm text-slate">
        <Icon name="refresh" className="size-5 animate-spin text-gold" />
        Cargando…
      </span>
    </main>
  );
}
