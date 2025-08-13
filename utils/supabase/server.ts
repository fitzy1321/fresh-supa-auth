import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { assert } from "$std/assert/assert.ts";

export function createClient(req: Request, resp: Response) {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

  assert(SUPABASE_URL, "SUPABASE_URL is not set");
  assert(SUPABASE_ANON_KEY, "SUPABASE_ANON_KEY is not set");

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      // deno-lint-ignore no-explicit-any
      getAll(): any {
        return parseCookieHeader(req.headers.get("Cookie") || "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookie = serializeCookieHeader(name, value, options);
          // If the cookie is updated, update the cookies for the response
          resp.headers.append("Set-Cookie", cookie);
        });
      },
    },
  });
}
