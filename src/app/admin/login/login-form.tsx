"use client";

import { useActionState, useState } from "react";
import { login, type LoginState } from "@/app/admin/actions";
import { Icon } from "@/components/icon";
import { Button } from "@/components/button";

const errors: Record<NonNullable<LoginState["error"]>, string> = {
  setup: "Falta configurar Supabase. Consultá el README.",
  invalid: "El email o la contraseña no son correctos.",
  unauthorized: "La cuenta no tiene permisos de administración.",
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, {});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [dismissedState, setDismissedState] = useState<LoginState | null>(null);

  const currentError = state.error === "setup" || dismissedState !== state ? state.error : undefined;

  return (
    <>
      {currentError && <p role="alert" className={`mt-5 border p-3 text-sm ${currentError === "setup" ? "border-gold/30 bg-sand/30 text-navy" : "border-red-200 bg-red-50 text-red-800"}`}>{errors[currentError]}</p>}
      <form action={formAction} onChange={() => setDismissedState(state)} className="mt-7 space-y-4">
        <label className="block text-xs font-medium text-slate">Email
          <input required type="email" name="email" autoComplete="username" className="mt-2 h-12 w-full border border-navy/15 bg-white px-3 text-sm text-navy outline-none focus:border-gold" />
        </label>
        <label className="block text-xs font-medium text-slate">Contraseña
          <span className="relative mt-2 block">
            <input required type={passwordVisible ? "text" : "password"} name="password" autoComplete="current-password" className="h-12 w-full border border-navy/15 bg-white px-3 pr-12 text-sm text-navy outline-none focus:border-gold" />
            <Button
              variant="custom"
              type="button"
              aria-label={passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={passwordVisible}
              onClick={() => setPasswordVisible((visible) => !visible)}
              className="absolute inset-y-0 right-0 grid w-12 cursor-pointer place-items-center text-slate transition-colors hover:text-navy focus-visible:outline-2 focus-visible:outline-gold"
            >
              <Icon name={passwordVisible ? "eyeOff" : "eye"} className="size-5" />
            </Button>
          </span>
        </label>
        <Button type="submit" variant="primary" disabled={pending} aria-busy={pending} className="w-full disabled:cursor-wait disabled:opacity-70">
          {pending && <Icon name="refresh" className="size-4 animate-spin" />}
          {pending ? "Ingresando…" : "Ingresar"}
        </Button>
      </form>
    </>
  );
}
