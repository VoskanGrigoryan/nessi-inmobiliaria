import Link from "next/link";
import { Icon } from "@/components/icon";

export function BackLink({ href, label, className = "" }: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex h-10 items-center gap-2 rounded-md border border-navy/10 bg-white px-3 text-sm font-medium text-slate transition-colors hover:border-gold/50 hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${className}`}
    >
      <Icon name="back" className="size-4 text-gold transition-transform group-hover:-translate-x-0.5" />
      {label}
    </Link>
  );
}
