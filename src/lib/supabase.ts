// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url) {
  console.error("ENV VITE_SUPABASE_URL no está definido");
}
if (!anon) {
  console.error("ENV VITE_SUPABASE_ANON_KEY no está definido");
}

export const supabase = createClient(
  url ?? "",
  anon ?? ""
);
