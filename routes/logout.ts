import { Handlers } from "$fresh/server.ts";
import { State } from "./_middleware.ts";
import { deleteSessionCookie, getSessionCookie } from "../utils/cookie.ts";
import { deleteSession, getSession } from "../utils/kvdb.ts";

export const handler: Handlers<unknown, State> = {
  async GET(req, ctx) {
    const sessionId = getSessionCookie(req);
    if (!sessionId) {
      return new Response(null, { status: 303, headers: { location: "/" } });
    }

    const headers = new Headers();
    headers.set("location", "/");

    const resp = new Response(null, { status: 308, headers });
    const tokens = await getSession(sessionId);
    deleteSessionCookie(headers, req.url);
    if (tokens.value) {
      await ctx.state.supabaseClient.auth.setSession(
        tokens.value,
      );
      await ctx.state.supabaseClient.auth.signOut();
      await deleteSession(sessionId);
    }
    return resp;
  },
};
