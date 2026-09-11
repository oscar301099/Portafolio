import { createClient, type Client } from "@libsql/client";

import type { Circular, StoredCircular } from "@/domain/circular/Circular";
import type { CircularRepository } from "@/domain/circular/CircularRepository";

/**
 * Implementación del repositorio sobre Turso (libsql), una base de datos
 * SQLite alojada en la nube. Se usa en producción (p. ej. Vercel), donde el
 * filesystem es de solo lectura y no se puede usar un archivo .db local.
 */
export class LibsqlCircularRepository implements CircularRepository {
  private readonly client: Client;
  private schemaReady: Promise<unknown> | null = null;

  constructor(url: string, authToken?: string) {
    this.client = createClient({ url, authToken });
  }

  /** Crea la tabla en la primera operación (el constructor no puede ser async). */
  private ensureSchema(): Promise<unknown> {
    this.schemaReady ??= this.client.execute(`
      CREATE TABLE IF NOT EXISTS circulares (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        nro        INTEGER NOT NULL,
        circular   TEXT NOT NULL,
        fecha      TEXT NOT NULL,
        tipo       TEXT NOT NULL,
        resumen    TEXT NOT NULL,
        enlace     TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE (circular, fecha)
      );
    `);
    return this.schemaReady;
  }

  async save(circular: Circular): Promise<boolean> {
    await this.ensureSchema();

    // INSERT OR IGNORE + UNIQUE(circular, fecha): si ya existe se omite.
    const result = await this.client.execute({
      sql: `INSERT OR IGNORE INTO circulares (nro, circular, fecha, tipo, resumen, enlace)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        circular.nro,
        circular.circular,
        circular.fecha,
        circular.tipo,
        circular.resumen,
        circular.enlace,
      ],
    });

    return result.rowsAffected > 0;
  }

  async findAll(): Promise<StoredCircular[]> {
    await this.ensureSchema();

    const result = await this.client.execute(
      "SELECT id, nro, circular, fecha, tipo, resumen, enlace, created_at FROM circulares ORDER BY id DESC"
    );

    return result.rows.map((row) => ({
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
    await this.ensureSchema();

    const result = await this.client.execute(
      "SELECT COUNT(*) AS total FROM circulares"
    );
    return Number(result.rows[0]?.total ?? 0);
  }
}
