import { setSessionCookie } from "./cookie.ts";

export const SESSION_KEY = "session";

export const kv = await Deno.openKv();

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export async function setSession(
  request: Request,
  sessionId: string,
  tokens: unknown,
  expireIn: number,
) {
  // TODO: check current headers for session
  // TODO: check if that session needs refreshing, or redirect to logout?
  const headers = new Headers();
  const res = await kv.set([SESSION_KEY, sessionId], tokens, { expireIn });
  // TODO: check result / errors
  setSessionCookie(request, headers, sessionId, expireIn);
  console.log(headers);
  return headers;
}

export async function getSession(sessionId: string) {
  return await kv.get<Tokens>([SESSION_KEY, sessionId]);
}

export async function deleteSession(sessionId: string) {
  await kv.delete([SESSION_KEY, sessionId]);
}

// export default async function simpleHash(message: string) {
//   const data = new TextEncoder().encode(message);
//   const hashBuffer = await crypto.subtle.digest("SHA-256", data);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(
//     "",
//   );
//   return hashHex;
// }
