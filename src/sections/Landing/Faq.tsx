import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "../../content/landing";
import { Container, Reveal, SectionHeading } from "./ui";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="preguntas" className="scroll-mt-20 py-24 sm:py-32">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Preguntas frecuentes" title="Lo que suelen preguntarnos" />
        <Reveal className="mt-12">
          <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-medium text-white"
                    >
                      {f.q}
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </button>
                  </h3>
                  <div
                    className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <p className="overflow-hidden px-6 text-slate-400">
                      <span className="block pb-5">{f.a}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
