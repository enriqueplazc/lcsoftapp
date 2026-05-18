// src/pages/admin/Submissions.tsx
// Gestión de artículos enviados por usuarios: aprobar, rechazar
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";

type Submission = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content_md: string | null;
  temp_image_url: string | null;
  status: string;
  created_at: string;
};

type Filter = "all" | "pending" | "approved" | "rejected";

export default function Submissions() {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("article_submissions").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data, error } = await q;
    if (!error && data) setSubs(data as Submission[]);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  // Realtime
  useEffect(() => {
    const ch = supabase.channel("submissions-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "article_submissions" }, fetchSubs)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchSubs]);

  async function approve(sub: Submission) {
    setProcessing(sub.id);
    setMsg(null);
    const { error: artErr } = await supabase.from("articles").insert({
      title: sub.title,
      slug: sub.slug,
      excerpt: sub.excerpt,
      content_md: sub.content_md,
      main_image_url: sub.temp_image_url,
      status: "published",
      published_date: new Date().toISOString(),
    });
    if (artErr) { setMsg({ type: "err", text: artErr.message }); setProcessing(null); return; }
    await supabase.from("article_submissions").update({ status: "approved" }).eq("id", sub.id);
    setMsg({ type: "ok", text: `"${sub.title}" publicado correctamente.` });
    fetchSubs();
    setProcessing(null);
  }

  async function reject(sub: Submission) {
    setProcessing(sub.id);
    await supabase.from("article_submissions").update({ status: "rejected" }).eq("id", sub.id);
    fetchSubs();
    setProcessing(null);
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  const counts = {
    all: subs.length,
    pending: subs.filter(s => s.status === "pending").length,
    approved: subs.filter(s => s.status === "approved").length,
    rejected: subs.filter(s => s.status === "rejected").length,
  };

  const statusBadge = (status: string) => {
    if (status === "pending") return "bg-amber-400/10 text-amber-400 border-amber-400/20";
    if (status === "approved") return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
    return "bg-red-400/10 text-red-400 border-red-400/20";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-semibold tracking-tight">Envíos pendientes</h1>
          <p className="text-white/30 text-sm mt-0.5">Artículos enviados por usuarios</p>
        </div>
        {counts.pending > 0 && (
          <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 px-3 py-1.5 rounded-xl text-xs font-medium">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            {counts.pending} pendiente{counts.pending !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-xl text-sm border ${msg.type === "ok" ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-red-400/10 border-red-400/20 text-red-400"}`}>
          {msg.text}
        </div>
      )}

      {/* Filtros */}
      <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 gap-1 mb-6 w-fit">
        {(["pending", "all", "approved", "rejected"] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-white text-[#0a0a0a]" : "text-white/40 hover:text-white/70"}`}
          >
            {f === "all" ? "Todos" : f === "pending" ? "Pendientes" : f === "approved" ? "Aprobados" : "Rechazados"}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      ) : subs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/[0.03] border border-white/[0.06] rounded-2xl">
          <div className="w-12 h-12 bg-white/[0.04] rounded-2xl flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-white/30 text-sm">No hay envíos {filter !== "all" ? `con estado "${filter}"` : ""}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subs.map(sub => (
            <div key={sub.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
              {/* Header de la card */}
              <div
                className="flex items-start justify-between gap-4 p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-medium border ${statusBadge(sub.status)}`}>
                      {sub.status}
                    </span>
                    <span className="text-white/20 text-xs">#{sub.id}</span>
                  </div>
                  <h3 className="text-white font-medium leading-snug line-clamp-1">{sub.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-white/25 text-xs font-mono">/{sub.slug}</span>
                    <span className="text-white/20 text-xs">·</span>
                    <span className="text-white/25 text-xs">{formatDate(sub.created_at)}</span>
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-white/30 flex-shrink-0 mt-1 transition-transform ${expanded === sub.id ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Contenido expandido */}
              {expanded === sub.id && (
                <div className="border-t border-white/[0.06] p-5 space-y-4">
                  {sub.temp_image_url && (
                    <div className="rounded-xl overflow-hidden aspect-video bg-white/[0.04] w-full max-w-md">
                      <img src={sub.temp_image_url} alt={sub.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {sub.excerpt && (
                    <div>
                      <span className="text-white/30 text-xs tracking-widest uppercase">Extracto</span>
                      <p className="text-white/60 text-sm mt-1">{sub.excerpt}</p>
                    </div>
                  )}
                  {sub.content_md && (
                    <div>
                      <span className="text-white/30 text-xs tracking-widest uppercase">Contenido (Markdown)</span>
                      <pre className="mt-1 text-white/50 text-xs font-mono bg-white/[0.04] rounded-xl p-4 overflow-auto max-h-60 leading-relaxed whitespace-pre-wrap">
                        {sub.content_md}
                      </pre>
                    </div>
                  )}

                  {/* Acciones */}
                  {sub.status === "pending" && (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => approve(sub)}
                        disabled={processing === sub.id}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#0a0a0a] rounded-xl text-sm font-semibold hover:bg-white/90 transition-all disabled:opacity-50"
                      >
                        {processing === sub.id ? (
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Aprobar y publicar
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => reject(sub)}
                        disabled={processing === sub.id}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm hover:bg-red-500/20 transition-all disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
