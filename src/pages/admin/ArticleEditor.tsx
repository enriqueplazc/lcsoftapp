// src/pages/admin/ArticleEditor.tsx - VERSIÓN MEJORADA CON IMAGE UPLOAD
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { 
  ArrowLeftIcon, 
  PhotoIcon, 
  CloudArrowUpIcon 
} from "@heroicons/react/24/outline";

type Mode = "write" | "preview";

interface ArticleForm {
  title: string;
  slug: string;
  excerpt: string;
  content_md: string;
  main_image_url: string;
  status: "published" | "draft";
  author_firstname: string;
  author_lastname: string;
  author_position: string;
  author_avatar_url: string;
}

const EMPTY: ArticleForm = {
  title: "",
  slug: "",
  excerpt: "",
  content_md: "",
  main_image_url: "",
  status: "draft",
  author_firstname: "",
  author_lastname: "",
  author_position: "",
  author_avatar_url: "",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ArticleEditor() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id && id !== "new");
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ArticleForm>(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<Mode>("write");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [slugManual, setSlugManual] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "meta" | "author">("content");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Cargar artículo existente
  useEffect(() => {
    if (!isEdit) return;
    supabase.from("articles").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error || !data) {
        navigate("/admin/articles");
        return;
      }
      setForm({
        title: data.title ?? "",
        slug: data.slug ?? "",
        excerpt: data.excerpt ?? "",
        content_md: data.content_md ?? "",
        main_image_url: data.main_image_url ?? "",
        status: data.status ?? "draft",
        author_firstname: data.author_firstname ?? "",
        author_lastname: data.author_lastname ?? "",
        author_position: data.author_position ?? "",
        author_avatar_url: data.author_avatar_url ?? "",
      });
      setImagePreview(data.main_image_url);
      setSlugManual(true);
      setLoading(false);
    });
  }, [id, isEdit, navigate]);

  // Auto-slug desde el título
  useEffect(() => {
    if (!slugManual && form.title) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, slugManual]);

  // Preview Markdown
  const buildPreview = useCallback(async (md: string) => {
    const raw = await marked.parse(md);
    setPreview(DOMPurify.sanitize(raw as string));
  }, []);

  useEffect(() => {
    if (mode === "preview") buildPreview(form.content_md);
  }, [mode, form.content_md, buildPreview]);

  // 🆕 UPLOAD DE IMAGEN A SUPABASE STORAGE
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida");
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Generar nombre único
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      // Subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data } = supabase.storage.from("images").getPublicUrl(filePath);

      // Actualizar formulario y preview
      setForm((f) => ({ ...f, main_image_url: data.publicUrl }));
      setImagePreview(data.publicUrl);
    } catch (err: any) {
      console.error("Error subiendo imagen:", err);
      setError(err.message || "Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  // Eliminar imagen
  function handleRemoveImage() {
    setForm((f) => ({ ...f, main_image_url: "" }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // Guardar artículo
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return setError("El título es requerido");
    if (!form.slug.trim()) return setError("El slug es requerido");

    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        published_date: form.status === "published" ? new Date().toISOString() : null,
      };

      if (isEdit) {
        const { error } = await supabase.from("articles").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("articles").insert([payload]);
        if (error) throw error;
      }

      setSaved(true);
      setTimeout(() => navigate("/admin/articles"), 1000);
    } catch (err: any) {
      setError(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando artículo...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/articles")}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? "Editar Artículo" : "Nuevo Artículo"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEdit ? `Editando: ${form.title || "Sin título"}` : "Crea un nuevo artículo para el blog"}
          </p>
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm">✓ Artículo guardado correctamente. Redirigiendo...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-6">
              <button
                type="button"
                onClick={() => setActiveTab("content")}
                className={`py-4 px-2 border-b-2 font-medium transition ${
                  activeTab === "content"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                📝 Contenido
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("meta")}
                className={`py-4 px-2 border-b-2 font-medium transition ${
                  activeTab === "meta"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                ⚙️ Metadata
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("author")}
                className={`py-4 px-2 border-b-2 font-medium transition ${
                  activeTab === "author"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                👤 Autor
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* TAB: CONTENIDO */}
            {activeTab === "content" && (
              <div className="space-y-6">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del Artículo *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Título llamativo para tu artículo..."
                  />
                </div>

                {/* 🆕 IMAGEN PRINCIPAL - MEJORADO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Imagen Principal
                  </label>

                  {imagePreview ? (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition"
                        >
                          Cambiar Imagen
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 hover:bg-blue-50/50 transition cursor-pointer group"
                    >
                      <div className="flex flex-col items-center gap-3">
                        {uploading ? (
                          <>
                            <CloudArrowUpIcon className="w-16 h-16 text-blue-500 animate-bounce" />
                            <p className="text-blue-600 font-medium">Subiendo imagen...</p>
                          </>
                        ) : (
                          <>
                            <PhotoIcon className="w-16 h-16 text-gray-400 group-hover:text-blue-500 transition" />
                            <div>
                              <p className="text-gray-700 font-medium">
                                Click para subir imagen
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                PNG, JPG, WEBP hasta 5MB
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />

                  {form.main_image_url && (
                    <p className="text-xs text-gray-500 mt-2">
                      URL: {form.main_image_url}
                    </p>
                  )}
                </div>

                {/* Extracto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Extracto / Resumen
                  </label>
                  <textarea
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    rows={3}
                    maxLength={200}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Breve descripción que aparecerá en las cards..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {form.excerpt.length}/200 caracteres
                  </p>
                </div>

                {/* Editor Markdown */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Contenido (Markdown) *
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setMode("write")}
                        className={`px-3 py-1 text-sm rounded ${
                          mode === "write"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Escribir
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("preview")}
                        className={`px-3 py-1 text-sm rounded ${
                          mode === "preview"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Vista Previa
                      </button>
                    </div>
                  </div>

                  {mode === "write" ? (
                    <textarea
                      value={form.content_md}
                      onChange={(e) => setForm({ ...form, content_md: e.target.value })}
                      required
                      rows={20}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                      placeholder="# Título

Tu contenido en Markdown...

## Subtítulo

- Lista
- De items

**Negrita** y *cursiva*"
                    />
                  ) : (
                    <div
                      className="w-full min-h-[500px] px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 prose prose-blue max-w-none"
                      dangerouslySetInnerHTML={{ __html: preview }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* TAB: METADATA */}
            {activeTab === "meta" && (
              <div className="space-y-6">
                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL amigable) *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">lcsoft.pe/blog/</span>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => {
                        setForm({ ...form, slug: e.target.value });
                        setSlugManual(true);
                      }}
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="mi-articulo-ejemplo"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Se genera automáticamente del título. Puedes editarlo manualmente.
                  </p>
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado de Publicación *
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as "published" | "draft" })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">📝 Borrador (no visible)</option>
                    <option value="published">✅ Publicado (visible)</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB: AUTOR */}
            {activeTab === "author" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={form.author_firstname}
                      onChange={(e) => setForm({ ...form, author_firstname: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Juan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={form.author_lastname}
                      onChange={(e) => setForm({ ...form, author_lastname: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Pérez"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo/Posición
                  </label>
                  <input
                    type="text"
                    value={form.author_position}
                    onChange={(e) => setForm({ ...form, author_position: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Desarrollador Full Stack"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Avatar
                  </label>
                  <input
                    type="url"
                    value={form.author_avatar_url}
                    onChange={(e) => setForm({ ...form, author_avatar_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/admin/articles")}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving || uploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {saving ? "Guardando..." : isEdit ? "Actualizar Artículo" : "Crear Artículo"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}