import type { DatabaseSync } from "node:sqlite";

import type { Circular, StoredCircular } from "@/domain/circular/Circular";
import type { CircularRepository } from "@/domain/circular/CircularRepository";
import { getDbConnection } from "./connection";

type CircularRow = {
  id: number;
  nro: number;
  circular: string;
  fecha: string;
  tipo: string;
  resumen: string;
  enlace: string;
  created_at: string;
};

/**
 * Implementación SQLite del repositorio de circulares.
 * La unicidad (circular, fecha) la garantiza el índice UNIQUE de la tabla,
 * así que un registro ya existente simplemente se omite (INSERT OR IGNORE).
 */
export class SqliteCircularRepository implements CircularRepository {
  private readonly db: DatabaseSync;

  constructor() {
    this.db = getDbConnection();
  }

  async save(circular: Circular): Promise<boolean> {
    const result = this.db
      .prepare(
        `INSERT OR IGNORE INTO circulares (nro, circular, fecha, tipo, resumen, enlace)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        circular.nro,
        circular.circular,
        circular.fecha,
        circular.tipo,
        circular.resumen,
        circular.enlace
      );
    return Number(result.changes) > 0;
  }

  async findAll(): Promise<StoredCircular[]> {
    const rows = this.db
      .prepare("SELECT * FROM circulares ORDER BY id DESC")
      .all() as unknown as CircularRow[];

    // Las filas de node:sqlite tienen prototipo null; las mapeamos a
    // objetos planos del dominio para poder serializarlas hacia el cliente.
    return rows.map((row) => ({
      id: row.id,
      nro: row.nro,
      circular: row.circular,
      fecha: row.fecha,
      tipo: row.tipo,
      resumen: row.resumen,
      enlace: row.enlace,
      createdAt: row.created_at,
    }));
  }

  async count(): Promise<number> {
    const row = this.db
      .prepare("SELECT COUNT(*) AS total FROM circulares")
      .get() as { total: number };
    return Number(row.total);
  }
}
