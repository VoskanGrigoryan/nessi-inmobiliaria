"use client";

import { deleteProperty } from "@/app/admin/actions";

export function DeletePropertyForm({ id }: { id: string }) {
  return (
    <form action={deleteProperty} onSubmit={(event) => {
      if (!window.confirm("¿Eliminar esta propiedad y sus fotos?")) event.preventDefault();
    }}>
      <input type="hidden" name="id" value={id} />
      <button className="text-red-700 underline">Eliminar</button>
    </form>
  );
}
