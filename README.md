# Explorer App

## Overview
Explorer App is a web-based file explorer application built with modern technologies. It allows users to navigate a nested folder structure, view files, and perform search operations efficiently.

## Features
- **Technologies Used**:
  - **Backend**: TypeScript, Elysia.js, Bun.js, MySQL, Kysely ORM
  - **Frontend**: Vue 3 (Composition API), Fomantic-UI

## Installation
### Prerequisites
- [Bun](https://bun.sh/)
- MySQL
- Node.js (optional for Vue CLI)

### Clone Repository
```sh
git clone https://github.com/adipras/explorer-app.git
cd explorer-app
```

### Setup Backend
```sh
cd backend
bun install
cp .env.example .env
# Configure MySQL credentials in .env
bun run src/index.ts
```

### Setup Frontend
```sh
cd ../frontend
bun install
bun run dev
```

## API Endpoints
| Method | Endpoint         | Description                  |
|--------|-----------------|------------------------------|
| GET    | /folders        | Fetch top-level folders      |
| GET    | /folders?parentId={id} | Fetch subfolders of a folder |
| POST   | /folders        | Create a new folder         |
| GET    | /files?folderId={id} | Fetch files in a folder |
| POST   | /files          | Upload a new file           |



