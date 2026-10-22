import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function isAdminUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return false;

  const claimsStartedAt = performance.now();
  const { data } = await supabase.auth.getClaims();
  console.info(`[perf] property.detail.adminClaims duration_ms=${Math.round(performance.now() - claimsStartedAt)}`);
  const userId = data?.claims?.sub;
  if (!userId) return false;

  const adminQueryStartedAt = performance.now();
  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  console.info(`[perf] property.detail.adminUsersQuery duration_ms=${Math.round(performance.now() - adminQueryStartedAt)}`);
  return Boolean(admin);
}

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=1");

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  if (!admin) redirect("/admin/login?error=unauthorized");

  return supabase;
}
