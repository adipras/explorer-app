import { Elysia } from "elysia";
import { getFolders, createFolder } from "./src/services/folderService";
import { getFiles, createFile } from "./src/services/fileService";
import { swagger } from "@elysiajs/swagger";
import "dotenv/config";
import cors from "@elysiajs/cors";

const app = new Elysia()
  .use(cors())
  .use(swagger({
    documentation: {
      info: {
        title: "Explorer App API",
        description: "API documentation for the Explorer App",
        version: "1.0.0",
      },
      paths: {
        "/folders": {
          get: {
            summary: "Get folders",
            parameters: [
              {
                name: "parentId",
                in: "query",
                required: false,
                schema: {
                  type: "string",
                },
                description: "Parent folder ID",
              },
            ],
            responses: {
              200: {
                description: "A list of folders",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          name: { type: "string" },
                          parent_id: { type: "string" },
                          created_at: { type: "string", format: "date-time" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          post: {
            summary: "Create a folder",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      parentId: { type: "string" },
                    },
                    required: ["name"],
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Folder created",
              },
            },
          },
        },
        "/files": {
          get: {
            summary: "Get files",
            parameters: [
              {
                name: "folderId",
                in: "query",
                required: true,
                schema: {
                  type: "string",
                },
                description: "Folder ID",
              },
            ],
            responses: {
              200: {
                description: "A list of files",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          name: { type: "string" },
                          folder_id: { type: "string" },
                          created_at: { type: "string", format: "date-time" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          post: {
            summary: "Create a file",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      folderId: { type: "string" },
                    },
                    required: ["name", "folderId"],
                  },
                },
              },
            },
            responses: {
              201: {
                description: "File created",
              },
            },
          },
        },
      },
    },
  }))
  .get("/folders", ({ query }) => getFolders(query.parentId ?? null))
  .post("/folders", async ({ body, set }: {
    body: {
      name: string;
      parentId: string | null
    },
    set: {status: number}
  }) => {
    await createFolder(body.name, body.parentId);
    set.status = 201;
  })
  .get("/files", ({ query }) => getFiles(query.folderId))
  .post("/files", async ({ body, set }: { body: { name: string; folderId: string }, set: {status: number} }) => {
    await createFile(body.name, body.folderId);
    set.status = 201;
  })
  .listen(3000);

console.log("Backend running on http://localhost:3000");