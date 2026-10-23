"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuthenticatedUserId } from "@/components/site-header-auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type PropertyFavoritesValue = {
  favoritePropertyIds: ReadonlySet<string>;
  favoritesReady: boolean;
  toggleFavorite: (propertyId: string) => Promise<boolean>;
};

const PropertyFavoritesContext = createContext<PropertyFavoritesValue | null>(null);
const emptyFavoritePropertyIds: ReadonlySet<string> = new Set();

export function PropertyFavoritesProvider({ children }: { children: ReactNode }) {
  const userId = useAuthenticatedUserId();
  const [favoritePropertyIds, setFavoritePropertyIds] = useState<Set<string>>(new Set());
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!userId || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      return () => { active = false; };
    }

    async function loadFavorites() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("property_favorites")
          .select("property_id")
          .eq("user_id", userId);
        if (active) {
          setFavoritePropertyIds(error ? new Set() : new Set((data ?? []).map(({ property_id }) => property_id)));
        }
      } catch {
        if (active) setFavoritePropertyIds(new Set());
      } finally {
        if (active) setLoadedUserId(userId);
      }
    }

    void loadFavorites();
    return () => { active = false; };
  }, [userId]);

  async function toggleFavorite(propertyId: string) {
    if (!userId || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      return false;
    }

    const isFavorite = favoritePropertyIds.has(propertyId);
    try {
      const supabase = createSupabaseBrowserClient();
      const result = isFavorite
        ? await supabase.from("property_favorites").delete().eq("user_id", userId).eq("property_id", propertyId)
        : await supabase.from("property_favorites").insert({ user_id: userId, property_id: propertyId });
      if (result.error) return false;
    } catch {
      return false;
    }

    setFavoritePropertyIds((current) => {
      const next = new Set(current);
      if (isFavorite) next.delete(propertyId);
      else next.add(propertyId);
      return next;
    });
    return true;
  }

  const favoritesReady = !userId || loadedUserId === userId;
  const value = {
    favoritePropertyIds: favoritesReady && userId ? favoritePropertyIds : emptyFavoritePropertyIds,
    favoritesReady,
    toggleFavorite,
  };

  return <PropertyFavoritesContext.Provider value={value}>{children}</PropertyFavoritesContext.Provider>;
}

export function usePropertyFavorites() {
  const value = useContext(PropertyFavoritesContext);
  if (!value) throw new Error("usePropertyFavorites must be used inside PropertyFavoritesProvider");
  return value;
}
