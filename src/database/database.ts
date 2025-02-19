import { openDatabaseSync } from "expo-sqlite";

const db = openDatabaseSync("plants.db");

export default db;
