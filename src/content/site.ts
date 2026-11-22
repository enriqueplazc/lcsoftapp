// src/content/site.ts
// Datos de contacto y SEO centralizados: cámbialos aquí y se actualizan en toda la web.

export const SITE = {
  name: "LC Software & Consultoría",
  shortName: "LC Soft",
  url: "https://lcsoft.pe",
  description:
    "Software de planillas TDIPLAN para Régimen General y Construcción Civil, outsourcing de planillas y desarrollo de software a medida en Perú desde 2011.",
  phoneDisplay: "+51 939 831 937",
  phoneE164: "+51939831937",
  whatsappNumber: "51939831937", // código de país + número, sin + ni espacios
  salesEmail: "elazaro@lcsoft.pe",
  linkedin: "https://www.linkedin.com/company/lc-software-consultoria",
  foundedYear: 2011,
};

export function whatsappLink(
  message = "Hola, quisiera agendar una demo de TDIPLAN y conocer sus servicios."
) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
