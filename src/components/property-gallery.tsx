"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = activeIndex !== null;
  const activeImage = activeIndex === null ? null : images[activeIndex];

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
    if (activeIndex === null) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((current) => current === null ? null : (current - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((current) => current === null ? null : (current + 1) % images.length);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, images.length]);

  function showImage(index: number) {
    setActiveIndex(index);
  }

  function moveImage(direction: -1 | 1) {
    setActiveIndex((current) => current === null ? null : (current + direction + images.length) % images.length);
  }

  return (
    <>
      <div className={`grid gap-3 overflow-hidden sm:rounded-sm ${images.length > 1 ? "sm:grid-cols-[1.6fr_1fr]" : ""}`}>
        <button
          type="button"
          aria-label={`Ampliar foto 1 de ${title}`}
          onClick={() => showImage(0)}
          className={`group relative block w-full cursor-zoom-in overflow-hidden bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${images.length > 1 ? "aspect-[1.45] sm:aspect-auto sm:min-h-[420px]" : "mx-auto aspect-[1.45] sm:aspect-[1.7] sm:max-w-5xl"}`}
        >
          <Image src={images[0]} alt={title} fill priority sizes="(max-width: 640px) 100vw, 65vw" className={`${images.length > 1 ? "object-cover" : "object-contain"} transition-transform duration-500 group-hover:scale-[1.03]`} />
          <span aria-hidden="true" className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-navy/75 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
            <Icon name="expand" className="size-4" />
          </span>
        </button>

        {images.length > 1 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
            {images.slice(1, 3).map((image, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Ampliar foto ${index + 2} de ${title}`}
                onClick={() => showImage(index + 1)}
                className="group relative block aspect-[1.5] w-full cursor-zoom-in overflow-hidden bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:aspect-auto sm:min-h-[204px]"
              >
                <Image src={image} alt={`${title}, foto ${index + 2}`} fill sizes="(max-width: 640px) 50vw, 35vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <span aria-hidden="true" className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-navy/75 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                  <Icon name="expand" className="size-4" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={`Galería de ${title}`}
        onCancel={(event) => {
          event.preventDefault();
          dialogRef.current?.close();
        }}
        onClose={() => setActiveIndex(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-white backdrop:bg-navy/35 backdrop:backdrop-blur-md"
      >
        {activeImage && (
          <div className="relative flex h-full items-center justify-center p-5 sm:p-12">
            <div className="relative h-[78vh] w-full">
              <Image src={activeImage} alt={`${title}, foto ${(activeIndex ?? 0) + 1}`} fill priority sizes="100vw" className="object-contain" />
            </div>

            <button type="button" aria-label="Cerrar galería" onClick={() => dialogRef.current?.close()} className="absolute right-4 top-4 z-10 grid size-11 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <Icon name="close" className="size-6" />
            </button>
            {images.length > 1 && (
              <>
                <button type="button" aria-label="Foto anterior" onClick={() => moveImage(-1)} className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-5">
                  <Icon name="previous" className="size-6" />
                </button>
                <button type="button" aria-label="Foto siguiente" onClick={() => moveImage(1)} className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-5">
                  <Icon name="next" className="size-6" />
                </button>
              </>
            )}
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/80">
              {(activeIndex ?? 0) + 1} / {images.length}
            </p>
          </div>
        )}
      </dialog>
    </>
  );
}
