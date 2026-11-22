// src/sections/Home/Clients.tsx - Carrusel continuo "Empresas que confían" + modal con protección
import { Element } from "react-scroll";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getActiveClients, type Client } from "../../api/clients";

// Declaración global para reCAPTCHA
declare global {
  interface Window {
    grecaptcha: any;
  }
}

// Vista ofuscada del contacto, a partir de las pistas que calcula la BD
// (el contacto completo nunca llega al navegador sin pasar reCAPTCHA)
function obfuscatePhone(hint: string | null | undefined): string {
  return hint ? `${hint} *** ***` : "*** *** ***";
}

function obfuscateEmail(tld: string | null | undefined): string {
  return `***@***.${tld || "***"}`;
}

const DEFAULT_GRADIENT = "from-[#542DA0] to-[#8887E8]";

/**
 * Convierte "from-[#06b6d4] to-[#0ea5e9]" en un degradado CSS real.
 * No dependemos de las clases de Tailwind porque los colores vienen de la BD
 * y Tailwind solo genera las clases que aparecen escritas en el código
 * (por eso algunas tarjetas se quedaban sin franja de color).
 */
function gradientCss(cls: string | null | undefined, angle = 90): string {
  const colors = (cls || DEFAULT_GRADIENT).match(/#[0-9a-fA-F]{3,8}/g) ?? [];
  const [from, to] = colors.length >= 2 ? colors : ["#542DA0", "#8887E8"];
  return `linear-gradient(${angle}deg, ${from}, ${to})`;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(w) && w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/**
 * Logo del cliente. Si no hay logo o la imagen no carga (URL rota del Supabase
 * antiguo, archivo que no existe...), muestra las iniciales con el degradado del cliente.
 */
function ClientLogo({
  client,
  className = "",
  initialsClass = "text-4xl",
}: {
  client: Client;
  className?: string;
  initialsClass?: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [client.logo_url]);

  if (!client.logo_url || failed) {
    return (
      <span
        className={`font-extrabold tracking-tight bg-clip-text text-transparent ${initialsClass}`}
        style={{ backgroundImage: gradientCss(client.gradient_class) }}
        aria-label={client.name}
      >
        {initialsOf(client.name) || "🏢"}
      </span>
    );
  }

  return (
    <img
      src={client.logo_url}
      alt={`${client.name} logo`}
      className={className}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

/** Una fila del carrusel infinito. Se duplica la lista para que el bucle no tenga cortes. */
function MarqueeRow({
  items,
  reverse = false,
  onSelect,
}: {
  items: Client[];
  reverse?: boolean;
  onSelect: (id: number) => void;
}) {
  // Repetimos hasta tener suficientes logos para cubrir pantallas anchas
  const base = items.length < 6 ? [...items, ...items, ...items] : items;
  const loop = [...base, ...base];
  const duration = Math.max(25, base.length * 4); // segundos por vuelta

  return (
    <div className="lc-marquee group relative overflow-hidden py-3">
      <div
        className={`lc-marquee-track flex w-max gap-6 ${reverse ? "lc-marquee-reverse" : ""}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((c, idx) => (
          <button
            key={`${c.id}-${idx}`}
            type="button"
            onClick={() => onSelect(c.id)}
            aria-hidden={idx >= base.length ? true : undefined}
            tabIndex={idx >= base.length ? -1 : 0}
            title={`Ver ${c.name}`}
            className="shrink-0 w-56 sm:w-64 rounded-2xl text-left shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
            // La franja de color se pinta como fondo de la propia tarjeta:
            // así respeta las esquinas redondeadas sin bordes blancos.
            style={{
              backgroundColor: "#fff",
              backgroundImage: gradientCss(c.gradient_class),
              backgroundSize: "100% 6px",
              backgroundRepeat: "no-repeat",
            }}
          >
            <span className="flex h-32 sm:h-36 items-center justify-center px-6 pt-5">
              <ClientLogo client={c} className="max-h-20 sm:max-h-24 max-w-full w-auto object-contain" />
            </span>
            <span className="block border-t border-gray-100 px-4 py-3">
              <span className="block truncate text-sm font-semibold text-gray-900">{c.name}</span>
              <span className="block truncate text-xs text-gray-500">{c.sector}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

const MARQUEE_CSS = `
@keyframes lc-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.lc-marquee-track { animation: lc-marquee linear infinite; }
.lc-marquee-reverse { animation-direction: reverse; }
.lc-marquee:hover .lc-marquee-track,
.lc-marquee:focus-within .lc-marquee-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .lc-marquee { overflow-x: auto; }
  .lc-marquee-track { animation: none; }
}
`;

export const Clients = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado de verificación
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [revealedContact, setRevealedContact] = useState<any>(null);
  const [honeypot, setHoneypot] = useState("");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  // Cargar reCAPTCHA
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setRecaptchaLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    loadClients();
  }, []);

  // Cerrar el modal con la tecla Escape
  useEffect(() => {
    if (openId === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  async function loadClients() {
    try {
      const data = await getActiveClients();
      setClients(data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    } finally {
      setLoading(false);
    }
  }

  // Con muchos clientes, dos filas en sentidos opuestos
  const rows = useMemo(() => {
    if (clients.length < 8) return [clients];
    const half = Math.ceil(clients.length / 2);
    return [clients.slice(0, half), clients.slice(half)];
  }, [clients]);

  // Función para revelar contacto con reCAPTCHA
  async function revealContact(clientId: number) {
    if (!recaptchaLoaded) {
      alert("Sistema de seguridad cargando...");
      return;
    }

    setVerifying(true);

    try {
      // Obtener token de reCAPTCHA
      const token = await window.grecaptcha.execute(
        import.meta.env.VITE_RECAPTCHA_SITE_KEY,
        { action: "reveal_contact" }
      );

      // Llamar a la Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reveal-contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            clientId,
            captchaToken: token,
            honeypot, // Campo trampa para bots
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al verificar");
      }

      // Guardar contacto revelado
      setRevealedContact(data.contact);
      setVerified(true);

    } catch (err: any) {
      console.error("Error revelando contacto:", err);
      alert(err.message || "Error al verificar. Intenta de nuevo.");
    } finally {
      setVerifying(false);
    }
  }

  // Reset al cerrar modal
  function closeModal() {
    setOpenId(null);
    setVerified(false);
    setRevealedContact(null);
    setHoneypot("");
  }

  return (
    <Element name="clients">
      <style>{MARQUEE_CSS}</style>
      <section aria-labelledby="clientes-titulo" className="py-16 sm:py-20">
        <div className="content m-auto">
          <div className="text-center text-alabasters">
            <h2 id="clientes-titulo" className="text-white text-3xl sm:text-4xl font-semibold tracking-tight">Empresas que confían en nosotros</h2>
            <p className="mt-4 mb-12 max-w-[60em] w-[100%] m-auto text-slate-400">
              Confían en nosotros para diseñar, integrar y operar soluciones críticas de negocio.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-white/70">Cargando clientes...</div>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center text-white/70 py-12">
            No hay clientes disponibles en este momento.
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map((row, i) => (
              <MarqueeRow key={i} items={row} reverse={i % 2 === 1} onSelect={setOpenId} />
            ))}
            <p className="text-center text-sm text-white/50 pt-4">
              Haz clic en cualquier empresa para ver el proyecto
            </p>
          </div>
        )}
      </section>

      {/* MODAL CON PROTECCIÓN */}
      <AnimatePresence>
        {openId !== null && (
          <motion.div
            key="clients-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 18, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 18, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
            >
              {(() => {
                const c = clients.find((x) => x.id === openId);
                if (!c) return null;

                return (
                  <>
                    {/* Honeypot (campo invisible para bots) */}
                    <input
                      type="text"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    <div className="relative">
                      <div
                        className="h-40"
                        style={{ backgroundImage: gradientCss(c.gradient_class, 135) }}
                      />
                      
                      <div className="absolute -bottom-16 left-8">
                        <div className="w-40 h-40 rounded-2xl bg-white shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-white p-3">
                          <ClientLogo client={c} className="w-full h-full object-contain" initialsClass="text-5xl" />
                        </div>
                      </div>

                      <button
                        onClick={closeModal}
                        aria-label="Cerrar"
                        className="absolute right-4 top-4 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition"
                      >
                        <XMarkIcon className="w-6 h-6 text-white" />
                      </button>
                    </div>

                    <div className="pt-24 px-8 pb-8">
                      <div className="mb-6">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                          {c.name}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                          {c.sector}
                        </span>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Servicios Prestados
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {(c as any).details || c.blurb}
                        </p>
                      </div>

                      {/* INFORMACIÓN DE CONTACTO CON PROTECCIÓN */}
                      {c.has_contact && (
                        <div className="border-t pt-6">
                          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                            Información de Contacto
                          </h4>
                          
                          {!verified ? (
                            // Vista ofuscada
                            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                              {(c.contact_first_name || c.contact_position) && (
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Contacto</p>
                                    <p className="font-semibold text-gray-900">{c.contact_first_name || "Contacto"}</p>
                                    {c.contact_position && (
                                      <p className="text-sm text-gray-600">{c.contact_position}</p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {c.contact_phone_hint && (
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Teléfono</p>
                                    <p className="font-semibold text-gray-500">{obfuscatePhone(c.contact_phone_hint)}</p>
                                  </div>
                                </div>
                              )}

                              {c.contact_email_tld && (
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Email</p>
                                    <p className="font-semibold text-gray-500">{obfuscateEmail(c.contact_email_tld)}</p>
                                  </div>
                                </div>
                              )}

                              {/* Botón para revelar */}
                              <button
                                onClick={() => revealContact(c.id)}
                                disabled={verifying || !recaptchaLoaded}
                                className="w-full mt-4 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                              >
                                {verifying ? (
                                  <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verificando...
                                  </>
                                ) : !recaptchaLoaded ? (
                                  "Cargando..."
                                ) : (
                                  <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Ver contacto completo
                                  </>
                                )}
                              </button>

                              <p className="text-xs text-gray-500 text-center mt-2">
                                Protegido por reCAPTCHA para prevenir bots
                              </p>
                            </div>
                          ) : (
                            // Vista revelada
                            <div className="bg-green-50 rounded-xl p-6 space-y-4 border-2 border-green-200">
                              <div className="flex items-center gap-2 text-green-700 mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-semibold">Contacto verificado</span>
                              </div>

                              {revealedContact?.name && (
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 mb-1">Contacto</p>
                                    <p className="font-semibold text-gray-900">{revealedContact.name}</p>
                                    {revealedContact.position && (
                                      <p className="text-sm text-gray-600">{revealedContact.position}</p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {revealedContact?.phone && (
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 mb-1">Teléfono</p>
                                    <a 
                                      href={`tel:${revealedContact.phone}`}
                                      className="font-semibold text-gray-900 hover:text-blue-600 transition"
                                    >
                                      {revealedContact.phone}
                                    </a>
                                  </div>
                                </div>
                              )}

                              {revealedContact?.email && (
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 mb-1">Email</p>
                                    <a 
                                      href={`mailto:${revealedContact.email}`}
                                      className="font-semibold text-gray-900 hover:text-blue-600 transition break-all"
                                    >
                                      {revealedContact.email}
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {(c as any).url && (
                        <div className="mt-6">
                          <a
                            href={(c as any).url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
                          >
                            Visitar sitio web
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Element>
  );
};