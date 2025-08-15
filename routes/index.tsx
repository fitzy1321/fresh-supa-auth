import Layout from "../components/Layout.tsx";
import { PageProps } from "$fresh/server.ts";

export default function Home(props: PageProps) {
  let isLoggedIn = false;
  try {
    isLoggedIn = Boolean(props.data?.session);
    // deno-lint-ignore no-empty
  } catch {}

  return (
    <Layout isLoggedIn={isLoggedIn}>
      <div class="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center">
        {isLoggedIn
          ? (
            <div class="mx-auto text-center">
              <h1 class="text-2xl font-bold mb-5">Nice you're logged In!</h1>
              <a
                href="/!"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Fresh Default Page
              </a>
            </div>
          )
          : (
            <div class="mx-auto text-center">
              <h1 class="text-2xl font-bold mb-5">Login to access all pages</h1>
              <a
                href="/login"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Login
              </a>
            </div>
          )}
      </div>
    </Layout>
  );
}
