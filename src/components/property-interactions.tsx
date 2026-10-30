"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconHeart,
  IconMail,
  IconShare,
} from "@tabler/icons-react";
import { Button } from "@/components/button";
import { useAuthenticatedUserId } from "@/components/site-header-auth";
import { usePropertyFavorites } from "@/components/property-favorites";

export function PropertyInteractions({ propertyId, title, showShare = true, compact = false }: {
  propertyId?: string;
  title: string;
  showShare?: boolean;
  compact?: boolean;
}) {
  const userId = useAuthenticatedUserId();
  const { favoritePropertyIds, favoritesReady, toggleFavorite: saveFavorite } = usePropertyFavorites();
  const canFavorite = Boolean(userId && propertyId);
  const isFavorite = Boolean(propertyId && favoritePropertyIds.has(propertyId));
  const shareMenuId = useId();
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [favoriteError, setFavoriteError] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  useEffect(() => {
    if (!shareOpen) return;

    function closeOnOutsideClick(event: PointerEvent) {
      if (event.target instanceof Node && !shareMenuRef.current?.contains(event.target)) {
        setShareOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShareOpen(false);
        shareMenuRef.current?.querySelector("button")?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [shareOpen]);

  async function toggleFavorite() {
    if (!propertyId) return;
    setFavoriteError(!(await saveFavorite(propertyId)));
  }

  function share(destination: "email" | "facebook" | "whatsapp") {
    const url = window.location.href;
    const text = `${title} — ${url}`;
    setShareOpen(false);
    if (destination === "email") {
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`;
      return;
    }
    const shareUrl = destination === "facebook"
      ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    setShareOpen(false);
  }

  if (!canFavorite && !showShare) return null;

  return (
    <div className={compact ? "flex" : "flex flex-wrap items-center justify-end gap-2"}>
      {canFavorite && (
        <Button
          variant={compact ? "floating" : "outline"}
          type="button"
          onClick={toggleFavorite}
          disabled={!favoritesReady}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <IconHeart aria-hidden="true" className={`size-4 ${isFavorite ? "fill-red-600 text-red-600" : ""}`} />
          {!compact && (isFavorite ? "En favoritos" : "Agregar a favoritos")}
        </Button>
      )}
      {showShare && (
        <div className="relative" ref={shareMenuRef}>
          <Button
            type="button"
            aria-expanded={shareOpen}
            aria-controls={shareOpen ? shareMenuId : undefined}
            onClick={() => setShareOpen((open) => !open)}
          >
            <IconShare aria-hidden="true" className="size-4" />
            Compartir
            <IconChevronDown aria-hidden="true" className={`size-4 transition-transform ${shareOpen ? "rotate-180" : ""}`} />
          </Button>
          {shareOpen && (
            <div id={shareMenuId} className="absolute right-0 top-full z-50 mt-2 w-52 rounded-md border border-navy/10 bg-white p-1 shadow-lg shadow-navy/10">
              <Button variant="ghost" onClick={() => share("email")}><IconMail aria-hidden="true" className="size-4" />Correo</Button>
              <Button variant="ghost" onClick={() => share("facebook")}><IconBrandFacebook aria-hidden="true" className="size-4" />Facebook</Button>
              <Button variant="ghost" onClick={() => share("whatsapp")}><IconBrandWhatsapp aria-hidden="true" className="size-4" />WhatsApp</Button>
              <Button variant="ghost" onClick={() => void copyLink()}>
                {copyState === "copied" ? <IconCheck aria-hidden="true" className="size-4" /> : <IconCopy aria-hidden="true" className="size-4" />}
                {copyState === "copied" ? "Enlace copiado" : "Copiar enlace"}
              </Button>
            </div>
          )}
        </div>
      )}
      {(favoriteError || copyState === "error") && (
        <span role="status" className="basis-full text-xs text-red-700">
          {favoriteError ? "No se pudo actualizar favoritos." : "No se pudo copiar el enlace."}
        </span>
      )}
    </div>
  );
}
