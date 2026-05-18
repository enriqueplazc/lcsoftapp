// Centralizamos el contenido del Home para LC SOFTWARE & CONSULTORÍA SAC
import type { Items } from "../components/Tabs";
import type { CardServiceItem } from "../components/CardService";
import wwd01 from "../assets/WWD01.jpg";
import wwd02 from "../assets/WWD02.jpg";
import wwd03 from "../assets/WWD03.jpg";

/* =========================
   Tabs: ¿Qué hacemos?
   ========================= */
export const itemsTab: Items[] = [
  {
    selected: true,
    header: { title: "¿Qué hacemos?" },
    content: {
      title: "¿Qué hacemos?",
      image: wwd01,
      texts: [
        "Arquitectura + RR.HH. + Operación",
        "Somos una Empresa full-stack de TI y Outsourcing de RR.HH. (desde 2011) que diseña, integra y opera soluciones con foco en resultados y continuidad operativa.",
        "Propuesta de Valor: ",
        "Arquitectura limpia y escalable: monolitos modulares o microservicios según el caso de negocio. Integración con ERP/Back-office: SAP, Navision, Dynamics, Starsoft, Odoo, pasarelas de pago, webhooks, schedulers y colas de mensajes.",
        "Observabilidad y control: versionado Git, CI/CD, logging, monitoreo, auditorías (bitácoras), RBAC y backups.",
        "Outsourcing de planillas y sistemas internos de gestión: altas, tareos, reportes y cierre de planilla electrónica (AFP, PLAME, etc.).",
        "Resultados Esperados:",
        "Menos fricción operativa, más velocidad al cambio.",
        "Trazabilidad end-to-end para auditorías y compliance.",
        "Reducción de costos por automatización y errores evitados."
      ],
    },
  },
  {
    selected: false,
    header: { title: "Desarrollo Web" },
    content: {
      title: "Desarrollo Web",
      image: wwd02,
      texts: [
        "Stack: React + Vite + Tailwind, manejo de datos con TanStack Query. SSR/ISR con Next cuando el SEO o el render del lado servidor lo justifican.",
        "Capicidades Clave:",
        "APIs REST/GraphQL con autenticación JWT/cookies y autorización por roles. Calidad y performance: pruebas (Vitest/Playwright), accesibilidad WCAG 2.1 AA, Lighthouse 90+.",
        "Beneficio Ejecutivo:",
        "Time-to-market corto, sin deuda técnica oculta.",
        "Fronts rápidos, accesibles y listos para escalar ventas.",
      ],
    },
  },
  {
    selected: false,
    header: { title: "Integraciones y Soporte" },
    content: {
      title: "Integraciones y Soporte",
      image: wwd03,
      texts: [
        "Conectividad Enterprise:",
        "OAuth2, SSO, Webhooks, RabbitMQ/Kafka. ETL hacia data warehouse para analítica y reporting.",
        "Operación y Continuidad:",
        "Mantenimiento preventivo y evolutivo con SLAs.",
        "Monitoreo, alertas proactivas, planes de continuidad.",
        "Capacitación a usuarios, documentación técnica/funcional y handover ordenado.",
        "Impacto:",
        "Menos caídas, menos tickets, más foco del negocio en vender y operar."
      ],
    },
  },
];

/* =========================
   Proceso: pasos + icono (lucide-react)
   ========================= */
export const processSteps = [
  { num: "1", title: "Análisis y diagnóstico", desc: "Levantamiento de información, objetivos, alcance y requerimientos.", icon: "search" },
  { num: "2", title: "Diseño funcional y arquitectura", desc: "Módulos, base de datos, casos de uso y UX/UI para web a medida.", icon: "workflow" },
  { num: "3", title: "Desarrollo e implementación", desc: "Backend y frontend con buenas prácticas y metodologías ágiles.", icon: "code-2" },
  { num: "4", title: "Integraciones y conectividad", desc: "ERP (SAP, Odoo, Dynamics, Navision), APIs y pasarelas de pago.", icon: "cable" },
  { num: "5", title: "Pruebas y seguridad", desc: "QA funcional, rendimiento, compatibilidad y control de acceso.", icon: "shield-check" },
  { num: "6", title: "Despliegue y capacitación", desc: "Puesta en producción, manuales y entrenamiento de usuarios.", icon: "rocket" },
  { num: "7", title: "Soporte y mejora continua", desc: "Mantenimiento, monitoreo y nuevas funcionalidades.", icon: "life-buoy" },
  { num: "8", title: "Observabilidad y métricas", desc: "Logging, trazabilidad, dashboards y KPIs para medir valor y detectar incidencias.", icon: "gauge" },
];


/* =========================
   Planes (placeholder)
   ========================= */


/* =========================
   Servicios (8 ítems para grid armónico)
   ========================= */
export const services: CardServiceItem[] = [
  {
    id: "1",
    title: "Software empresarial",
    text: "Soluciones a medida para procesos internos.",
    class: { borderColor: "border-b-blue-600", textColor: "text-b-blue-600" },
    content: "Módulos de planillas, almacenes, gestión de obra, compras, reportes y auditoría.",
  },
  {
    id: "2",
    title: "Desarrollo web",
    text: "Sitios y apps web rápidas y escalables.",
    class: { borderColor: "border-b-purple-600", textColor: "text-b-purple-600" },
    content: "React/Vite/Next, UX accesible, SEO, performance y CI/CD con entornos por rama.",
  },
  {
    id: "3",
    title: "Analisis de Datos",
    text: "Unimos tus sistemas y datos.",
    class: { borderColor: "border-b-red-600", textColor: "text-b-red-600" },
    content: "Modelado dimensional, ETL/ELT, data marts en PostgreSQL/BigQuery, dashboards (Power BI/Metabase/Superset) y KPIs para dirección.",
  },
  {
    id: "4",
    title: "Planillas",
    text: "Gestión integral y normativa al día.",
    class: { borderColor: "border-b-sky-600", textColor: "text-b-sky-600" },
    content: "Altas, tareos, informes, AFP y cierre electrónico; flujos y validaciones a medida.",
  },
  {
    id: "5",
    title: "QA y seguridad",
    text: "Pruebas y control de acceso.",
    class: { borderColor: "border-b-orange-600", textColor: "text-b-orange-600" },
    content: "Testing (unit/integ/E2E), hardening, RBAC, cifrado en tránsito/rep., backups y DR.",
  },
  {
    id: "6",
    title: "IA aplicada",
    text: "Mantenimiento y evolución.",
    class: { borderColor: "border-b-cyan-600", textColor: "text-b-cyan-600" },
    content: "Asistentes con LLMs, RAG sobre documentos internos, clasificación y extracción (OCR/NER), chatbots para soporte y backoffice. Integración con OpenAI/Azure AI, flujos con LangChain y seguridad de datos.",
  },
  
];

export type ClientItem = {
  id: string;
  name: string;
  logo: string;            // ruta del logo
  sector: string;
  blurb: string;           // 1 línea
  url?: string;            // enlace opcional
  gradientClass?: string;  // strip degradé opcional
};

export const clients: ClientItem[] = [
  {
    id: "c1",
    name: "China Geshouba Group",
    logo: "/logos/geshouba.png", // Agregar este logo
    sector: "Construcción Civil",
    blurb: "Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0",
    gradientClass: "from-[#06b6d4] to-[#0ea5e9]",
  },
  {
    id: "c2",
    name: "Sinohydro Corporation",
    logo: "/logos/sinohydro.png", // Agregar este logo
    sector: "Construcción Civil",
    blurb: "Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0",
    gradientClass: "from-[#10b981] to-[#4ade80]",
  },
  {
    id: "c3",
    name: "Consorcio Saneamiento Collique II",
    logo: "/logos/collique.png", // Agregar este logo
    sector: "Construcción Civil",
    blurb: "TDIPLAN v5.0 + Aplicación de Almacén de Obras TDIALM v5.0",
    gradientClass: "from-[#8887E8] to-[#a855f7]",
  },
  {
    id: "c4",
    name: "Ferralia Perú SAC",
    logo: "/logos/ferralia.png", // Agregar este logo
    sector: "Construcción Civil",
    blurb: "Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0",
    gradientClass: "from-[#542DA0] to-[#3b82f6]",
  },
  {
    id: "c5",
    name: "Constructora Málaga Hnos.",
    logo: "/logos/malaga.png", // Agregar este logo
    sector: "Construcción Civil",
    blurb: "Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0",
    gradientClass: "from-[#f59e0b] to-[#fbbf24]",
  },
  {
    id: "c6",
    name: "Ersindustries Perú SAC",
    logo: "/logos/ersindustries.png", // Agregar este logo
    sector: "Construcción Civil",
    blurb: "Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0",
    gradientClass: "from-[#ef4444] to-[#f97316]",
  },
  {
    id: "c7",
    name: "EOM Grupo",
    logo: "/logos/eom.png", // Agregar este logo
    sector: "Construcción Civil",
    blurb: "Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0",
    gradientClass: "from-[#14b8a6] to-[#06b6d4]",
  },
  {
    id: "c8",
    name: "Aceros y Concretos S.A.C.",
    logo: "/logos/aceros-concretos.png", // Agregar este logo
    sector: "Construcción Civil",
    blurb: "Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0",
    gradientClass: "from-[#6366f1] to-[#8b5cf6]",
  },
  {
    id: "c9",
    name: "BPS Asesores y Consultores",
    logo: "/logos/bps.png", // Agregar este logo
    sector: "Consultoría Contable",
    blurb: "Aplicación de Planillas de Régimen General y Construcción Civil TDIPLAN v5.0",
    gradientClass: "from-[#ec4899] to-[#d946ef]",
  },
];