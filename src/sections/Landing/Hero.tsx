import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Users, Wallet, CalendarCheck, FileCheck2 } from "lucide-react";
import { hero } from "../../content/landing";
import { whatsappLink } from "../../content/site";
import { Container, GradientText } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;

/** Maqueta ilustrativa de la pantalla de TDIPLAN (datos de ejemplo). */
function ProductMockup() {
  const rows = [
    { name: "Personal de obra · Lima", n: 412, status: "Cerrada" },
    { name: "Administrativos", n: 86, status: "Cerrada" },
    { name: "Obra Collique · Etapa II", n: 236, status: "En revisión" },
    { name: "Obra Arequipa", n: 174, status: "Calculando" },
  ];
  const chip: Record<string, string> = {
    Cerrada: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
    "En revisión": "bg-amber-400/10 text-amber-300 ring-amber-400/20",
    Calculando: "bg-sky-400/10 text-sky-300 ring-sky-400/20",
  };

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#0d0f1a]/90 p-2 shadow-2xl shadow-[#2E7FA0]/20 backdrop-blur">
      <div className="flex items-center gap-1.5 px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        <span className="ml-3 text-xs text-slate-500">TDIPLAN v5.0 · Planilla mensual</span>
      </div>
      <div className="rounded-xl border border-white/5 bg-[#0a0c15] p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Users, label: "Trabajadores", value: "908" },
            { icon: Wallet, label: "Neto a pagar", value: "S/ 2.4M" },
            { icon: CalendarCheck, label: "Tareos", value: "98%" },
            { icon: FileCheck2, label: "PLAME", value: "Listo" },
          ].map((k) => (
            <div key={k.label} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
              <k.icon className="h-4 w-4 text-[#5DADC6]" aria-hidden />
              <p className="mt-2 text-[11px] text-slate-500">{k.label}</p>
              <p className="text-lg font-semibold text-white">{k.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-white/5">
          {rows.map((r, i) => (
            <div
              key={r.name}
              className={`flex items-center justify-between gap-3 px-3 py-2.5 text-xs ${i % 2 ? "bg-white/[0.02]" : ""}`}
            >
              <span className="truncate text-slate-300">{r.name}</span>
              <span className="ml-auto hidden text-slate-500 sm:block">{r.n} trab.</span>
              <span className={`rounded-full px-2 py-0.5 ring-1 ${chip[r.status]}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="px-3 pb-1 pt-2 text-right text-[10px] text-slate-600">Vista ilustrativa</p>
    </div>
  );
}

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Fondo: brillos y retícula */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#2E7FA0]/30 blur-[120px]" />
        <div className="absolute right-[-10%] top-[30%] h-[380px] w-[480px] rounded-full bg-[#93D5E1]/15 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      </div>

      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col items-start gap-7">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl"
          >
            {hero.title} <GradientText>{hero.titleAccent}</GradientText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="max-w-xl text-lg leading-relaxed text-slate-400"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="flex flex-wrap gap-3"
          >
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-[#5DADC6] px-6 py-3 font-semibold text-[#101322] shadow-lg shadow-[#5DADC6]/25 transition hover:bg-[#7cc0d6]"
            >
              Solicitar una demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Ver nuestros servicios
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400"
          >
            {["Régimen General y Construcción Civil", "PLAME y AFP", "Soporte en Perú"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#93D5E1]" aria-hidden />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          style={{ perspective: 1200 }}
        >
          <ProductMockup />
        </motion.div>
      </Container>
    </section>
  );
}
