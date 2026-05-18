// src/pages/Blog.tsx - VERSIÓN MEJORADA CON MEJOR DISEÑO
import { useEffect, useState } from "react";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { useParams, useNavigate } from "react-router-dom";
import { EyeIcon, ArrowLeftIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Header } from "../components/Header";
import { supabase } from "../lib/supabase";
import { marked } from "marked";
import DOMPurify from "dompurify";

type DBArticle = {
  id: number;
  title: string;
  excerpt: string | null;
  content_md: string | null;
  main_image_url: string | null;
  published_date: string | null;
  views: number | null;
  author_firstname?: string | null;
  author_lastname?: string | null;
  author_position?: string | null;
  author_avatar_url?: string | null;
};

function formatDateISO(dateIso?: string | null) {
  if (!dateIso) return "";
  try {
    const date = new Date(dateIso);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function estimateReadingTime(markdown: string): number {
  const wordsPerMinute = 200;
  const words = markdown.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function Blog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<DBArticle | null>(null);
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!id) {
        setErr("Falta el parámetro :id en la URL.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          setErr("Artículo no encontrado.");
          return;
        }

        const a = data as DBArticle;
        if (!mounted) return;

        const raw = await marked.parse(a.content_md ?? "");
        const safe = DOMPurify.sanitize(raw as string);

        setArticle(a);
        setHtml(safe);
        setReadingTime(estimateReadingTime(a.content_md ?? ""));

        // Incrementar views
        try {
          const numId = Number(id);
          if (!Number.isNaN(numId)) {
            const { error: rpcErr } = await supabase.rpc("increment_article_views", {
              row_id: numId,
            });
            if (rpcErr) {
              await supabase
                .from("articles")
                .update({ views: (a.views ?? 0) + 1 })
                .eq("id", numId);
            }
          }
        } catch (incErr) {
          console.warn("No se pudo incrementar views:", incErr);
        }
      } catch (e: any) {
        console.error("Error cargando artículo:", e);
        setErr(e?.message ?? "Error cargando artículo.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <DefaultLayout>
        <Header redirect={true} />
        <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
          <div className="bg-gray-300 h-8 w-3/4 mb-4 rounded" />
          <div className="bg-gray-300 h-4 w-1/2 mb-8 rounded" />
          <div className="bg-gray-300 w-full aspect-video mb-8 rounded-lg" />
          <div className="space-y-4">
            <div className="bg-gray-300 h-4 w-full rounded" />
            <div className="bg-gray-300 h-4 w-5/6 rounded" />
            <div className="bg-gray-300 h-4 w-4/6 rounded" />
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (err) {
    return (
      <DefaultLayout>
        <Header redirect={true} />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-2 text-red-900">Error</h1>
            <p className="text-red-600">{err}</p>
            <button
              onClick={() => navigate("/blog")}
              className="mt-4 text-blue-600 hover:underline"
            >
              ← Volver al blog
            </button>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (!article) {
    return (
      <DefaultLayout>
        <Header redirect={true} />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <p>Artículo no disponible.</p>
        </div>
      </DefaultLayout>
    );
  }

  const hasAuthor =
    article.author_firstname ||
    article.author_lastname ||
    article.author_position ||
    article.author_avatar_url;

  return (
    <DefaultLayout>
      <Header redirect={true} />

      {/* Container principal con max-width para lectura óptima */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Volver</span>
        </button>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {article.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            <span>{readingTime} min de lectura</span>
          </div>
          <div className="flex items-center gap-2">
            <EyeIcon className="w-4 h-4" />
            <span>{article.views ?? 0} vistas</span>
          </div>
          <div>
            <span>{formatDateISO(article.published_date)}</span>
          </div>
        </div>

        {/* Autor */}
        {hasAuthor && (
          <div className="flex items-center gap-4 mb-8">
            {article.author_avatar_url ? (
              <img
                src={article.author_avatar_url}
                alt={`${article.author_firstname ?? ""} ${article.author_lastname ?? ""}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                {article.author_firstname?.charAt(0) ?? "?"}
              </div>
            )}
            <div>
              <div className="font-semibold text-gray-900">
                {article.author_firstname ?? ""} {article.author_lastname ?? ""}
              </div>
              {article.author_position && (
                <div className="text-sm text-gray-600">{article.author_position}</div>
              )}
            </div>
          </div>
        )}

        {/* Imagen principal - MEJORADA */}
        {article.main_image_url && (
          <figure className="mb-12">
            <img
              src={article.main_image_url}
              alt={article.title}
              className="w-full rounded-xl shadow-lg"
              style={{ 
                maxHeight: '600px', 
                objectFit: 'contain',
                backgroundColor: '#f3f4f6' 
              }}
            />
          </figure>
        )}

        {/* Extracto (si existe) */}
        {article.excerpt && (
          <div className="text-xl text-gray-700 leading-relaxed mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            {article.excerpt}
          </div>
        )}

        {/* Contenido Markdown */}
        <div
          className="prose prose-lg prose-blue max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:text-gray-100
            prose-img:rounded-lg prose-img:shadow-md
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:text-gray-700
            prose-table:border-collapse prose-table:w-full
            prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left
            prose-td:border prose-td:border-gray-300 prose-td:p-3"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Call to action al final */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">¿Te gustó este artículo?</h3>
            <p className="text-gray-600 mb-6">
              Suscríbete para recibir más contenido sobre desarrollo y tecnología
            </p>
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              Suscribirse al Newsletter
            </button>
          </div>
        </div>

        {/* Navegación al final */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Volver a los artículos</span>
          </button>
        </div>
      </article>
    </DefaultLayout>
  );
}