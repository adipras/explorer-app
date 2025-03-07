import { db } from "../db";
import { v4 as uuidv4 } from 'uuid';

export const getFiles = async (folderId: string) => {
  return db.selectFrom("files")
    .where("folder_id", "=", folderId)
    .selectAll()
    .execute();
};

export const createFile = async (name: string, folderId: string) => {
  return db.insertInto("files")
    .values({ id: uuidv4(), name, folder_id: folderId, created_at: new Date() })
    .execute();
};
