<template>
  <div class="nt-line-tree">
    <div v-for="(row, idx) in data" :key="idx" class="row">
      <NTLineTreeItem :treeData="[row]"></NTLineTreeItem>
    </div>
  </div>
</template>

<script setup>
import NTLineTreeItem from './NTLineTreeItem.vue'

defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})
</script>

<style lang="scss" scoped>
.nt-line-tree {
  .row {
    display: flex;
  }
}
</style>