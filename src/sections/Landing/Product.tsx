import { productFeatures, stats } from "../../content/landing";
import { Container, GradientText, ICONS, Reveal, SectionHeading } from "./ui";

export function Product() {
  return (
    <section id="producto" className="relative scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="TDIPLAN v5.0"
          title={<>Tu planilla, <GradientText>de principio a fin</GradientText></>}
          subtitle="Todo lo que tu área de RR.HH. necesita para calcular, cerrar y declarar la planilla en un solo sistema, pensado para empresas con personal administrativo y de obra."
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productFeatures.map((f, i) => {
            const Icon = ICONS[f.icon];
            return (
              <Reveal key={f.title} delay={i * 0.05} className={f.full ? "sm:col-span-2 lg:col-span-3" : f.wide ? "lg:col-span-2" : ""}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-white/20 hover:bg-white/[0.05]">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#2E7FA0]/0 blur-3xl transition-colors duration-500 group-hover:bg-[#2E7FA0]/25"
                  />
                  <div className="relative">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2E7FA0] to-[#5DADC6] shadow-lg shadow-[#2E7FA0]/30">
                      {Icon && <Icon className="h-5 w-5 text-white" aria-hidden />}
                    </span>
                    <h3 className="mt-5 text-lg font-semibold text-white">{f.title}</h3>
                    <p className="mt-2 leading-relaxed text-slate-400">{f.text}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-16">
          <dl className="grid grid-cols-1 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 px-6 py-8 text-center">
                <dt className="order-2 text-sm text-slate-400">{s.label}</dt>
                <dd className="order-1 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-4xl font-semibold text-transparent sm:text-5xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
