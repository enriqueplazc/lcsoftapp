import { ArrowRight, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { SITE, whatsappLink } from "../../content/site";
import { Container, Reveal } from "./ui";

export function FinalCta() {
  return (
    <section id="contacto" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#14374a] via-[#121a30] to-[#101322] px-6 py-16 text-center sm:px-16">
            <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full bg-[#5DADC6]/30 blur-[100px]" />
            <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                ¿Listo para dejar de pelear con la planilla?
              </h2>
              <p className="text-lg text-slate-300">
                Agenda una demo de TDIPLAN o cuéntanos tu proyecto a medida. Te respondemos lo antes posible.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-slate-900 transition hover:bg-slate-200"
                >
                  Escríbenos por WhatsApp
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-medium text-white transition hover:bg-white/10"
                >
                  Formulario de contacto
                </Link>
              </div>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-slate-300">
                <a href={`tel:${SITE.phoneE164}`} className="inline-flex items-center gap-2 hover:text-white">
                  <Phone className="h-4 w-4" aria-hidden /> {SITE.phoneDisplay}
                </a>
                <a href={`mailto:${SITE.salesEmail}`} className="inline-flex items-center gap-2 hover:text-white">
                  <Mail className="h-4 w-4" aria-hidden /> {SITE.salesEmail}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
