<template>
  <div class="page-container page-container--bg">
    <el-card shadow="never">
      <NTLineTree :data="treeData"></NTLineTree>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NTLineTree from '@/components/NTLineTree/index.vue'

const treeData = ref([
  {
    name: '生物',
    open: true,
    children: [
      {
        name: '植物',
        open: true,
        children: [
          {
            name: '无种子植物',
            children: [
              {
                name: '藻类植物',
              },
              {
                name: '苔藓植物',
              },
              {
                name: '蕨类植物',
              },
            ],
          },
          {
            name: '种子植物',
            open: true,
            children: [
              {
                name: '裸子植物',
              },
              {
                name: '被子植物',
              },
            ],
          },
        ],
      },
      {
        name: '动物',
        open: true,
        children: [
          {
            name: '无脊椎动物',
          },
          {
            name: '脊椎动物',
          },
        ],
      },
    ],
  },
])
</script>

<style lang="scss" scoped></style>