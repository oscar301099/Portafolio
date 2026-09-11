import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Circular, StoredCircular } from "@/domain/circular/Circular";
import type { CircularRepository } from "@/domain/circular/CircularRepository";

/**
 * Implementación del repositorio sobre Supabase (Postgres).
 * Se usa en producción (p. ej. Vercel), donde el filesystem es de solo
 * lectura y no se puede usar un archivo .db local.
 *
 * La unicidad (circular, fecha) la garantiza la constraint UNIQUE de la
 * tabla (ver supabase/schema.sql): un insert duplicado falla con el
 * código 23505 y el registro se omite.
 */
export class SupabaseCircularRepository implements CircularRepository {
  private readonly client: SupabaseClient;

  constructor(url: string, serviceRoleKey: string) {
    this.client = createClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }

  async save(circular: Circular): Promise<boolean> {
    const { error } = await this.client.from("circulares").insert({
      nro: circular.nro,
      circular: circular.circular,
      fecha: circular.fecha,
      tipo: circular.tipo,
      resumen: circular.resumen,
      enlace: circular.enlace,
    });

    if (error?.code === "23505") {
      return false; // duplicado: ya existe (circular, fecha)
    }
    if (error) {
      throw new Error(`Error al insertar en Supabase: ${error.message}`);
    }
    return true;
  }

  async findAll(): Promise<StoredCircular[]> {
    const { data, error } = await this.client
      .from("circulares")
      .select("id, nro, circular, fecha, tipo, resumen, enlace, created_at")
      .order("id", { ascending: false });

    if (error) {
      throw new Error(`Error al consultar Supabase: ${error.message}`);
    }

    return (data ?? []).map((row) => ({
      id: Number(row.id),
      nro: Number(row.nro),
      circular: String(row.circular),
      fecha: String(row.fecha),
      tipo: String(row.tipo),
      resumen: String(row.resumen),
      enlace: String(row.enlace),
      createdAt: String(row.created_at),
    }));
  }

  async count(): Promise<number> {
    const { count, error } = await this.client
      .from("circulares")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw new Error(`Error al contar en Supabase: ${error.message}`);
    }
    return count ?? 0;
  }
}
