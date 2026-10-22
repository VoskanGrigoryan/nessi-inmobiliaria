"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteProperty } from "@/app/admin/actions";
import { Icon } from "@/components/icon";

function ConfirmationActions({ onCancel }: { onCancel: () => void }) {
  const { pending } = useFormStatus();

  return (
    <div className="mt-6 flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={pending}
        className="cursor-pointer border border-navy/20 px-4 py-2.5 text-sm font-medium text-navy hover:bg-paper disabled:cursor-wait disabled:opacity-60"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex cursor-pointer items-center gap-2 bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-wait disabled:opacity-70"
      >
        <Icon name={pending ? "refresh" : "trash"} className={`size-4 ${pending ? "animate-spin" : ""}`} />
        {pending ? "Eliminando..." : "Eliminar propiedad"}
      </button>
    </div>
  );
}

export function DeletePropertyForm({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = `delete-property-title-${id}`;
  const descriptionId = `delete-property-description-${id}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  function closeDialog() {
    dialogRef.current?.close();
    setIsOpen(false);
  }

  return (
    <form action={deleteProperty}>
      <input type="hidden" name="id" value={id} />
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Eliminar propiedad"
        title="Eliminar"
        className="inline-flex size-9 cursor-pointer items-center justify-center rounded border border-red-200 text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
      >
        <Icon name="trash" className="size-4" />
      </button>
      <dialog
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={(event) => {
          event.preventDefault();
          setIsOpen(false);
        }}
        onClose={() => {
          setIsOpen(false);
          triggerRef.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md border-0 bg-transparent p-0 text-navy backdrop:bg-navy/50 backdrop:backdrop-blur-sm"
      >
        <div className="border border-navy/15 bg-white p-6 shadow-2xl sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-red-50 text-red-700">
              <Icon name="trash" className="size-5" />
            </span>
            <h2 id={titleId} className="font-editorial text-xl text-navy">
              ¿Eliminar esta propiedad?
            </h2>
          </div>
          <p id={descriptionId} className="mt-4 text-sm leading-6 text-slate">
            Se eliminará la propiedad y sus fotos. Esta acción no se puede deshacer.
          </p>
          <ConfirmationActions onCancel={closeDialog} />
        </div>
      </dialog>
    </form>
  );
}
