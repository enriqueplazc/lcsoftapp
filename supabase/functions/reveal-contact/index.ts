// supabase/functions/reveal-contact/index.ts
// Edge Function (Deno) que devuelve el contacto completo de un cliente
// solo si el visitante pasa reCAPTCHA v3 y no rellenó el campo trampa (honeypot).
//
// La llama src/sections/Home/Clients.tsx:
//   POST {VITE_SUPABASE_URL}/functions/v1/reveal-contact
//   body: { clientId: number, captchaToken: string, honeypot: string }
//   200 → { contact: { name, position, phone, email } }
//   4xx → { error: "mensaje" }
//
// Secrets necesarios (npx supabase secrets set ...):
//   RECAPTCHA_SECRET_KEY   clave SECRETA de reCAPTCHA v3 (no la del sitio)
//   RECAPTCHA_MIN_SCORE    opcional, por defecto 0.5
// SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los pone Supabase automáticamente.
//
// Desplegar: npx supabase functions deploy reveal-contact --no-verify-jwt

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function verifyCaptcha(token: string, remoteIp: string | null) {
  const secret = Deno.env.get("RECAPTCHA_SECRET_KEY");
  if (!secret) throw new Error("RECAPTCHA_SECRET_KEY no configurada");

  const params = new URLSearchParams({ secret, response: token });
  if (remoteIp) params.set("remoteip", remoteIp);

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const data = await res.json();
  const minScore = Number(Deno.env.get("RECAPTCHA_MIN_SCORE") ?? "0.5");

  return (
    data.success === true &&
    (data.action === undefined || data.action === "reveal_contact") &&
    (typeof data.score !== "number" || data.score >= minScore)
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  try {
    const { clientId, captchaToken, honeypot } = await req.json().catch(() => ({}));

    // Bots: el campo trampa invisible viene relleno
    if (honeypot) return json({ error: "Solicitud rechazada" }, 400);

    const id = Number(clientId);
    if (!Number.isInteger(id) || id <= 0) return json({ error: "Cliente inválido" }, 400);
    if (!captchaToken || typeof captchaToken !== "string") {
      return json({ error: "Falta la verificación de seguridad" }, 400);
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    if (!(await verifyCaptcha(captchaToken, ip))) {
      return json({ error: "No se pudo verificar que eres humano. Intenta de nuevo." }, 403);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { data, error } = await supabase
      .from("clients")
      .select("contact_name, contact_position, contact_phone, contact_email")
      .eq("id", id)
      .eq("is_active", true) // solo clientes visibles en la web
      .maybeSingle();

    if (error) throw error;
    if (!data) return json({ error: "Cliente no encontrado" }, 404);

    return json({
      contact: {
        name: data.contact_name,
        position: data.contact_position,
        phone: data.contact_phone,
        email: data.contact_email,
      },
    });
  } catch (err) {
    console.error("reveal-contact:", err);
    return json({ error: "Error interno. Intenta más tarde." }, 500);
  }
});
