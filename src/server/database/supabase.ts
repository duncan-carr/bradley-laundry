import { createClient } from "@supabase/supabase-js";
import { env } from "~/env";
import { type Database } from "./database.types";

export const supabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
);
