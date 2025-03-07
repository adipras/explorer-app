import { Kysely, MysqlDialect, Migrator, FileMigrationProvider } from "kysely";
import { createPool } from "mysql2";
import path from 'path';
import fs from 'fs/promises';
import 'dotenv/config';

interface Database {
  folders: {
    id: string;
    name: string;
    parent_id: string | null;
    created_at: Date;
  };
  files: {
    id: string;
    name: string;
    folder_id: string;
    created_at: Date;
  };
}

export const db = new Kysely<Database>({
  dialect: new MysqlDialect({
    pool: createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    }),
  }),
});

export const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    migrationFolder: path.join(__dirname, 'migrations'),
    path,
  }),
});
