"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { useAdminStatus } from "@/components/site-header-auth";

export function PropertyAdminEditLink({ propertyId }: { propertyId: string }) {
  if (!useAdminStatus()) return null;

  return (
    <Link href={`/admin/propiedades/${propertyId}/editar`} className="inline-flex cursor-pointer items-center gap-2 border border-navy/15 px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:border-gold hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
      <Icon name="edit" className="size-4" />Editar propiedad
    </Link>
  );
}
