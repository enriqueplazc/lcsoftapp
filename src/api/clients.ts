// src/api/clients.ts - API COMPLETA CON TIPOS DE CONTACTO
import { supabase } from "../lib/supabase";

export type Client = {
  id: number;
  name: string;
  logo_url: string | null;
  sector: string;
  blurb: string;
  details: string | null;
  url: string | null;
  gradient_class: string;
  order_index: number;
  is_active: boolean;
  
  // Campos de contacto
  contact_name: string | null;
  contact_position: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  
  created_at: string;
  updated_at: string;
};

export type ClientInput = Omit<Client, "id" | "created_at" | "updated_at">;

/**
 * Obtener todos los clientes activos (público)
 */
export async function getActiveClients() {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data as Client[];
}

/**
 * Obtener todos los clientes (admin)
 */
export async function getAllClients() {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data as Client[];
}

/**
 * Obtener un cliente por ID
 */
export async function getClientById(id: number) {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Client;
}

/**
 * Crear nuevo cliente
 */
export async function createClient(client: ClientInput) {
  const { data, error } = await supabase
    .from("clients")
    .insert([client])
    .select()
    .single();

  if (error) throw error;
  return data as Client;
}

/**
 * Actualizar cliente
 */
export async function updateClient(id: number, updates: Partial<ClientInput>) {
  const { data, error } = await supabase
    .from("clients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Client;
}

/**
 * Eliminar cliente (soft delete: cambiar is_active a false)
 */
export async function deleteClient(id: number) {
  const { error } = await supabase
    .from("clients")
    .update({ is_active: false })
    .eq("id", id);

  if (error) throw error;
}

/**
 * Eliminar cliente permanentemente
 */
export async function permanentDeleteClient(id: number) {
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/**
 * Reordenar clientes (actualizar order_index)
 */
export async function reorderClients(clientIds: number[]) {
  const updates = clientIds.map((id, index) => ({
    id,
    order_index: index + 1,
  }));

  for (const update of updates) {
    await supabase
      .from("clients")
      .update({ order_index: update.order_index })
      .eq("id", update.id);
  }
}

/**
 * Subir logo de cliente (Supabase Storage)
 */
export async function uploadClientLogo(file: File, clientId: number) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${clientId}-${Date.now()}.${fileExt}`;
  const filePath = `logos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("clients")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("clients")
    .getPublicUrl(filePath);

  return data.publicUrl;
}