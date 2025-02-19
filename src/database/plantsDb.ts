import { openDatabaseSync, SQLiteDatabase } from "expo-sqlite";

// Abre o banco de dados
const db: SQLiteDatabase = openDatabaseSync("plants.db");

// 📌 Criar tabela se não existir
export const initDb = () => {
  db.execAsync(`
    CREATE TABLE IF NOT EXISTS plants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      nomeCientifico TEXT,
      umidade INTEGER NOT NULL
    );
  `).catch((error) => console.error("Erro ao criar tabela:", error));
};

// 📌 Adicionar uma nova planta
export const addPlant = async (nome: string, nomeCientifico: string, umidade: number): Promise<number | null> => {
  try {
    const result = await db.runAsync(
      "INSERT INTO plants (nome, nomeCientifico, umidade) VALUES (?, ?, ?);",
      [nome, nomeCientifico || null, umidade]
    );
    return result.lastInsertRowId ?? null;
  } catch (error) {
    console.error("Erro ao adicionar planta:", error);
    return null;
  }
};

// 📌 Buscar todas as plantas
export const getPlants = async (): Promise<{ id: number; nome: string; nomeCientifico: string | null; umidade: number }[]> => {
  try {
    const result = await db.getAllAsync("SELECT * FROM plants;");
    return result as { id: number; nome: string; nomeCientifico: string | null; umidade: number }[];
  } catch (error) {
    console.error("Erro ao buscar plantas:", error);
    return [];
  }
};

// 📌 Remover uma planta
export const removePlant = async (id: number): Promise<boolean> => {
  try {
    await db.runAsync("DELETE FROM plants WHERE id = ?;", [id]);
    return true;
  } catch (error) {
    console.error("Erro ao remover planta:", error);
    return false;
  }
};
