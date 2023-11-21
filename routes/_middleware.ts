import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSession } from "../utils/kvdb.ts";
import { getSessionCookie } from "../utils/cookie.ts";

export interface State {
  token: string | null;
  supabaseClient: SupabaseClient;
  headers?: Headers;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const client = createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_KEY") || "",
  );
  client.auth.onAuthStateChange((event, session) =>
    console.log({ event, session })
    // TODO: handle refresh cycle and change refresh token
  );

  ctx.state.supabaseClient = client;
  // get sessionId from cookie
  const sessionId = getSessionCookie(req);
  if (!sessionId) {
    return await ctx.next();
  }
  // get tokens from kv
  const tokens = await getSession(sessionId);
  if (!tokens?.value) {
    ctx.state.token = null;
    return await ctx.next();
  }

  //** supabase client can't store session server-side */
  const { data, error } = await ctx.state.supabaseClient.auth.getUser(
    tokens.value.access_token,
  );

  console.log({ data });
  if (error) {
    console.log(error.message);
    ctx.state.token = null;
  } else {
    ctx.state.token = tokens.value.access_token;
  }

  return await ctx.next();
}
