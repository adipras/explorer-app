<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import FolderItem from "./FolderItem.vue";
import SubfolderList from "./SubfolderList.vue";

interface Folder {
  id: number;
  name: string;
  parent_id: number | null;
  children?: Folder[];
}

const folders = ref<Folder[]>([]);
const expandedFolders = ref<Set<number>>(new Set());
const selectedFolderId = ref<number | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);

const fetchFolders = async (parentId: number | null = null) => {
  try {
    const res = await axios.get("http://localhost:3000/folders", {
      params: { parentId },
    });
    return res.data;
  } catch (err) {
    error.value = "Failed to fetch folders";
    console.error(err);
    return [];
  } finally {
    isLoading.value = false;
  }
};

const loadFolders = async () => {
  folders.value = await fetchFolders();
};

const toggleFolder = (folderId: number) => {
  if (expandedFolders.value.has(folderId)) {
    expandedFolders.value.delete(folderId);
  } else {
    expandedFolders.value.add(folderId);
  }
};

const selectFolder = (folderId: number) => {
  selectedFolderId.value = folderId;
};

onMounted(loadFolders);
</script>

<template>
  <div class="explorer-container">
    <div class="folder-tree">
      <div v-if="isLoading" class="ui active inline loader"></div>
      <div v-else-if="error" class="ui negative message">
        <div class="header">Error</div>
        <p>{{ error }}</p>
      </div>
      <div v-else>
        <FolderItem
          v-for="folder in folders"
          :key="folder.id"
          :folder="folder"
          :expandedFolders="expandedFolders"
          @toggle="toggleFolder"
          @select="selectFolder"
        />
      </div>
    </div>
    <div class="subfolder-list">
      <h2 class="ui header">Files & Subfolders</h2>
      <SubfolderList :parentId="selectedFolderId" />
    </div>
  </div>
</template>

<style scoped>
.explorer-container {
  display: flex;
  height: 100vh;
}

.folder-tree {
  flex: 0 1 auto;
  border-right: 1px solid #ccc;
  padding: 10px;
  overflow-y: auto;
}

.subfolder-list {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.folder-item {
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.folder-item:hover {
  background-color: #f0f0f0;
}

.folder-item i {
  margin-right: 5px;
}
</style>
