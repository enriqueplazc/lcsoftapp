// src/sections/Home/Contact.tsx
import { Element } from "react-scroll";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);

    // Aquí iría la integración con tu backend/email service
    // Por ahora simulamos el envío
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Formulario enviado:", formData);
    setSending(false);
    setSent(true);

    // Reset después de 3 segundos
    setTimeout(() => {
      setSent(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });
    }, 3000);
  }

  return (
    <Element name="contact">
      <section className="py-20 bg-gradient-to-b from-mine-shaft2 to-[#0a0a0a]">
        <div className="content m-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Conversemos sobre tu proyecto
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Cuéntanos tus necesidades y te ayudaremos a encontrar la mejor
              solución tecnológica para tu negocio.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Información de contacto */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Información de Contacto
                </h3>

                <div className="space-y-6">
                  {/* Dirección */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <MapPinIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">
                        Dirección
                      </h4>
                      <p className="text-white/70 text-sm">
                        Jr. Naylamp N° 248
                        <br />
                        San Juan de Lurigancho – Lima 36
                      </p>
                    </div>
                  </div>

                  {/* Teléfonos */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <PhoneIcon className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">
                        Teléfonos
                      </h4>
                      <p className="text-white/70 text-sm">
                        <a
                          href="tel:+51635-5718"
                          className="hover:text-white transition"
                        >
                          635-5718
                        </a>
                        <br />
                        <a
                          href="tel:+51954760305"
                          className="hover:text-white transition"
                        >
                          954 760 305
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
                      <h4 className="text-white font-semibold mb-1">Email</h4>
                      <p className="text-white/70 text-sm">
                        <a
                          href="mailto:olazaro@lcsoft.pe"
                          className="hover:text-white transition"
                        >
                          olazaro@lcsoft.pe
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
                      <h4 className="text-white font-semibold mb-1">
                        Horario de Atención
                      </h4>
                      <p className="text-white/70 text-sm">
                        Lunes a Viernes: 9:00 AM - 6:00 PM
                        <br />
                        Sábados: 9:00 AM - 1:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mapa (placeholder) */}
              <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.7806820893444!2d-77.00825878519531!3d-11.987567091485468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c5c9c7c9c9c9%3A0x1234567890abcdef!2sJr.%20Naylamp%20248%2C%20San%20Juan%20de%20Lurigancho%2015434!5e0!3m2!1ses!2spe!4v1234567890123!5m2!1ses!2spe"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación LC Software"
                ></iframe>
              </div>
            </motion.div>

            {/* Formulario */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/5 rounded-2xl p-8 border border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                Envíanos un mensaje
              </h3>

              {sent ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                  <div className="text-green-400 text-5xl mb-4">✓</div>
                  <h4 className="text-white font-semibold text-xl mb-2">
                    ¡Mensaje enviado!
                  </h4>
                  <p className="text-white/70">
                    Gracias por contactarnos. Te responderemos pronto.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Nombre */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Email *
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
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
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
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Mensaje *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                      placeholder="Cuéntanos sobre tu proyecto..."
                    />
                  </div>

                  {/* Botón */}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                  >
                    {sending ? "Enviando..." : "Enviar Mensaje"}
                  </button>

                  <p className="text-white/40 text-xs text-center">
                    Al enviar este formulario, aceptas nuestra política de
                    privacidad
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Element>
  );
};