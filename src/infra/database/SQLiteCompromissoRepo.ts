import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { CompromissosRepo } from "../../core/repositories/CompromissosRepo";
import { Compromissos } from "../../core/entities/Compromissos";

export class SQLiteCompromissoRepo implements CompromissosRepo {
  private dbPromise: Promise<Database>;

  constructor() {
    this.dbPromise = open({
      filename: "./database.sqlite",
      driver: sqlite3.Database,
    }).then(async (db) => {
      await db.run(`
                CREATE TABLE IF NOT EXISTS compromissos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    inicio_data TEXT,
                    fim_data TEXT,
                    descricao TEXT
                )
            `);
      return db;
    });
  }

  async salvar(appt: Compromissos): Promise<void> {
    const db = await this.dbPromise;
    await db.run(
      "INSERT INTO compromissos (inicio_data, fim_data, descricao) VALUES (?, ?, ?)",
      appt.inicio_data.toISOString(),
      appt.fim_data.toISOString(),
      appt.descricao
    );
  }

  async listar(): Promise<Compromissos[]> {
    const db = await this.dbPromise;
    const rows = await db.all("SELECT * FROM compromissos");
    return rows.map((row) => ({
      ...row,
      inicio_data: new Date(row.inicio_data),
      fim_data: new Date(row.fim_data),
    }));
  }

  async encontrarSobreposicao(
    start: Date,
    end: Date
  ): Promise<Compromissos | null> {
    const db = await this.dbPromise;
    const result = await db.get(
      `SELECT * FROM compromissos 
             WHERE inicio_data < ? AND fim_data > ?`,
      end.toISOString(),
      start.toISOString()
    );

    if (!result) return null;

    return {
      ...result,
      inicio_data: new Date(result.inicio_data),
      fim_data: new Date(result.fim_data),
    };
  }
}
