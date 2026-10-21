import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
