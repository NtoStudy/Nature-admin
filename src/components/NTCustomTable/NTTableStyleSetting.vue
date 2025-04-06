<!--
 * 表格设置
-->
<template>
  <el-form label-width="80px" label-position="left">
    <el-form-item label="显示尺寸">
      <el-radio-group v-model="tableConfig.size" size="small">
        <el-radio-button value="large">大</el-radio-button>
        <el-radio-button value="default">正常</el-radio-button>
        <el-radio-button value="small">小</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="风格化">
      <el-checkbox v-model="tableConfig.border" label="纵向边框" />
      <el-checkbox v-model="tableConfig.stripe" label="斑马纹" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { computed } from 'vue'


const props = defineProps({
  config: {
    type: Object,
    default: () => ({
      size: 'default',
      stripe: true,
      border: false,
    }),
  },
})

const emit = defineEmits(['update:config'])

const tableConfig = computed({
  get() {
    return props.config
  },
  set(value) {
    emit('update:config', value)
  },
})
</script>

<style lang="scss" scoped></style>