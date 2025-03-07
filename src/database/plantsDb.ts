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

  db.execAsync(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      humidity INTEGER NOT NULL,
      id_plant INTEGER NOT NULL,
      message TEXT,
      FOREIGN KEY (id_plant) REFERENCES plants(id) ON DELETE CASCADE
    );
  `).catch((error) => console.error("Erro ao criar tabela de relatórios:", error));
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

// 📌 Buscar planta por ID
export const getPlantById = async (id: number): Promise<{ id: number; nome: string; nomeCientifico: string | null; umidade: number } | null> => {
  try {
    const result = await db.getFirstAsync("SELECT * FROM plants WHERE id = ?;", [id]);
    return result as { id: number; nome: string; nomeCientifico: string | null; umidade: number } | null;
  } catch (error) {
    console.error("Erro ao buscar planta por ID:", error);
    return null;
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

//  Adicionar um novo relatório
// Adicionar um novo relatório de forma assíncrona e sequencial
export const addReport = async (humidity: number, id_plant: number, message: string | null = null): Promise<number | null> => {
  try {
    // Adicionando atraso de 100ms entre as operações, caso necessário
    await new Promise(resolve => setTimeout(resolve, 100));

    const result = await db.runAsync(
      "INSERT INTO reports (humidity, id_plant, message) VALUES (?, ?, ?);",
      [humidity, id_plant, message]
    );
    return result.lastInsertRowId ?? null;
  } catch (error) {
    console.error("Erro ao adicionar relatório:", error);
    return null;
  }
};


// 📌 Buscar todos os relatórios
export const getReports = async (): Promise<{ id: number; timestamp: string; humidity: number; id_plant: number; message: string | null }[]> => {
  try {
    const result = await db.getAllAsync("SELECT * FROM reports ORDER BY timestamp DESC;");
    return result as { id: number; timestamp: string; humidity: number; id_plant: number; message: string | null }[];
  } catch (error) {
    console.error("Erro ao buscar relatórios:", error);
    return [];
  }
};

// 📌 Buscar relatórios por planta
export const getReportsByPlant = async (id_plant: number): Promise<{ id: number; timestamp: string; humidity: number; message: string | null }[]> => {
  try {
    const result = await db.getAllAsync("SELECT * FROM reports WHERE id_plant = ? ORDER BY timestamp DESC;", [id_plant]);
    return result as { id: number; timestamp: string; humidity: number; message: string | null }[];
  } catch (error) {
    console.error("Erro ao buscar relatórios por planta:", error);
    return [];
  }
};

// 📌 Remover um relatório
export const removeReport = async (id: number): Promise<boolean> => {
  try {
    await db.runAsync("DELETE FROM reports WHERE id = ?;", [id]);
    return true;
  } catch (error) {
    console.error("Erro ao remover relatório:", error);
    return false;
  }
};
