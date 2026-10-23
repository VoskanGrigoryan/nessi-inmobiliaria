"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/button";

export function CopyPropertyLink({ href, title, disabled = false }: { href: string; title: string; disabled?: boolean }) {
  const [feedback, setFeedback] = useState<"copied" | "error" | null>(null);
  const buttonTitle = disabled
    ? "Publicá esta propiedad para copiar el enlace"
    : feedback === "copied"
      ? "Enlace copiado"
      : feedback === "error"
        ? "No se pudo copiar el enlace"
        : "Copiar enlace";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(new URL(href, window.location.origin).toString());
      setFeedback("copied");
    } catch {
      setFeedback("error");
    }

    window.setTimeout(() => setFeedback(null), 2000);
  }

  return (
    <Button
      variant="custom"
      type="button"
      disabled={disabled}
      onClick={copyLink}
      aria-label={disabled ? `Enlace de ${title} disponible cuando se publique` : feedback === "copied" ? "Enlace copiado" : `Copiar enlace de ${title}`}
      title={buttonTitle}
      className="inline-flex size-9 cursor-pointer items-center justify-center rounded border border-navy/15 text-navy transition-colors hover:border-gold hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon name={feedback === "copied" ? "check" : "copy"} className="size-4" />
      {feedback && <span className="sr-only" role="status">{feedback === "copied" ? "Enlace copiado" : "No se pudo copiar el enlace"}</span>}
    </Button>
  );
}
