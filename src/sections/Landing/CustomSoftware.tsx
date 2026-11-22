import { customSoftware } from "../../content/landing";
import { Container, GradientText, ICONS, Reveal, SectionHeading } from "./ui";

export function CustomSoftware() {
  return (
    <section id="a-medida" className="relative scroll-mt-20 py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              align="left"
              eyebrow="Desarrollo a medida"
              title={<>Software hecho <GradientText>para tu negocio</GradientText></>}
              subtitle={customSoftware.subtitle}
            />
            <Reveal delay={0.1}>
              <ol className="mt-10 grid gap-4 sm:grid-cols-2">
                {customSoftware.steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-sm font-medium text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-white">{s.title}</p>
                      <p className="text-sm text-slate-400">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {customSoftware.capabilities.map((c, i) => {
              const Icon = ICONS[c.icon];
              return (
                <Reveal key={c.title} delay={i * 0.06} className={i % 2 ? "sm:translate-y-10" : ""}>
                  <article className="h-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-7">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      {Icon && <Icon className="h-5 w-5 text-[#93D5E1]" aria-hidden />}
                    </span>
                    <h3 className="mt-5 text-lg font-semibold text-white">{c.title}</h3>
                    <p className="mt-2 leading-relaxed text-slate-400">{c.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
