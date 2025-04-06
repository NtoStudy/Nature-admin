<!--
 * 列表搜索筛选过滤表单item
-->
<template>
  <el-col v-bind="colComputedAttrs" class="nt-search-form-filter-item">
    <slot></slot>
  </el-col>
</template>

<script setup>
import { computed, useAttrs } from 'vue'

const attrs = useAttrs()
const colComputedAttrs = computed(() => {
  return {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 8,
    xl: 6,
    ...attrs?.col,
  }
})
</script>

<style lang="scss" scoped></style>