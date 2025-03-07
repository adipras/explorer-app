<script setup lang="ts">
import FolderTree from './components/FolderTree.vue';
</script>

<template>
  <div class="ui grid">
    <div class="column">
      <FolderTree />
    </div>
  </div>
</template>

<style scoped>
.ui.grid {
  height: 100vh;
}
</style>
