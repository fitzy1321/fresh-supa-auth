# Fresh project

Current Versions (cuz this $h!T moves fast):

- Fresh : 1.5.4
- Supabase-js: 2.38.5

## Run App

Copy `.env.example` file:

```sh
cp .env.example .env
```

Make a supabase project: <https://supabase.com>

After creating a new project, goto Settings, then API Settings

Copy `project url` into `SUPABASE_URL` in your `.env` file

Copy `anon public key` into `SUPABASE_ANON_KEY`

Start the project:

```sh
deno task start
```

This will watch the project directory and restart as necessary.

## References

- Fresh: <https://fresh.deno.dev/>
