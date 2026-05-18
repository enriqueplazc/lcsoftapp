// src/sections/Home/ServicesGrid.tsx
import { Element } from "react-scroll";
import { Section } from "../../components/Section";
import { services as baseServices } from "../../content/home";
import { CardService } from "../../components/CardService";
import { Cpu, Globe, Cable, FileSpreadsheet, ShieldCheck, Wrench, Bot, BarChart3 } from "lucide-react";

const iconById: Record<string, JSX.Element> = {
  "1": <Cpu className="w-6 h-6 text-slate-700" />,
  "2": <Globe className="w-6 h-6 text-slate-700" />,
  "3": <Cable className="w-6 h-6 text-slate-700" />,
  "4": <FileSpreadsheet className="w-6 h-6 text-slate-700" />,
  "5": <ShieldCheck className="w-6 h-6 text-slate-700" />,
  "6": <Wrench className="w-6 h-6 text-slate-700" />,
  "7": <Bot className="w-6 h-6 text-slate-700" />,
  "8": <BarChart3 className="w-6 h-6 text-slate-700" />,
};

// degradés por tarjeta
const gradientById: Record<string, string> = {
  "1": "bg-gradient-to-r from-[#542DA0] to-[#3b82f6]",  // violeta → azul
  "2": "bg-gradient-to-r from-[#8887E8] to-[#a855f7]",  // lila → morado
  "3": "bg-gradient-to-r from-[#ef4444] to-[#f97316]",  // rojo → naranja
  "4": "bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9]",  // cyan → sky
  "5": "bg-gradient-to-r from-[#f59e0b] to-[#ef4444]",  // ámbar → rojo
  "6": "bg-gradient-to-r from-[#22d3ee] to-[#14b8a6]",  // cyan → teal
  "7": "bg-gradient-to-r from-[#10b981] to-[#4ade80]",  // verde
  "8": "bg-gradient-to-r from-[#6366f1] to-[#0ea5e9]",  // indigo → sky
};

export const ServicesGrid = () => {
  const services = baseServices.map((s) => ({
    ...s,
    icon: iconById[s.id],
    gradientClass: gradientById[s.id],
  }));

  return (
    <Element name="service">
      <div className="py-20 bg-alabasters">
        <div className="content overflow-hidden m-auto grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-16 items-center">
          <div className="text-center lg:text-left">
            <h3 className="text-5xl font-extrabold">Nuestros servicios profesionales</h3>
            <p className="mt-6">
              Software empresarial, desarrollo web a medida, integraciones ERP, IA aplicada, datos & analítica y más.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-strecth">
            {services.map((v, index) => (
              <Section key={v.id} id={`svc-${v.id}`} y={20 * (index + 1)}>
                <CardService value={v} />
              </Section>
            ))}
          </div>
        </div>
      </div>
    </Element>
  );
};
