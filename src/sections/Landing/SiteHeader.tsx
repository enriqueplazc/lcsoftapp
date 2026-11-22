import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import logo from "../../assets/logo/lc-logo-text-left-white.png";
import { whatsappLink } from "../../content/site";
import { Container } from "./ui";

const NAV = [
  { href: "/#producto", label: "TDIPLAN" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#a-medida", label: "Software a medida" },
  { href: "/#clientes", label: "Clientes" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#blog", label: "Blog" },
];

export function SiteHeader({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid || scrolled || open ? "border-b border-white/10 bg-[#0b0d18]/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <Container className="flex h-20 items-center justify-between gap-6">
        <a href="/#inicio" className="shrink-0" aria-label="LC Soft, ir al inicio">
          <img src={logo} alt="LC Software & Consultoría" className="h-11 w-auto sm:h-12" width={192} height={48} />
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/contact" className="text-sm text-slate-300 transition-colors hover:text-white">
            Contacto
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
          >
            Solicitar demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-white lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-white/10 lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base text-slate-200 hover:bg-white/5"
              >
                {n.label}
              </a>
            ))}
            <Link to="/contact" className="rounded-lg px-3 py-3 text-base text-slate-200 hover:bg-white/5">
              Contacto
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-full bg-white px-4 py-3 text-center font-medium text-slate-900"
            >
              Solicitar demo
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
