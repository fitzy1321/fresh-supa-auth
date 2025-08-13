import { createBrowserClient } from "@supabase/ssr";
import { assert } from "$std/assert/assert.ts";

export function createClient() {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

  assert(SUPABASE_URL, "SUPABASE_URL is not set");
  assert(SUPABASE_ANON_KEY, "SUPABASE_ANON_KEY is not set");

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
