import * as SQLite from "expo-sqlite";

let databaseInstance: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!databaseInstance) {
    databaseInstance = SQLite.openDatabaseAsync('deviceCoordinates.db');
    const db = await databaseInstance;
    await migrateDatabase(db);
  }
  return databaseInstance;
};

const CURRENT_VERSION = 1;

const migrateDatabase = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  try {
    const versionTable = await db.getFirstAsync<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='db_version'`
    );

    if (!versionTable) {
      await db.execAsync(`CREATE TABLE db_version (version INTEGER NOT NULL)`);
      await db.runAsync(`INSERT INTO db_version (version) VALUES (0)`);
    }

    const dbVersion = await db.getFirstAsync<{ version: number }>(
      `SELECT version FROM db_version LIMIT 1`
    );
    const currentDbVersion = dbVersion?.version || 0;

    if (currentDbVersion < 1) {
      console.log("Running migration to version 1");
      await db.execAsync(`
        PRAGMA foreign_keys = OFF;
        
        -- Ensure WAL mode is enabled for better performance
        PRAGMA journal_mode = WAL;
        
        -- Create devices table
        CREATE TABLE IF NOT EXISTS devices (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        );
        
        -- Create device_info table
        CREATE TABLE IF NOT EXISTS device_info (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          device_id INTEGER NOT NULL,
          latitude REAL,
          longitude REAL,
          title TEXT,
          details TEXT,
          FOREIGN KEY (device_id) REFERENCES devices (id) ON DELETE CASCADE
        );
        
        -- Create indices for better performance
        CREATE INDEX IF NOT EXISTS idx_device_info_device_id ON device_info (device_id);
        
        PRAGMA foreign_keys = ON;
      `);
    }

    await db.runAsync(`UPDATE db_version SET version = ?`, [CURRENT_VERSION]);
    console.log(`Database migrated to version ${CURRENT_VERSION}`);
  } catch (error) {
    console.error("Error during database migration:", error);
    throw error;
  }
};

export const enableForeignKeys = async (): Promise<void> => {
  const db = await getDatabase();
  await db.execAsync('PRAGMA foreign_keys = ON');
};

export const initializeDatabase = async (): Promise<void> => {
  await getDatabase();
  await enableForeignKeys();
};