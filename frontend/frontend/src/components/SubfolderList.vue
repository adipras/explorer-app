<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
import axios from "axios";

interface Folder {
  id: number;
  name: string;
  parent_id: number | null;
}

interface File {
  id: number;
  name: string;
  folder_id: number;
}

const props = defineProps<{ parentId: number | null }>();

const subfolders = ref<Folder[]>([]);
const files = ref<File[]>([]);
const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);

const fetchSubfoldersAndFiles = async (parentId: number | null) => {
  if (parentId === null) return { subfolders: [], files: [] };
  try {
    isLoading.value = true;
    const [subfoldersRes, filesRes] = await Promise.all([
      axios.get("http://localhost:3000/folders", { params: { parentId } }),
      axios.get("http://localhost:3000/files", { params: { folderId: parentId } }),
    ]);
    return { subfolders: subfoldersRes.data, files: filesRes.data };
  } catch (err) {
    error.value = "Failed to fetch subfolders and files";
    console.error(err);
    return { subfolders: [], files: [] };
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.parentId,
  async (newParentId) => {
    const { subfolders: fetchedSubfolders, files: fetchedFiles } = await fetchSubfoldersAndFiles(newParentId);
    subfolders.value = fetchedSubfolders;
    files.value = fetchedFiles;
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <div v-if="isLoading" class="ui active inline loader"></div>
    <div v-else-if="error" class="ui negative message">
      <div class="header">Error</div>
      <p>{{ error }}</p>
    </div>
    <div v-else>
      <div v-for="folder in subfolders" :key="folder.id" class="folder-item">
        <i class="folder icon"></i> {{ folder.name }}
      </div>
      <div v-for="file in files" :key="file.id" class="file-item">
        <i class="file icon"></i> {{ file.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.folder-item, .file-item {
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.folder-item:hover, .file-item:hover {
  background-color: #f0f0f0;
}

.folder-item i, .file-item i {
  margin-right: 5px;
}
</style>