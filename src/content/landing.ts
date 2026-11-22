// src/content/landing.ts
// Textos de la home. Lo marcado con LOREM es provisional: reemplazar cuando esté el texto final.

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const hero = {
  badge: "Software de planillas · Desde 2011",
  title: "Planillas sin errores.",
  titleAccent: "Software a medida que impulsa tu empresa.",
  subtitle:
    "TDIPLAN automatiza la planilla de Régimen General y Construcción Civil: boletas, AFP, PLAME y tareos de obra. Y nuestro equipo construye el software que tu operación necesita.",
};

export type Feature = { icon: string; title: string; text: string; wide?: boolean; full?: boolean };

export const productFeatures: Feature[] = [
  {
    icon: "HardHat",
    title: "Régimen General y Construcción Civil",
    text: "Un solo sistema para personal administrativo y de obra, con los conceptos de cada régimen. También Pesquero y Agrario, según lo requieras.",
    wide: true,
  },
  {
    icon: "FileCheck2",
    title: "Planilla electrónica",
    text: "Cierre de planilla con la información para PLAME y AFP lista para declarar.",
  },
  {
    icon: "Receipt",
    title: "Boletas de pago",
    text: "Genera las boletas de todos tus trabajadores en minutos.",
  },
  {
    icon: "ClipboardList",
    title: "Tareos y asistencia",
    text: "Registra tareos de obra, altas y bajas, y alimenta la planilla sin digitar dos veces.",
  },
  {
    icon: "Warehouse",
    title: "Almacén de obras TDIALM",
    text: "Controla ingresos, salidas y stock de materiales por obra, integrado con tu operación.",
  },
  {
    icon: "Plug",
    title: "Integración con tu ERP",
    text: "Conectamos con SAP, Dynamics, Navision, Starsoft u Odoo para que la contabilidad cuadre sola.",
    full: true,
  },
];

export const stats = [
  { value: "15+", label: "Años de experiencia" },
  { value: "20+", label: "Empresas que confían en nosotros" },
  { value: "4", label: "Regímenes laborales: General, Construcción Civil, Pesquero y Agrario" },
];

export type Service = {
  name: string;
  tagline: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

export const services: Service[] = [
  {
    name: "TDIPLAN Esencial",
    tagline: "Tu planilla en orden, en tu propia oficina",
    description:
      "El sistema de planillas para que tu equipo procese, cierre y declare cada periodo con seguridad y con la información siempre bajo tu control.",
    features: [
      "Módulo de Régimen General y/o Construcción Civil",
      "Instalación local: tu información se guarda en tus propios equipos, no en la nube",
      "Cálculo de aportes a AFP y archivos para PLAME listos para declarar",
      "Reportes mensuales y semanales",
    ],
    cta: "Solicitar información",
  },
  {
    name: "TDIPLAN Profesional",
    tagline: "TDIPLAN adaptado a tu forma de trabajar",
    description:
      "Todo lo de Esencial, más un equipo que te acompaña y adapta el sistema a la manera en que tu empresa maneja su planilla.",
    features: [
      "Todo lo incluido en TDIPLAN Esencial",
      "Régimen General y Construcción Civil en un solo sistema",
      "Asesoría personalizada de especialistas en planillas",
      "Nos adecuamos a tu tipo de planilla: conceptos, centros de costo y formatos propios",
      "Reportes a medida para gerencia y contabilidad",
      "Capacitación a tu equipo y soporte prioritario",
    ],
    highlighted: true,
    cta: "Agendar una demo",
  },
  {
    name: "Outsourcing de planillas",
    tagline: "Nosotros llevamos tu planilla",
    description:
      "Procesamos la nómina de tus empleados y de tu personal de construcción civil de principio a fin, para que tú te enfoques en tu negocio.",
    features: [
      "Planilla de Régimen General y Construcción Civil",
      "Boletas de pago de todos tus trabajadores",
      "Declaración de PLAME y AFP, o entrega de los archivos listos si prefieres declarar tú",
      "Reportes semanales y mensuales",
    ],
    cta: "Hablar con un asesor",
  },
  {
    name: "TDI Almacenes",
    tagline: "Control de materiales por obra",
    description:
      "Gestiona el almacén de tus obras con la misma confianza de TDIPLAN: qué entra, qué sale y qué queda en cada obra.",
    features: [
      "Ingresos y salidas de materiales por obra",
      "Control de stock por almacén y por obra",
      "Kardex y reportes de consumo",
      "Integración con TDIPLAN y con tu ERP",
    ],
    cta: "Solicitar información",
  },
];

// Novedad: versión Lite (web): ligera pero completa
export const lite = {
  name: "TDIPLAN Lite",
  badge: "Próximamente",
  announcement: "Nuevo: TDIPLAN Lite, ligera, completa y 100% web",
  title: "TDIPLAN Lite: ligera, completa y 100% web",
  text:
    "Todo lo que la mayoría de empresas necesita para su planilla, en una versión web rápida y sin instalaciones. Entras desde cualquier navegador y trabajas con la misma confianza de TDIPLAN.",
  highlights: [
    "Cubre los requerimientos de planilla de la mayoría de empresas",
    "100% web: sin instalar nada, desde cualquier navegador",
    "Rápida, ligera y fácil de usar",
  ],
  cta: "Quiero enterarme primero",
};

export const customSoftware = {
  title: "Software a medida",
  subtitle:
    "Diseñamos, construimos y operamos plataformas web, aplicaciones y sistemas de gestión hechos a la medida de tu negocio, para empresas de cualquier sector y con la misma disciplina con la que construimos TDIPLAN.",
  capabilities: [
    { icon: "Globe", title: "Plataformas web y apps", text: "Portales, plataformas SaaS y aplicaciones rápidas, seguras y listas para escalar." },
    { icon: "Workflow", title: "Sistemas de gestión", text: "Automatizamos procesos internos: compras, almacenes, obras, reportes y auditoría." },
    { icon: "Database", title: "Datos e integraciones", text: "APIs, ERP, pasarelas de pago y dashboards para decidir con datos." },
    { icon: "Sparkles", title: "IA aplicada", text: "Asistentes, búsqueda sobre tus documentos y automatización con inteligencia artificial." },
  ],
  steps: [
    { title: "Diagnóstico", text: "Entendemos tu proceso, objetivos y alcance." },
    { title: "Diseño", text: "Arquitectura, prototipos y experiencia de usuario." },
    { title: "Desarrollo", text: "Entregas cortas, pruebas y tu feedback en cada etapa." },
    { title: "Lanzamiento y soporte", text: "Puesta en producción, capacitación y mejora continua." },
  ],
};

export const about = {
  title: "Sobre LC Soft",
  text:
    "Somos una empresa peruana de tecnología y outsourcing de RR.HH. que desde 2011 diseña, integra y opera soluciones con foco en resultados: software de planillas, sistemas a medida y soporte continuo.",
  // LOREM: reemplazar por la misión y visión definitivas
  mission: LOREM,
  vision: LOREM,
};

export const faqs = [
  {
    q: "¿TDIPLAN sirve para empresas de construcción?",
    a: "Sí. TDIPLAN maneja en un solo sistema la planilla de Régimen General y la de Construcción Civil, incluyendo tareos de obra.",
  },
  {
    q: "¿Genera los archivos para PLAME y AFP?",
    a: "Sí. El cierre de planilla genera la información para la planilla electrónica (PLAME) y las AFP.",
  },
  {
    q: "¿Se puede integrar con mi ERP o sistema contable?",
    a: "Sí. Tenemos experiencia integrando con SAP, Microsoft Dynamics, Navision, Starsoft y Odoo, entre otros.",
  },
  {
    q: "¿Pueden llevar la planilla por nosotros?",
    a: "Sí. Con nuestro servicio de outsourcing de planillas nos encargamos del proceso completo, de las altas al cierre mensual.",
  },
  {
    q: "¿También desarrollan software a medida?",
    a: "Sí. Construimos plataformas web y sistemas internos a medida, y damos soporte y mantenimiento después del lanzamiento.",
  },
];
