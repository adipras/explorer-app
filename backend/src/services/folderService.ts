import { db } from "../db";
import { v4 as uuidv4 } from 'uuid';

export const getFolders = async (parentId: string | null) => {
  let query = db.selectFrom("folders").selectAll();

  if (parentId !== null && parentId !== "") {
    query = query.where("parent_id", "=", parentId);
  } else {
    query = query.where("parent_id", "=", "");
  }

  const folders = await query.execute();

  return folders.map(folder => ({
    ...folder,
    created_at: folder.created_at.toISOString(),
  }));
};

export const createFolder = async (name: string, parentId: string | null) => {
  const newFolder = {
    id: uuidv4(),
    name,
    parent_id: parentId,
    created_at: new Date(),
  };

  await db.insertInto("folders")
    .values(newFolder)
    .execute();
};
