// src/sections/Home/Articles.tsx - VERSIÓN CON SUPABASE
import React from "react";
import { Element } from "react-scroll";
import { Section } from "../../components/Section";
import { CardArticle, CardArticleSkeleton } from "../../components/CardArticle";
import { supabase } from "../../lib/supabase";

type Article = {
  id: number;
  title: string;
  excerpt: string | null;
  main_image_url: string | null;
  published_date: string | null;
  views: number;
  slug: string;
};

export const Articles = () => {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, excerpt, main_image_url, published_date, views, slug")
        .eq("status", "published")
        .order("published_date", { ascending: false })
        .limit(6); // Mostrar solo los últimos 6 artículos

      if (error) throw error;
      
      setArticles(data || []);
    } catch (error) {
      console.error("Error cargando artículos:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section id="article">
      <Element name="article">
        <div className="py-20 bg-white">
          <div className="content overflow-hidden m-auto">
            <div className="text-center">
              <h3 className="text-4xl font-bold">Artículos de interés</h3>
              <p className="my-12 max-w-[60em] w-[100%] m-auto">
                {articles.length === 0 && !loading
                  ? "Próximamente publicaremos contenido de valor sobre tecnología y desarrollo."
                  : "Explora nuestros últimos artículos sobre desarrollo de software, tecnología y mejores prácticas."}
              </p>
            </div>

            <div className="grid grid-col-1 lg:grid-cols-3 justify-center flex-wrap gap-8">
              {loading ? (
                <>
                  <CardArticleSkeleton />
                  <CardArticleSkeleton />
                  <CardArticleSkeleton />
                </>
              ) : articles.length > 0 ? (
                articles.map((article) => (
                  <CardArticle
                    key={article.id}
                    value={{
                      image: article.main_image_url || "https://via.placeholder.com/800x400?text=Sin+Imagen",
                      date: article.published_date || new Date().toISOString(),
                      title: article.title,
                      id: String(article.id),
                      views: String(article.views || 0),
                    }}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-gray-500">
                  <p className="text-lg">No hay artículos publicados aún.</p>
                  <p className="text-sm mt-2">Vuelve pronto para ver contenido nuevo.</p>
                </div>
              )}
            </div>

            {/* Botón ver más artículos (solo si hay más de 6) */}
            {articles.length >= 6 && (
              <div className="text-center mt-12">
                <a
                  href="/blog"
                  className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Ver todos los artículos →
                </a>
              </div>
            )}
          </div>
        </div>
      </Element>
    </Section>
  );
};