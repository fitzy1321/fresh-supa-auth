import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getCookies } from "$std/http/cookie.ts";

export interface State {
  token: string | null;
  supabaseClient: SupabaseClient<any, "public", any>;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  if (!ctx.state.supabaseClient) {
    const client = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_KEY") || "",
    );
    if (Deno.env.get("DEBUG_SESSION")) {
      client.auth.onAuthStateChange((event, session) =>
        console.log({ event, session })
      );
      ctx.state.supabaseClient = client;
    }
  }
  const supaCreds = getCookies(req.headers)["supaLogin"];
  if (!supaCreds) {
    return await ctx.next();
  }
  const { data, error } = await ctx.state.supabaseClient.auth.getUser(
    supaCreds,
  );
  console.log({ data });
  if (error) {
    console.log(error.message);
    ctx.state.token = null;
  } else {
    ctx.state.token = supaCreds;
  }

  return await ctx.next();
}
