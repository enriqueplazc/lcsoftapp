// src/pages/admin/ClientEditor.tsx - VERSIÓN MEJORADA
// Upload de logo + Paleta de colores visual

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClientById, createClient, updateClient, type ClientInput } from "../../api/clients";
import { supabase } from "../../lib/supabase";
import { ArrowLeftIcon, PhotoIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";

// 🎨 PALETA DE COLORES PREDEFINIDA
const GRADIENT_PALETTE = [
  { name: "Océano", from: "#06b6d4", to: "#0ea5e9", class: "from-[#06b6d4] to-[#0ea5e9]" },
  { name: "Bosque", from: "#10b981", to: "#4ade80", class: "from-[#10b981] to-[#4ade80]" },
  { name: "Lavanda", from: "#8887E8", to: "#a855f7", class: "from-[#8887E8] to-[#a855f7]" },
  { name: "Real", from: "#542DA0", to: "#3b82f6", class: "from-[#542DA0] to-[#3b82f6]" },
  { name: "Amanecer", from: "#f59e0b", to: "#fbbf24", class: "from-[#f59e0b] to-[#fbbf24]" },
  { name: "Fuego", from: "#ef4444", to: "#f97316", class: "from-[#ef4444] to-[#f97316]" },
  { name: "Turquesa", from: "#14b8a6", to: "#06b6d4", class: "from-[#14b8a6] to-[#06b6d4]" },
  { name: "Ultravioleta", from: "#6366f1", to: "#8b5cf6", class: "from-[#6366f1] to-[#8b5cf6]" },
  { name: "Rosa", from: "#ec4899", to: "#d946ef", class: "from-[#ec4899] to-[#d946ef]" },
  { name: "Esmeralda", from: "#0ea5e9", to: "#8b5cf6", class: "from-[#0ea5e9] to-[#8b5cf6]" },
  { name: "Sandía", from: "#ef4444", to: "#ec4899", class: "from-[#ef4444] to-[#ec4899]" },
  { name: "Menta", from: "#4ade80", to: "#14b8a6", class: "from-[#4ade80] to-[#14b8a6]" },
];

export default function ClientEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<ClientInput>>({
    name: "",
    logo_url: "",
    sector: "Construcción Civil",
    blurb: "",
    details: "",
    url: "",
    gradient_class: GRADIENT_PALETTE[0].class,
    order_index: 0,
    is_active: true,
    contact_name: "",
    contact_position: "",
    contact_phone: "",
    contact_email: "",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      loadClient(parseInt(id));
    }
  }, [id, isEditing]);

  async function loadClient(clientId: number) {
    try {
      const data = await getClientById(clientId);
      setFormData(data);
      setLogoPreview(data.logo_url || null);
    } catch (err: any) {
      alert("Error al cargar cliente: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof ClientInput, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  // 🆕 UPLOAD DE LOGO A SUPABASE STORAGE
  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen no debe superar los 2MB");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `clients/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("images").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, logo_url: data.publicUrl }));
      setLogoPreview(data.publicUrl);
    } catch (err: any) {
      console.error("Error subiendo logo:", err);
      alert("Error al subir el logo: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleRemoveLogo() {
    setFormData((prev) => ({ ...prev, logo_url: "" }));
    setLogoPreview(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const clientData: ClientInput = {
        name: formData.name!,
        logo_url: formData.logo_url || null,
        sector: formData.sector!,
        blurb: formData.blurb!,
        details: formData.details || null,
        url: formData.url || null,
        gradient_class: formData.gradient_class!,
        order_index: formData.order_index!,
        is_active: formData.is_active!,
        contact_name: formData.contact_name || null,
        contact_position: formData.contact_position || null,
        contact_phone: formData.contact_phone || null,
        contact_email: formData.contact_email || null,
      };

      if (isEditing) {
        await updateClient(parseInt(id!), clientData);
      } else {
        await createClient(clientData);
      }

      alert(isEditing ? "Cliente actualizado" : "Cliente creado");
      navigate("/admin/clients");
    } catch (err: any) {
      alert("Error al guardar: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/clients")}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditing ? `Editando: ${formData.name}` : "Agregar nuevo cliente"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Cliente *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: China Geshouba Group"
          />
        </div>

        {/* 🆕 LOGO UPLOAD CON PREVIEW */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Logo de la Empresa
          </label>

          {logoPreview ? (
            <div className="relative group">
              <div className="w-40 h-40 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-32 h-32 object-contain"
                />
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
                >
                  Cambiar Logo
                </button>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => logoInputRef.current?.click()}
              className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition"
            >
              {uploading ? (
                <>
                  <CloudArrowUpIcon className="w-12 h-12 text-blue-500 animate-bounce mb-2" />
                  <span className="text-sm text-blue-600">Subiendo...</span>
                </>
              ) : (
                <>
                  <PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click para subir</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG (máx 2MB)</span>
                </>
              )}
            </div>
          )}

          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            disabled={uploading}
            className="hidden"
          />

          <p className="text-xs text-gray-500 mt-2">
            📏 <strong>Tamaño recomendado:</strong> 200x200px (cuadrado) o 300x150px (horizontal)
            <br />
            📦 <strong>En la card se verá:</strong> 64×64px (el logo se redimensiona automáticamente)
          </p>
        </div>

        {/* Sector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sector *</label>
          <select
            value={formData.sector}
            onChange={(e) => handleChange("sector", e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Construcción Civil">Construcción Civil</option>
            <option value="Consultoría Contable">Consultoría Contable</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Educación">Educación</option>
            <option value="Finanzas">Finanzas</option>
            <option value="Retail">Retail</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Descripción corta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción Corta * (aparece en la card)
          </label>
          <textarea
            value={formData.blurb}
            onChange={(e) => handleChange("blurb", e.target.value)}
            required
            rows={3}
            maxLength={200}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Ej: Aplicación de Planillas TDIPLAN v5.0"
          />
          <p className="text-xs text-gray-500 mt-1">{formData.blurb?.length || 0}/200</p>
        </div>

        {/* Descripción larga */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción Detallada (opcional)
          </label>
          <textarea
            value={formData.details || ""}
            onChange={(e) => handleChange("details", e.target.value)}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Información adicional que aparece en el modal..."
          />
        </div>

        {/* 🎨 PALETA DE COLORES VISUAL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color del Gradiente *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {GRADIENT_PALETTE.map((gradient) => (
              <button
                key={gradient.class}
                type="button"
                onClick={() => handleChange("gradient_class", gradient.class)}
                className={`group relative overflow-hidden rounded-xl transition-all ${
                  formData.gradient_class === gradient.class
                    ? "ring-4 ring-blue-500 scale-105"
                    : "ring-2 ring-gray-200 hover:ring-gray-300 hover:scale-102"
                }`}
              >
                <div className={`h-16 bg-gradient-to-r ${gradient.class}`} />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition">
                  <span className="text-white font-medium text-xs opacity-0 group-hover:opacity-100 transition">
                    {gradient.name}
                  </span>
                </div>
                {formData.gradient_class === gradient.class && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 🆕 SECCIÓN DE CONTACTO */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            👤 Información de Contacto
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Estos datos aparecerán en el modal "Ver más" del cliente
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Contacto
              </label>
              <input
                type="text"
                value={formData.contact_name || ""}
                onChange={(e) => handleChange("contact_name", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Patricia Aldana"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo/Posición
              </label>
              <input
                type="text"
                value={formData.contact_position || ""}
                onChange={(e) => handleChange("contact_position", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Coordinadora de Nóminas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              <input
                type="tel"
                value={formData.contact_phone || ""}
                onChange={(e) => handleChange("contact_phone", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 939 289 155"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.contact_email || ""}
                onChange={(e) => handleChange("contact_email", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: contacto@empresa.com"
              />
            </div>
          </div>
        </div>

        {/* Sitio web */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sitio Web (opcional)
          </label>
          <input
            type="url"
            value={formData.url || ""}
            onChange={(e) => handleChange("url", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="https://ejemplo.com"
          />
        </div>

        {/* Orden y Estado */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orden de Aparición *
            </label>
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) => handleChange("order_index", parseInt(e.target.value))}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => handleChange("is_active", e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Cliente activo</span>
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Guardando..." : isEditing ? "Actualizar Cliente" : "Crear Cliente"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/clients")}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}