// src/pages/admin/Articles.tsx
// Listado de artículos con acciones: crear, editar, eliminar, cambiar estado
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  status: string;
  published_date: string | null;
  views: number | null;
  author_firstname: string | null;
  author_lastname: string | null;
};

type Filter = "all" | "published" | "draft";

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Article | null>(null);
  const navigate = useNavigate();

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from("articles")
      .select("id, title, slug, excerpt, status, published_date, views, author_firstname, author_lastname")
      .order("published_date", { ascending: false });

    if (filter !== "all") q = q.eq("status", filter);

    const { data, error } = await q;
    if (!error && data) setArticles(data as Article[]);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.slug.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleStatus(article: Article) {
    const newStatus = article.status === "published" ? "draft" : "published";
    await supabase.from("articles").update({ status: newStatus }).eq("id", article.id);
    setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: newStatus } : a));
  }

  async function deleteArticle(article: Article) {
    setDeleting(article.id);
    const { error } = await supabase.from("articles").delete().eq("id", article.id);
    if (!error) setArticles(prev => prev.filter(a => a.id !== article.id));
    setDeleting(null);
    setConfirmDelete(null);
  }

  function formatDate(d?: string | null) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
  }

  const counts = {
    all: articles.length,
    published: articles.filter(a => a.status === "published").length,
    draft: articles.filter(a => a.status === "draft").length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white text-2xl font-semibold tracking-tight">Artículos</h1>
          <p className="text-white/30 text-sm mt-0.5">{counts.all} artículos en total</p>
        </div>
        <button
          onClick={() => navigate("/admin/articles/new")}
          className="flex items-center gap-2 bg-white text-[#0a0a0a] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/90 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo artículo
        </button>
      </div>

      {/* Filtros + Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Tabs de estado */}
        <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 gap-1">
          {(["all", "published", "draft"] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f ? "bg-white text-[#0a0a0a]" : "text-white/40 hover:text-white/70"
              }`}
            >
              {f === "all" ? "Todos" : f === "published" ? "Publicados" : "Borradores"}
              <span className={`ml-1.5 ${filter === f ? "text-black/40" : "text-white/20"}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* Búsqueda */}
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por título o slug..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-white/20 transition-all"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 bg-white/[0.04] rounded-2xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-white/30 text-sm">No hay artículos</p>
            <button onClick={() => navigate("/admin/articles/new")} className="mt-3 text-white/50 text-xs hover:text-white/80 transition-colors">
              Crear el primero →
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-white/30 text-xs tracking-widest uppercase px-6 py-4 font-medium">Artículo</th>
                <th className="text-left text-white/30 text-xs tracking-widest uppercase px-4 py-4 font-medium hidden md:table-cell">Estado</th>
                <th className="text-left text-white/30 text-xs tracking-widest uppercase px-4 py-4 font-medium hidden lg:table-cell">Fecha</th>
                <th className="text-left text-white/30 text-xs tracking-widest uppercase px-4 py-4 font-medium hidden lg:table-cell">Vistas</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map(article => (
                <tr key={article.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white/90 text-sm leading-snug line-clamp-1">{article.title}</div>
                    <div className="text-white/30 text-xs mt-0.5">/{article.slug}</div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <button
                      onClick={() => toggleStatus(article)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all hover:opacity-80 ${
                        article.status === "published"
                          ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                          : "bg-white/[0.06] text-white/40 border border-white/[0.08]"
                      }`}
                      title="Clic para cambiar estado"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${article.status === "published" ? "bg-emerald-400" : "bg-white/30"}`} />
                      {article.status === "published" ? "Publicado" : "Borrador"}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-white/30 text-sm hidden lg:table-cell">
                    {formatDate(article.published_date)}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-white/30 text-sm">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {article.views ?? 0}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/admin/articles/${article.id}/edit`)}
                        className="p-2 text-white/40 hover:text-white hover:bg-white/[0.08] rounded-lg transition-all"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setConfirmDelete(article)}
                        className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/[0.08] rounded-lg transition-all"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal confirmar eliminación */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-white/[0.1] rounded-2xl p-6 max-w-sm w-full">
            <div className="w-11 h-11 bg-red-400/10 border border-red-400/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Eliminar artículo</h3>
            <p className="text-white/40 text-sm mb-1">¿Estás seguro? Esta acción no se puede deshacer.</p>
            <p className="text-white/70 text-sm font-medium mb-6 line-clamp-2">"{confirmDelete.title}"</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 bg-white/[0.06] text-white/70 rounded-xl text-sm hover:bg-white/[0.1] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteArticle(confirmDelete)}
                disabled={deleting === confirmDelete.id}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting === confirmDelete.id ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
