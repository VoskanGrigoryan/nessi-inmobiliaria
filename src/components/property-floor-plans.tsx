"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";

export function PropertyFloorPlans({ plans, title }: { plans: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = activeIndex !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeIndex !== null && dialog && !dialog.open) dialog.showModal();
    if (activeIndex === null && dialog?.open) dialog.close();
  }, [activeIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const bodyOverflow = document.body.style.overflow;
    const documentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = documentOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (activeIndex === null || plans.length < 2) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((current) => current === null ? null : (current - 1 + plans.length) % plans.length);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((current) => current === null ? null : (current + 1) % plans.length);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, plans.length]);

  if (!plans.length) return null;

  function movePlan(direction: -1 | 1) {
    setActiveIndex((current) => current === null ? null : (current + direction + plans.length) % plans.length);
  }

  return (
    <>
      <section className="mt-8 border-t border-navy/10 pt-8" aria-labelledby="property-floor-plans-title">
        <h2 id="property-floor-plans-title" className="font-editorial text-2xl text-navy">Planos</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Button
              key={plan}
              variant="custom"
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ampliar plano ${index + 1} de ${title}`}
              className="group border border-navy/10 bg-white p-2 text-left transition-colors hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <span className="relative block aspect-[4/3] bg-paper">
                <Image
                  src={plan}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain p-2"
                />
              </span>
              <span className="block px-1 pb-1 pt-3 text-sm font-medium text-navy">Plano {index + 1} <span className="font-normal text-muted">· Ver ampliado</span></span>
            </Button>
          ))}
        </div>
      </section>

      <dialog
        ref={dialogRef}
        aria-label={`Planos de ${title}`}
        onClose={() => setActiveIndex(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-white backdrop:bg-navy/35 backdrop:backdrop-blur-md"
      >
        {activeIndex !== null && (
          <div className="relative flex h-full items-center justify-center p-5 sm:p-12">
            <div className="relative h-[78vh] w-full bg-navy/10">
              <Image
                key={activeIndex}
                src={plans[activeIndex]}
                alt={`Plano ${activeIndex + 1} de ${title}`}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <Button variant="custom" type="button" aria-label="Cerrar planos" onClick={() => dialogRef.current?.close()} className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white">
              <Icon name="close" className="size-6" />
            </Button>
            {plans.length > 1 && (
              <>
                <Button variant="custom" type="button" aria-label="Plano anterior" onClick={() => movePlan(-1)} className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white sm:left-5">
                  <Icon name="previous" className="size-6" />
                </Button>
                <Button variant="custom" type="button" aria-label="Plano siguiente" onClick={() => movePlan(1)} className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white sm:right-5">
                  <Icon name="next" className="size-6" />
                </Button>
              </>
            )}
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/80">
              {activeIndex + 1} / {plans.length}
            </p>
          </div>
        )}
      </dialog>
    </>
  );
}
