<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from "vue";
import axios from "axios";

interface Folder {
  id: number;
  name: string;
  parent_id: number | null;
  children?: Folder[];
}

const props = defineProps<{
  folder: Folder;
  expandedFolders: Set<number>;
}>();

const emit = defineEmits<{
  (e: "toggle", folderId: number): void;
  (e: "select", folderId: number): void;
}>();

const subfolders = ref<Folder[]>([]);
const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);

const fetchSubfolders = async (parentId: number) => {
  try {
    isLoading.value = true;
    const res = await axios.get("http://localhost:3000/folders", {
      params: { parentId },
    });
    return res.data;
  } catch (err) {
    error.value = "Failed to fetch subfolders";
    console.error(err);
    return [];
  } finally {
    isLoading.value = false;
  }
};

const isExpanded = computed(() => props.expandedFolders.has(props.folder.id));

const toggle = async (folderId: number) => {
  emit("toggle", folderId);
  if (!isExpanded.value && subfolders.value.length === 0) {
    subfolders.value = await fetchSubfolders(folderId);
  }
};

const select = (folderId: number) => {
  emit("select", folderId);
};

watch(
  () => props.expandedFolders.has(props.folder.id),
  async (isExpanded) => {
    if (isExpanded && subfolders.value.length === 0) {
      subfolders.value = await fetchSubfolders(props.folder.id);
    }
  }
);
</script>

<template>
  <div>
    <div class="folder-item">
      <i :class="{'folder icon': !isExpanded, 'folder open icon': isExpanded}" @click.stop="toggle(props.folder.id)"></i>
      <span @click="select(props.folder.id)">{{ props.folder.name }}</span>
    </div>
    <div v-if="isExpanded" class="subfolder-list">
      <div v-if="isLoading" class="loading">
        <i class="spinner loading icon"></i> Loading...
      </div>
      <div v-else-if="error" class="error">
        <i class="exclamation circle icon"></i> {{ error }}
      </div>
      <div v-else>
        <FolderItem
          v-for="subfolder in subfolders"
          :key="subfolder.id"
          :folder="subfolder"
          :expandedFolders="props.expandedFolders"
          @toggle="toggle"
          @select="select"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.folder-item {
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
}

.folder-item:hover {
  background-color: #f0f0f0;
}

.folder-item i {
  margin-right: 5px;
}

.subfolder-list {
  padding-left: 20px;
  border-left: 1px solid #ccc;
  margin-left: 10px;
}

.loading, .error {
  padding: 10px;
  text-align: center;
}
</style>