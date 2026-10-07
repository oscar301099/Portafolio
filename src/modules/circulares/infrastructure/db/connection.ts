import { DatabaseSync } from "node:sqlite";
import path from "node:path";

// En `next dev` los módulos se recargan con HMR; con globalThis la conexión
// se crea una sola vez por proceso y no se abren conexiones duplicadas.
const globalForDb = globalThis as unknown as { __circularesDb?: DatabaseSync };

function createDb(): DatabaseSync {
  const db = new DatabaseSync(path.join(process.cwd(), "circulares.db"));
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec(`
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
  return db;
}

export function getDbConnection(): DatabaseSync {
  if (!globalForDb.__circularesDb) {
    globalForDb.__circularesDb = createDb();
  }
  return globalForDb.__circularesDb;
}
