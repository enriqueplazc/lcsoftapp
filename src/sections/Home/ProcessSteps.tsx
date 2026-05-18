import { Element } from "react-scroll";
import { Section } from "../../components/Section";
import { processSteps } from "../../content/home";
import {
  type LucideIcon,
  Search, Workflow, Code2, Cable, ShieldCheck, Rocket, LifeBuoy, Sparkles, Gauge, Circle
} from "lucide-react";

// mapa string -> componente (evita el error de tipos)
const iconMap: Record<string, LucideIcon> = {
  search: Search,
  workflow: Workflow,
  "code-2": Code2,
  cable: Cable,
  "shield-check": ShieldCheck,
  rocket: Rocket,
  "life-buoy": LifeBuoy,
  sparkles: Sparkles,
  gauge: Gauge, // <-- nuevo
};

export const ProcessSteps = () => (
  <Element name="processes">
    <div className="gradient py-20">
      <div className="content overflow-hidden m-auto text-gray-100">
        <div className="text-center">
          <h3 className="text-white text-4xl font-bold">
            Nuestro proceso de diseño y desarrollo Web
          </h3>
          <p className="my-12 max-w-[60em] w-[100%] m-auto">
            En LC SOFTWARE & CONSULTORIA SAC combinamos la experiencia en
            desarrollo de software empresarial con el diseño web a medida.
            Nuestro proceso ofrece soluciones eficientes, escalables y
            adaptadas a cada cliente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((s, i) => {
            const Icon = iconMap[s.icon as keyof typeof iconMap] ?? Circle;
            return (
              <Section key={s.num} id={`step-${s.num}`} y={30 * (i + 1)}>
                <div className="border border-tundora p-6 rounded-xl flex flex-col gap-4">
                  <div className="w-16 h-16 rounded-xl bg-color-primary flex items-center justify-center">
                    <Icon size={34} strokeWidth={2.25} className="text-[#072723]" />
                  </div>
                  <h4 className="text-2xl font-extrabold">{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </Section>
            );
          })}
        </div>
      </div>
    </div>
  </Element>
);
