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
