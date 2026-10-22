"use client";

import { useFormStatus } from "react-dom";
import { logout } from "@/app/admin/actions";
import { Icon } from "@/components/icon";

function LogoutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} className="inline-flex w-full cursor-pointer items-center justify-center gap-2 border border-navy/15 px-4 py-3 text-sm text-navy hover:border-gold disabled:cursor-wait disabled:opacity-60 sm:w-auto">
      <Icon name={pending ? "refresh" : "logout"} className={`size-4 ${pending ? "animate-spin" : ""}`} />
      {pending ? "Cerrando sesión…" : "Cerrar sesión"}
    </button>
  );
}

export function LogoutButton() {
  return <form action={logout} className="w-full sm:w-auto"><LogoutSubmitButton /></form>;
}
