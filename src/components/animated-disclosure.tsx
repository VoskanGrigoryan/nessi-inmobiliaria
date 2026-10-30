"use client";

import { useState, type ReactNode } from "react";

export function AnimatedDisclosure({
  children,
  className,
  initiallyOpen = false,
  label,
}: {
  children: ReactNode;
  className?: string;
  initiallyOpen?: boolean;
  label: string;
}) {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <div className={className}>
      <button
        id="property-filters-toggle"
        type="button"
        aria-controls="property-filters-panel"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-2 py-2 text-sm font-semibold text-navy underline decoration-gold underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
      >
        {label}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className={`size-4 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        >
          <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        id="property-filters-panel"
        role="region"
        aria-labelledby="property-filters-toggle"
        aria-hidden={!open}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={`transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
