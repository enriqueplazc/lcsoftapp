// Piezas visuales compartidas por las secciones de la home
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  HardHat, FileCheck2, Receipt, ClipboardList, Warehouse, Plug, Globe, Workflow,
  Database, Sparkles, type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  HardHat, FileCheck2, Receipt, ClipboardList, Warehouse, Plug, Globe, Workflow, Database, Sparkles,
};

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-[#93D5E1]">
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#5DADC6] to-[#F3F6FF]" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow, title, subtitle, align = "center",
}: { eyebrow: string; title: ReactNode; subtitle?: ReactNode; align?: "center" | "left" }) {
  const a = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  return (
    <Reveal className={`flex max-w-3xl flex-col gap-5 ${a}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h2>
      {subtitle && <p className="text-base leading-relaxed text-slate-400 sm:text-lg">{subtitle}</p>}
    </Reveal>
  );
}

export function GradientText({ children }: { children: ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-[#F3F6FF] via-[#93D5E1] to-[#5DADC6] bg-clip-text text-transparent">
      {children}
    </span>
  );
}
