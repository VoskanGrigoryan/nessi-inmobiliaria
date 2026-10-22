"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminStatusContext = createContext<boolean | null>(null);

export function SiteHeaderAuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const checkedAdminUserId = useRef<string | null>(null);
  const checkedAdminStatus = useRef(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;

    let active = true;

    async function checkAdmin() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
        if (active) {
          checkedAdminUserId.current = null;
          checkedAdminStatus.current = false;
          setIsAdmin(false);
        }
        return;
      }

      try {
        const { createSupabaseBrowserClient } = await import("@/lib/supabase/client");
        const supabase = createSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          if (active) {
            checkedAdminUserId.current = null;
            checkedAdminStatus.current = false;
            setIsAdmin(false);
          }
          return;
        }

        if (checkedAdminUserId.current === session.user.id) {
          if (active) setIsAdmin(checkedAdminStatus.current);
          return;
        }

        const { data: admin, error } = await supabase
          .from("admin_users")
          .select("id")
          .eq("id", session.user.id)
          .maybeSingle();
        const isAdminUser = !error && Boolean(admin);
        if (active) {
          checkedAdminUserId.current = session.user.id;
          checkedAdminStatus.current = isAdminUser;
          setIsAdmin(isAdminUser);
        }
      } catch {
        if (active) setIsAdmin(false);
      }
    }

    void checkAdmin();
    return () => { active = false; };
  }, [pathname]);

  return <AdminStatusContext.Provider value={isAdmin}>{children}</AdminStatusContext.Provider>;
}

export function SiteHeaderVisibility({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;
  return children;
}

export function useAdminStatus() {
  return useContext(AdminStatusContext);
}

export function HeaderAdminLink({ className }: { className: string }) {
  const isAdmin = useAdminStatus();
  if (!isAdmin) return null;

  return <Link href="/admin" className={className}>Administraci&oacute;n</Link>;
}

export function HeaderLoginLink({ icon }: { icon: ReactNode }) {
  const isAdmin = useAdminStatus();
  const pathname = usePathname();
  if (isAdmin !== false || pathname.startsWith("/admin")) return null;

  return (
    <Link
      href="/admin/login"
      aria-label="Admin login"
      className="grid size-10 shrink-0 place-items-center rounded-full border border-navy/15 text-navy transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      {icon}
    </Link>
  );
}
