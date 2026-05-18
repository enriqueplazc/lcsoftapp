// import React from "react";
// import { supabase } from "../lib/supabase";

// export default function SubmitArticle() {
//   const [loading, setLoading] = React.useState(false);
//   const [ok, setOk] = React.useState<string | null>(null);
//   const [err, setErr] = React.useState<string | null>(null);

//   async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setLoading(true);
//     setOk(null); setErr(null);

//     const form = new FormData(e.currentTarget);
//     const title = String(form.get("title") || "").trim();
//     let slug = String(form.get("slug") || "").trim();
//     const excerpt = String(form.get("excerpt") || "").trim();
//     const content_md = String(form.get("content_md") || "").trim();
//     const file = form.get("image") as File | null;

//     // slug auto si vacío
//     if (!slug) {
//       slug = title
//         .toLowerCase()
//         .replace(/\s+/g, "-")
//         .replace(/[^a-z0-9\-]/g, "");
//     }

//     let temp_image_url: string | null = null;

//     try {
//       if (file && file.size > 0) {
//         const fileName = `submissions/${Date.now()}-${file.name}`;
//         const { error: upErr } = await supabase.storage.from("blog").upload(fileName, file);
//         if (upErr) throw upErr;
//         const { data: pub } = supabase.storage.from("blog").getPublicUrl(fileName);
//         temp_image_url = pub.publicUrl;
//       }

//       const { error: insErr } = await supabase.from("article_submissions").insert({
//         title, slug, excerpt, content_md, temp_image_url
//       });
//       if (insErr) throw insErr;

//       setOk("¡Enviado! Un admin revisará tu artículo.");
//       (e.currentTarget as HTMLFormElement).reset();
//     } catch (e: any) {
//       setErr(e?.message ?? "Error al enviar.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-4">Enviar artículo</h1>
//       <form onSubmit={onSubmit} className="space-y-4">
//         <input name="title" placeholder="Título" className="w-full p-2 border rounded" required />
//         <input name="slug" placeholder="slug-ejemplo (opcional)" className="w-full p-2 border rounded" />
//         <textarea name="excerpt" placeholder="Resumen (opcional)" className="w-full p-2 border rounded" />
//         <textarea name="content_md" placeholder="Contenido en Markdown" rows={8} className="w-full p-2 border rounded" />
//         <input name="image" type="file" accept="image/*" className="w-full" />
//         <button disabled={loading} className="px-4 py-2 rounded bg-black text-white">
//           {loading ? "Enviando..." : "Enviar"}
//         </button>
//         {ok && <p className="text-green-600">{ok}</p>}
//         {err && <p className="text-red-600">{err}</p>}
//       </form>
//     </div>
//   );
// }
