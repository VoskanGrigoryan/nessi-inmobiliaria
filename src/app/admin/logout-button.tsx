"use client";

import { useFormStatus } from "react-dom";
import { logout } from "@/app/admin/actions";
import { Icon } from "@/components/icon";
import { Button } from "@/components/button";

function LogoutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full px-4 py-3 disabled:cursor-wait disabled:opacity-60 sm:w-auto">
      <Icon name={pending ? "refresh" : "logout"} className={`size-4 ${pending ? "animate-spin" : ""}`} />
      {pending ? "Cerrando sesión…" : "Cerrar sesión"}
    </Button>
  );
}

export function LogoutButton() {
  return <form action={logout} className="w-full sm:w-auto"><LogoutSubmitButton /></form>;
}
