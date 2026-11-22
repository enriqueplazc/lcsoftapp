import { Check, Sparkles } from "lucide-react";
import { lite, services } from "../../content/landing";
import { whatsappLink } from "../../content/site";
import { Container, Reveal, SectionHeading } from "./ui";

export function Services() {
  return (
    <section id="servicios" className="relative scroll-mt-20 py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-[420px] max-w-4xl rounded-full bg-[#2E7FA0]/20 blur-[140px]" />
      <Container className="relative">
        <SectionHeading
          eyebrow="Nuestros servicios"
          title="Elige cómo quieres trabajar con nosotros"
          subtitle="Desde el software para que tu equipo lleve la planilla, hasta que nosotros nos encarguemos de todo."
        />

        {/* Novedad: versión Lite */}
        <Reveal className="mt-16">
          <article
            id="lite"
            className="relative scroll-mt-28 overflow-hidden rounded-3xl border border-[#5DADC6]/30 bg-gradient-to-r from-[#14374a] via-[#121a30] to-[#111527] p-8 sm:p-10"
          >
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#5DADC6]/25 blur-[90px]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5DADC6] px-3 py-1 text-xs font-semibold text-[#101322]">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden /> Nuevo
                  </span>
                  <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300">{lite.badge}</span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-white sm:text-3xl">{lite.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-300">{lite.text}</p>
              </div>
              <div className="flex flex-col gap-5">
                <ul className="flex flex-col gap-3">
                  {lite.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-sm text-slate-200">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#5DADC6]" aria-hidden />
                      {h}
                    </li>
                  ))}
                </ul>
                <a
                  href={whatsappLink(`Hola, quiero enterarme primero del lanzamiento de ${lite.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center rounded-full bg-[#5DADC6] px-5 py-3 text-sm font-semibold text-[#101322] transition hover:bg-[#7cc0d6] sm:self-start"
                >
                  {lite.cta}
                </a>
              </div>
            </div>
          </article>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08}>
              <article
                className={`relative flex h-full flex-col rounded-3xl p-7 ${
                  s.highlighted
                    ? "border border-transparent bg-[#111527] [background:linear-gradient(#111527,#111527)_padding-box,linear-gradient(135deg,#5DADC6,#F3F6FF)_border-box] shadow-2xl shadow-[#2E7FA0]/30"
                    : "border border-white/10 bg-white/[0.03]"
                }`}
              >
                {s.highlighted && (
                  <span className="absolute -top-3 left-8 rounded-full bg-[#5DADC6] px-3 py-1 text-xs font-semibold text-[#101322]">
                    Más elegido
                  </span>
                )}
                <h3 className="text-xl font-semibold text-white">{s.name}</h3>
                <p className="mt-1 text-sm text-[#93D5E1]">{s.tagline}</p>
                <p className="mt-5 leading-relaxed text-slate-400">{s.description}</p>
                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#93D5E1]" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={whatsappLink(`Hola, quisiera información sobre ${s.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 inline-flex justify-center rounded-full px-5 py-3 text-sm font-medium transition ${
                    s.highlighted
                      ? "bg-white text-slate-900 hover:bg-slate-200"
                      : "border border-white/15 text-white hover:bg-white/10"
                  }`}
                >
                  {s.cta}
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
