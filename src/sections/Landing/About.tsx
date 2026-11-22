import { Eye, Target } from "lucide-react";
import { about } from "../../content/landing";
import { Container, Reveal, SectionHeading } from "./ui";

export function About() {
  return (
    <section id="nosotros" className="relative scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Nosotros" title={about.title} subtitle={about.text} />
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
          {[
            { icon: Target, title: "Misión", text: about.mission },
            { icon: Eye, title: "Visión", text: about.vision },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <article className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                <b.icon className="h-6 w-6 text-[#5DADC6]" aria-hidden />
                <h3 className="mt-4 text-2xl font-semibold text-white">{b.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-400">{b.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
