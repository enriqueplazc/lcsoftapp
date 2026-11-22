// src/pages/Contacto.tsx
import { useState, useEffect } from "react";
import { useSeo } from "../hooks/use-seo";
import { motion } from "framer-motion";
import { Clock, Mail, MessageCircle, Phone, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "../sections/Landing/SiteHeader";
import { SiteFooter } from "../sections/Landing/SiteFooter";
import { WhatsAppFloat } from "../sections/Landing/WhatsAppFloat";
import { Container, Eyebrow, GradientText } from "../sections/Landing/ui";
import { SITE, whatsappLink } from "../content/site";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder-slate-500 transition focus:border-[#5DADC6]/60 focus:outline-none focus:ring-2 focus:ring-[#5DADC6]/30";
const labelCls = "mb-2 block text-sm font-medium text-slate-300";

// Declaración global para reCAPTCHA
declare global {
  interface Window {
    grecaptcha: any;
  }
}

export function Contacto() {
  useSeo("Contacto", "Contáctanos para una demo de TDIPLAN, outsourcing de planillas o desarrollo de software a medida.", "/contact");
  const [formData, setFormData] = useState({
    tipo: "",
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
    mensaje: "",
  });

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  // Cargar script de reCAPTCHA
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setRecaptchaLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!recaptchaLoaded) {
      setError("El sistema de seguridad aún está cargando. Por favor, espera un momento.");
      return;
    }

    setSending(true);
    setError(null);

    try {
      // 1. Obtener token de reCAPTCHA
      const token = await window.grecaptcha.execute(
        import.meta.env.VITE_RECAPTCHA_SITE_KEY,
        { action: "submit_contact" }
      );

      // 2. Enviar formulario con token al backend
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            tipo: formData.tipo,
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
            empresa: formData.empresa,
            mensaje: formData.mensaje,
            captchaToken: token,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el mensaje");
      }

      // 3. Éxito
      setSent(true);
      
      // Reset después de 5 segundos
      setTimeout(() => {
        setSent(false);
        setFormData({
          tipo: "",
          nombre: "",
          email: "",
          telefono: "",
          empresa: "",
          mensaje: "",
        });
      }, 5000);

    } catch (err: any) {
      console.error("Error enviando formulario:", err);
      setError(err.message || "Error al enviar el mensaje. Por favor, intenta de nuevo.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="landing min-h-screen bg-[#0b0d18] text-slate-200 antialiased">
      <SiteHeader />
      <main className="relative overflow-hidden pb-24 pt-32 sm:pt-40">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-10%] h-[460px] w-[860px] -translate-x-1/2 rounded-full bg-[#2E7FA0]/25 blur-[120px]" />
        </div>

        <Container className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center"
          >
            <Eyebrow>Contacto</Eyebrow>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Conversemos sobre <GradientText>tu proyecto</GradientText>
            </h1>
            <p className="text-lg text-slate-400">
              Agenda una demo de TDIPLAN, consulta por el outsourcing de planillas o cuéntanos qué software necesitas.
            </p>
          </motion.div>

          <div className="mt-16 grid items-start gap-8 lg:grid-cols-[1fr_1.4fr]">
            {/* Información de contacto */}
            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-4"
            >
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-[#5DADC6]/30 bg-gradient-to-r from-[#14374a] to-[#111527] p-6 transition hover:border-[#5DADC6]/60"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/15">
                  <MessageCircle className="h-6 w-6 text-[#25D366]" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold text-white">Escríbenos por WhatsApp</span>
                  <span className="text-sm text-slate-400">La forma más rápida de hablar con un asesor</span>
                </span>
              </a>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <ul className="flex flex-col gap-6">
                  <li className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <Phone className="h-5 w-5 text-[#5DADC6]" aria-hidden />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-white">Teléfono</h2>
                      <a href={`tel:${SITE.phoneE164}`} className="text-slate-400 hover:text-white">{SITE.phoneDisplay}</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <Mail className="h-5 w-5 text-[#5DADC6]" aria-hidden />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-white">Email de ventas</h2>
                      <a href={`mailto:${SITE.salesEmail}`} className="text-slate-400 hover:text-white">{SITE.salesEmail}</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <Clock className="h-5 w-5 text-[#5DADC6]" aria-hidden />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-white">Horario de atención</h2>
                      <p className="text-slate-400">
                        Lunes a viernes: 9:00 a. m. – 6:00 p. m.
                        <br />
                        Sábados: 9:00 a. m. – 11:00 a. m.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <p className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-400">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#5DADC6]" aria-hidden />
                Tus datos solo se usan para responder tu consulta.
              </p>
            </motion.aside>

            {/* Formulario */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10"
            >
              <h2 className="text-2xl font-semibold text-white">Envíanos un mensaje</h2>
              <p className="mt-1 text-sm text-slate-400">Te respondemos lo antes posible.</p>

              {sent ? (
                <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-300" aria-hidden />
                  <h3 className="text-xl font-semibold text-white">¡Mensaje enviado!</h3>
                  <p className="text-slate-300">Gracias por contactarnos. Te responderemos pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
                  {error && (
                    <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200 sm:col-span-2">
                      {error}
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label htmlFor="c-tipo" className={labelCls}>Tipo de consulta</label>
                    <select
                      id="c-tipo"
                      value={formData.tipo}
                      onChange={(e) => handleChange("tipo", e.target.value)}
                      required
                      className={inputCls}
                    >
                      <option value="" className="bg-[#101322]">Selecciona una opción</option>
                      <option value="demostracion" className="bg-[#101322]">Demo de TDIPLAN</option>
                      <option value="informacion" className="bg-[#101322]">Información de productos y servicios</option>
                      <option value="cotizacion" className="bg-[#101322]">Software a medida</option>
                      <option value="soporte" className="bg-[#101322]">Soporte técnico</option>
                      <option value="otro" className="bg-[#101322]">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="c-nombre" className={labelCls}>Nombre completo</label>
                    <input id="c-nombre" type="text" autoComplete="name" value={formData.nombre}
                      onChange={(e) => handleChange("nombre", e.target.value)} required className={inputCls} placeholder="Juan Pérez" />
                  </div>

                  <div>
                    <label htmlFor="c-empresa" className={labelCls}>Empresa</label>
                    <input id="c-empresa" type="text" autoComplete="organization" value={formData.empresa}
                      onChange={(e) => handleChange("empresa", e.target.value)} className={inputCls} placeholder="Nombre de tu empresa" />
                  </div>

                  <div>
                    <label htmlFor="c-email" className={labelCls}>Email</label>
                    <input id="c-email" type="email" autoComplete="email" value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)} required className={inputCls} placeholder="juan@empresa.com" />
                  </div>

                  <div>
                    <label htmlFor="c-tel" className={labelCls}>Teléfono</label>
                    <input id="c-tel" type="tel" autoComplete="tel" value={formData.telefono}
                      onChange={(e) => handleChange("telefono", e.target.value)} className={inputCls} placeholder="999 999 999" />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="c-msg" className={labelCls}>Mensaje</label>
                    <textarea id="c-msg" value={formData.mensaje} onChange={(e) => handleChange("mensaje", e.target.value)}
                      required rows={5} className={`${inputCls} resize-none`} placeholder="Cuéntanos qué necesitas..." />
                  </div>

                  <div className="flex flex-col gap-3 sm:col-span-2">
                    <button
                      type="submit"
                      disabled={sending || !recaptchaLoaded}
                      className="w-full rounded-full bg-[#5DADC6] px-6 py-3 font-semibold text-[#101322] shadow-lg shadow-[#5DADC6]/20 transition hover:bg-[#7cc0d6] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sending ? "Enviando..." : !recaptchaLoaded ? "Cargando..." : "Enviar mensaje"}
                    </button>
                    <p className="text-center text-xs text-slate-500">
                      Protegido por reCAPTCHA ·{" "}
                      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">Privacidad</a>{" "}
                      y{" "}
                      <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">Términos</a>
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </Container>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}
