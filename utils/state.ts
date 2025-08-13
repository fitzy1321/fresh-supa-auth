import { Session, User } from "@supabase/supabase-js";

export interface State {
  token: string | null;
  // supabaseClient: SupabaseClient;
  session?: Session | null;
  user?: User | null;
}
