import { Handlers, PageProps } from "$fresh/server.ts";
import { assert } from "$std/assert/assert.ts";
import { State } from "/utils/state.ts";
import { createClient } from "/utils/supabase/server.ts";

export const handler: Handlers<unknown, State> = {
  async POST(req, ctx) {
    // TODO: what todo if session is still active and valid?
    if (ctx.state.session || ctx.state.user) {
      ctx.state.session = null;
      ctx.state.user = null;
    }
    const resp = new Response(null, { status: 303 });
    const client = createClient(req, resp);

    const form = await req.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    assert(email, "email is required");
    assert(password, "password is required");

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    ctx.state.session = data.session;
    ctx.state.user = data.user;

    let redirect = "/";
    if (error) {
      if (error.message === "Email not confirmed") {
        redirect = "/email_confirm";
      } else {
        console.log(error);
        redirect = `/login?error=${error.message}`;
      }
    }

    resp.headers.set("location", redirect);
    return resp;
  },
};

export default function Login(props: PageProps) {
  const err = props.url.searchParams.get("error");
  return (
    <section class="bg-gray-200">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="mx-auto">
          <h2 class="text-2xl font-bold mb-5 text-center">Login</h2>
        </div>

        <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            {err && (
              <div class="bg-red-400 border-l-4 p-4" role="alert">
                <p class="font-bold">Error</p>
                <p>{err}</p>
              </div>
            )}
            <form class="space-y-4 md:space-y-6" method="POST">
              <div>
                <label for="email" class="block mb-2 text-sm font-medium">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="border border-gray-300 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  class="border border-gray-300 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Login In
              </button>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an account yet?{" "}
                <a
                  href="/signup"
                  class="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
