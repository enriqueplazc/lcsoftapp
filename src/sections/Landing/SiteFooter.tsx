import { Link } from "react-router-dom";
import logo from "../../assets/logo/lc-logo-text-left-white.png";
import { SITE } from "../../content/site";
import { Container } from "./ui";

const COLS = [
  {
    title: "Producto",
    links: [
      { label: "TDIPLAN · Planillas", href: "/#producto" },
      { label: "TDIALM · Almacén de obras", href: "/#producto" },
      { label: "Nuestros servicios", href: "/#servicios" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Software a medida", href: "/#a-medida" },
      { label: "Clientes", href: "/#clientes" },
      { label: "Nosotros", href: "/#nosotros" },
      { label: "Blog", href: "/#blog" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#080a13]">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <img src={logo} alt="LC Software & Consultoría" className="h-9 w-auto self-start" width={144} height={36} loading="lazy" />
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">{SITE.description}</p>
        </div>
        {COLS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="text-sm font-semibold text-white">{c.title}</h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              {c.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-white">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <h2 className="text-sm font-semibold text-white">Contacto</h2>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
            <li><a href={`tel:${SITE.phoneE164}`} className="hover:text-white">{SITE.phoneDisplay}</a></li>
            <li><a href={`mailto:${SITE.salesEmail}`} className="hover:text-white">{SITE.salesEmail}</a></li>
            <li><Link to="/contact" className="hover:text-white">Formulario de contacto</Link></li>
            <li><a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a></li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/5">
        <Container className="flex flex-col gap-2 py-6 text-xs text-slate-500 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.</span>
          <span>Lima, Perú</span>
        </Container>
      </div>
    </footer>
  );
}
