import { useEffect } from "react";
import { SITE } from "../content/site";

/** Título y descripción por página (las etiquetas base están en index.html). */
export function useSeo(title?: string, description?: string, path = "/") {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE.name}` : SITE.name;
    const desc = description ?? SITE.description;
    document.querySelector('meta[name="description"]')?.setAttribute("content", desc);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", SITE.url + path);
  }, [title, description, path]);
}
