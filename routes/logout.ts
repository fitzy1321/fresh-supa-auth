import { deleteCookie, getCookies } from "$std/http/cookie.ts";
import { Handlers } from "$fresh/server.ts";
import { State } from "./_middleware.ts";

export const handler: Handlers<unknown, State> = {
  async GET(req, ctx) {
    const supaCreds = getCookies(req.headers)["supaLogin"];
    if (!supaCreds) {
      return new Response(null, { status: 303, headers: { location: "/" } });
    }

    const headers = new Headers(req.headers);

    headers.set("location", "/");

    await ctx.state.supabaseClient.auth.signOut();

    const resp = new Response(null, { status: 303, headers });
    deleteCookie(resp.headers, "supaLogin");

    return resp;
  },
};
