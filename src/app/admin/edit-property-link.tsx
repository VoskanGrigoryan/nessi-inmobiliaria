"use client";

import Link, { useLinkStatus } from "next/link";
import { Icon } from "@/components/icon";

function EditLinkIcon() {
  const { pending } = useLinkStatus();

  return (
    <>
      <Icon name={pending ? "refresh" : "edit"} className={`size-4 ${pending ? "animate-spin" : ""}`} />
      {pending && <span className="sr-only" role="status">Abriendo edición...</span>}
    </>
  );
}

function ViewLinkStatus() {
  const { pending } = useLinkStatus();
  if (!pending) return null;

  return (
    <>
      <Icon name="refresh" className="ml-1 inline size-3.5 animate-spin" />
      <span className="sr-only" role="status">Abriendo propiedad...</span>
    </>
  );
}

export function ViewPropertyLink({ href, title }: { href: string; title: string }) {
  return (
    <Link href={href} title="Ver en el sitio" className="cursor-pointer decoration-gold underline-offset-4 hover:underline focus-visible:underline">
      {title}<ViewLinkStatus />
    </Link>
  );
}

export function EditPropertyLink({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      aria-label={`Editar ${title}`}
      title="Editar"
      className="inline-flex size-9 cursor-pointer items-center justify-center rounded border border-navy/15 text-navy transition-colors hover:border-gold hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
    >
      <EditLinkIcon />
    </Link>
  );
}
