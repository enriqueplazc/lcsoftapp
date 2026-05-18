// src/pages/Contacto.tsx
import { useState, useEffect } from "react";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { Header } from "../components/Header";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

// Declaración global para reCAPTCHA
declare global {
  interface Window {
    grecaptcha: any;
  }
}

export function Contacto() {
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
    <DefaultLayout>
      <Header redirect={true} />
      
      <section className="py-20 bg-gradient-to-b from-mine-shaft2 to-[#0a0a0a] min-h-screen">
        <div className="content m-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Conversemos sobre tu proyecto
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Cuéntanos tus necesidades y te ayudaremos a encontrar la mejor
              solución tecnológica para tu negocio.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Información de contacto */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Información de Contacto
                </h2>

                <div className="space-y-6">
                  {/* Teléfonos */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <PhoneIcon className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Teléfonos</h3>
                      <p className="text-white/70 text-sm">
                        <a href="tel:+516355718" className="hover:text-white transition">
                          954 760 305
                        </a>
                        <br />
                        <a href="tel:+51954760305" className="hover:text-white transition">
                          952 138 066
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <EnvelopeIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Email</h3>
                      <p className="text-white/70 text-sm">
                        <a href="mailto:olazaro@lcsoft.pe" className="hover:text-white transition">
                          olazaro@lcsoft.pe                        
                        </a><br />
                        <a href="mailto:olazaro@lcsoft.pe" className="hover:text-white transition">
                          elazaro@lcsoft.pe                        
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Horario */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <ClockIcon className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        Horario de Atención
                      </h3>
                      <p className="text-white/70 text-sm">
                        Lunes a Viernes: 9:00 AM - 6:00 PM
                        <br />
                        Sábados: 9:00 AM - 11:00 AM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nota de seguridad */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-200">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p>
                    Verifique sus datos antes de enviar el formulario.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Formulario */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/5 rounded-2xl p-8 border border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Envíanos un mensaje
              </h2>

              {sent ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                  <div className="text-green-400 text-5xl mb-4">✓</div>
                  <h3 className="text-white font-semibold text-xl mb-2">
                    ¡Mensaje enviado!
                  </h3>
                  <p className="text-white/70">
                    Gracias por contactarnos. Te responderemos pronto.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Mensaje de error */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  {/* Tipo de consulta */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Tipo de consulta 
                    </label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => handleChange("tipo", e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="" className="bg-gray-900">
                        Selecciona una opción
                      </option>
                      <option value="cotizacion" className="bg-gray-900">
                        Cotización
                      </option>
                      <option value="soporte" className="bg-gray-900">
                        Soporte técnico
                      </option>
                      <option value="informacion" className="bg-gray-900">
                        Información de productos
                      </option>
                      <option value="demostracion" className="bg-gray-900">
                        Demostración
                      </option>
                      <option value="otro" className="bg-gray-900">
                        Otro
                      </option>
                    </select>
                  </div>

                  {/* Nombre */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Nombre completo 
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => handleChange("nombre", e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="juan@empresa.com"
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => handleChange("telefono", e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="999 999 999"
                    />
                  </div>

                  {/* Empresa */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={formData.empresa}
                      onChange={(e) => handleChange("empresa", e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Mensaje 
                    </label>
                    <textarea
                      value={formData.mensaje}
                      onChange={(e) => handleChange("mensaje", e.target.value)}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                      placeholder="Cuéntanos sobre tu proyecto..."
                    />
                  </div>

                  {/* Botón */}
                  <button
                    type="submit"
                    disabled={sending || !recaptchaLoaded}
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                  >
                    {sending ? "Enviando..." : !recaptchaLoaded ? "Cargando..." : "Enviar Mensaje"}
                  </button>

                  <p className="text-white/40 text-xs text-center">
                    Al enviar este formulario, aceptas nuestra política de privacidad.
                    <br />
                    Protegido por reCAPTCHA - 
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="underline hover:text-white/60"> Privacidad</a> y 
                    <a href="https://policies.google.com/terms" target="_blank" rel="noopener" className="underline hover:text-white/60"> Términos</a>
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}