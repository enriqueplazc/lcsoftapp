import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface CardServiceItem {
  id: string;
  title: string;
  text: string;
  content: string;
  class: {
    borderColor: string; // ej: 'border-b-blue-600' (se usa en títulos/bordes internos si quieres)
    textColor: string;   // ej: 'text-b-blue-600'
  };
  /** Ícono opcional (Lucide/Heroicons/etc.) */
  icon?: React.ReactNode;
  /** Clases Tailwind para el degradé. Ej: "bg-gradient-to-r from-[#542DA0] to-[#8887E8]" */
  gradientClass?: string;
}

interface CardServiceProps {
  value: CardServiceItem;
}

export function CardService({ value }: CardServiceProps): JSX.Element {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Bloquear scroll del body cuando el modal está abierto + cerrar con ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedId(null);

    if (selectedId) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKeyDown);
    } else {
      document.body.style.overflowY = 'auto';
    }
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedId]);

  return (
    <>
      {/* CARD */}
      <motion.div
        layoutId={value.id}
        onClick={() => setSelectedId(value.id)}
        className={`relative bg-white cursor-pointer rounded-xl px-6 pt-6 pb-8 w-full h-full
                    flex flex-col shadow-sm card-glow
                    transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg
                    min-h-[190px]`}
      >
        {/* Strip inferior con gradiente */}
        <span
          aria-hidden
          className={`glow-strip pointer-events-none absolute left-0 right-0 bottom-0 h-1 rounded-b-xl ${value.gradientClass ?? ''}`}
        />

        {/* Ícono opcional */}
        {value.icon ? (
          <div className="mb-3 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            {value.icon}
          </div>
        ) : null}

        <h4 className={`text-2xl font-bold ${value.class.textColor}`}>{value.title}</h4>

        {/* Descripción (mantener estable la altura; si usas plugin line-clamp, puedes añadir line-clamp-2) */}
        <p className="mt-3 text-slate-700">
          {value.text}
        </p>
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            key="service-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedId(null)}
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              layoutId={selectedId}
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="relative max-w-[50em] w-[90%] bg-white rounded-xl p-6 sm:p-8 shadow-xl"
            >
              {/* Strip superior con gradiente */}
              <span
                aria-hidden
                className={`pointer-events-none absolute left-0 right-0 top-0 h-1 rounded-t-xl ${value.gradientClass ?? ''}`}
              />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {value.icon ? (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      {value.icon}
                    </div>
                  ) : null}
                  <h4 className={`text-2xl font-bold ${value.class.textColor}`}>
                    {value.title}
                  </h4>
                </div>

                <button
                  onClick={() => setSelectedId(null)}
                  aria-label="Cerrar"
                  className="p-1 rounded-md hover:bg-slate-100 transition"
                >
                  <XMarkIcon className="w-6 h-6 text-slate-700" />
                </button>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-slate-700 leading-relaxed">{value.content}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
