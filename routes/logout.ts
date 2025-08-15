import { Handlers } from "$fresh/server.ts";
import { State } from "../utils/state.ts";
import { createClient } from "../utils/supabase/server.ts";

export const handler: Handlers<unknown, State> = {
  async GET(req, ctx) {
    const resp = new Response(null, { status: 308 });
    const client = createClient(req, resp);

    let { data, error } = await client.auth.getSession();
    if (error) {
      return new Response(null, {
        status: 303,
        headers: { ...resp.headers, location: "/" },
      });
    }

    ({ error } = await client.auth.signOut());
    // TODO: handle error here

    resp.headers.set("location", "/");
    ctx.state.session = null;
    ctx.state.user = null;
    return resp;
  },
};
