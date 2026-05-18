// src/sections/Home/Clients.tsx - CON PROTECCIÓN
import { Element } from "react-scroll";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getActiveClients, type Client } from "../../api/clients";

// Declaración global para reCAPTCHA
declare global {
  interface Window {
    grecaptcha: any;
  }
}

// Funciones de ofuscación
function obfuscateName(fullName: string | null): string {
  if (!fullName) return "N/A";
  const parts = fullName.trim().split(" ");
  return parts[0]; // Solo primer nombre
}

function obfuscatePhone(phone: string | null): string {
  if (!phone) return "N/A";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length >= 6) {
    return `${cleaned.substring(0, 3)} *** ***`;
  }
  return "*** *** ***";
}

function obfuscateEmail(email: string | null): string {
  if (!email) return "N/A";
  const parts = email.split("@");
  if (parts.length === 2) {
    return `***@***.${parts[1].split(".").pop()}`;
  }
  return "***@***.***";
}

export const Clients = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [openId, setOpenId] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado de verificación
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [revealedContact, setRevealedContact] = useState<any>(null);
  const [honeypot, setHoneypot] = useState("");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  const isPanningRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

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

  const scrollToIndex = (idx: number, behavior: ScrollBehavior = "smooth") => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const children = scroller.children;
    const el = children[idx] as HTMLElement | undefined;
    if (!el) return;
    const delta = el.offsetLeft - (scroller.clientWidth - el.clientWidth) / 2;
    scroller.scrollTo({ left: delta, behavior });
  };

  useEffect(() => {
    if (clients.length > 0) {
      setTimeout(() => scrollToIndex(0, "auto"), 100);
    }
  }, [clients.length]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => {
      const centerX = scroller.scrollLeft + scroller.clientWidth / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      Array.from(scroller.children).forEach((child, idx) => {
        const el = child as HTMLElement;
        const elCenter = el.offsetLeft + el.clientWidth / 2;
        const dist = Math.abs(centerX - elCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });
      setActive(bestIdx);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    setTimeout(() => onScroll(), 200);
    
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [clients.length]);

  const go = (dir: "left" | "right") => {
    const next = Math.max(0, Math.min(clients.length - 1, active + (dir === "left" ? -1 : 1)));
    setActive(next);
    scrollToIndex(next);
  };

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== 1) return;
    e.preventDefault();
    const scroller = scrollerRef.current;
    if (!scroller) return;
    isPanningRef.current = true;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = scroller.scrollLeft;
    scroller.style.cursor = "grabbing";
    scroller.classList.add("select-none");
  };

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isPanningRef.current) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const dx = e.clientX - startXRef.current;
    scroller.scrollLeft = startScrollLeftRef.current - dx;
  };

  const endPan = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    isPanningRef.current = false;
    scroller.style.cursor = "grab";
    scroller.classList.remove("select-none");
  };

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scroller.scrollLeft += e.deltaY;
    }
  };

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
      <div className="py-20 bg-mine-shaft2">
        <div className="content m-auto">
          <div className="text-center text-alabasters">
            <h3 className="text-white text-4xl font-bold">Nuestros clientes</h3>
            <p className="my-12 max-w-[60em] w-[100%] m-auto">
              Confían en nosotros para diseñar, integrar y operar soluciones críticas de negocio.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-white/70">Cargando clientes...</div>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center text-white/70 py-12">
              No hay clientes disponibles en este momento.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-end gap-3 mb-4 text-white">
                <button
                  onClick={() => go("left")}
                  disabled={active === 0}
                  className="rounded-full bg-white/10 hover:bg-white/20 px-3 py-2 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Anterior"
                >
                  ‹
                </button>
                <button
                  onClick={() => go("right")}
                  disabled={active === clients.length - 1}
                  className="rounded-full bg-white/10 hover:bg-white/20 px-3 py-2 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Siguiente"
                >
                  ›
                </button>
              </div>

              <div
                ref={scrollerRef}
                className="overflow-x-auto no-scrollbar flex gap-6 pb-4 snap-x snap-mandatory cursor-grab"
                style={{ paddingLeft: 'calc(50% - 210px)', paddingRight: 'calc(50% - 210px)' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseLeave={endPan}
                onMouseUp={endPan}
                onWheel={handleWheel}
              >
                {clients.map((c, idx) => (
                  <motion.div
                    key={c.id}
                    className={`snap-center min-w-[280px] sm:min-w-[360px] lg:min-w-[420px] rounded-2xl bg-[#0f0f10] border border-white/10 text-white overflow-hidden relative isolate transition-all duration-300
                                ${idx === active ? "ring-2 ring-white/30 shadow-2xl" : ""}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r ${
                        c.gradient_class || "from-[#542DA0] to-[#8887E8]"
                      }`}
                    />

                    <div className="p-6 pt-7">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden ring-1 ring-white/10">
                          {c.logo_url ? (
                            <img
                              src={c.logo_url}
                              alt={`${c.name} logo`}
                              className={`w-12 h-12 object-contain transition-all duration-500 ${
                                idx === active 
                                  ? "" 
                                  : "grayscale opacity-40"
                              }`}
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-3xl">🏢</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-bold leading-tight truncate">{c.name}</h4>
                          <p className="text-sm text-white/60 mt-0.5">{c.sector}</p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm text-white/80 leading-relaxed line-clamp-3">
                        {c.blurb}
                      </p>

                      <button
                        onClick={() => setOpenId(c.id)}
                        className="mt-5 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors group"
                      >
                        Ver más
                        <span aria-hidden className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

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
                        className={`h-40 bg-gradient-to-r ${c.gradient_class || "from-[#542DA0] to-[#8887E8]"}`}
                      />
                      
                      <div className="absolute -bottom-16 left-8">
                        <div className="w-32 h-32 rounded-2xl bg-white shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-white">
                          {c.logo_url ? (
                            <img
                              src={c.logo_url}
                              alt={`${c.name} logo`}
                              className="w-28 h-28 object-contain"
                            />
                          ) : (
                            <span className="text-6xl">🏢</span>
                          )}
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

                    <div className="pt-20 px-8 pb-8">
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
                      {((c as any).contact_name || (c as any).contact_email || (c as any).contact_phone) && (
                        <div className="border-t pt-6">
                          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                            Información de Contacto
                          </h4>
                          
                          {!verified ? (
                            // Vista ofuscada
                            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                              {(c as any).contact_name && (
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Contacto</p>
                                    <p className="font-semibold text-gray-900">{obfuscateName((c as any).contact_name)}</p>
                                    {(c as any).contact_position && (
                                      <p className="text-sm text-gray-600">{(c as any).contact_position}</p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {(c as any).contact_phone && (
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Teléfono</p>
                                    <p className="font-semibold text-gray-500">{obfuscatePhone((c as any).contact_phone)}</p>
                                  </div>
                                </div>
                              )}

                              {(c as any).contact_email && (
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Email</p>
                                    <p className="font-semibold text-gray-500">{obfuscateEmail((c as any).contact_email)}</p>
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