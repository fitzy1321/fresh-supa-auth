import { FreshContext } from "$fresh/server.ts";
import { State } from "../utils/state.ts";
import { createClient } from "../utils/supabase/server.ts";

export async function handler(
  req: Request,
  ctx: FreshContext<State>,
) {
  const resp = new Response();
  const client = createClient(req, resp);

  const { data: { session }, error: err1 } = await client.auth.getSession();
  if (err1) {
    // TODO: handle error here
  }
  ctx.state.session = session;

  // `getUser()` will validate the JWT
  const { data: { user }, error: err2 } = await client.auth.getUser();
  if (err2) {
    // JWT validation has failed
    ctx.state.session = null;
    ctx.state.user = null;
  }

  ctx.state.user = user;

  // Continue down the middleware chain
  const nextResp = await ctx.next();

  // Copy over any headers that were added by Supabase
  // Note how we're spreading the headers before iterating. This ensures we're
  // capturing potentially duplicated headers that Supabase might add, like
  // chunked cookies.
  for (const [key, value] of [...resp.headers]) {
    nextResp.headers.append(key, value);
  }

  return nextResp;
}
