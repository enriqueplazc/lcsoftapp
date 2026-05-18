import React from "react";
import { supabase } from "../lib/supabase";

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

export default function AdminDashboard() {
  const [subs, setSubs] = React.useState<Submission[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [msg, setMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchSubs();
    const ch = supabase.channel("submissions-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "article_submissions" }, fetchSubs)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function fetchSubs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("article_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setSubs(data as Submission[]);
    setLoading(false);
  }

  async function approve(sub: Submission) {
    setMsg(null);
    const { error: artErr } = await supabase.from("articles").insert({
      title: sub.title,
      slug: sub.slug,
      excerpt: sub.excerpt,
      content_md: sub.content_md,
      main_image_url: sub.temp_image_url,
      status: "published",
      published_date: new Date().toISOString()
    });
    if (artErr) { setMsg(artErr.message); return; }

    await supabase.from("article_submissions").update({ status: "approved" }).eq("id", sub.id);
    setMsg("Artículo publicado 🎉");
  }

  async function reject(id: number) {
    await supabase.from("article_submissions").update({ status: "rejected" }).eq("id", id);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin – Submissions</h1>
        <button
          onClick={() => supabase.auth.signOut().then(()=>location.reload())}
          className="px-3 py-2 bg-gray-200 rounded"
        >Salir</button>
      </div>

      {msg && <p className="mb-4 text-green-700">{msg}</p>}
      {loading ? <p>Cargando…</p> : (
        <div className="grid md:grid-cols-2 gap-4">
          {subs.map(s => (
            <div key={s.id} className="border rounded p-4">
              <div className="text-sm opacity-60">#{s.id} · {s.status}</div>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <div className="text-sm mb-2">/{s.slug}</div>
              {s.temp_image_url && (
                <img src={s.temp_image_url} alt={s.title} className="w-full h-40 object-cover rounded mb-3" />
              )}
              {s.excerpt && <p className="mb-2">{s.excerpt}</p>}
              <details className="mb-3">
                <summary className="cursor-pointer">Ver contenido</summary>
                <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded text-sm">{s.content_md}</pre>
              </details>
              <div className="flex gap-2">
                <button onClick={() => approve(s)} className="px-3 py-2 bg-black text-white rounded">Aprobar y publicar</button>
                <button onClick={() => reject(s.id)} className="px-3 py-2 bg-red-100 text-red-700 rounded">Rechazar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
