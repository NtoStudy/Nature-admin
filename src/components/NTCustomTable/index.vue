<template>
  <div class="nt-custom-table">
    <NTTable ref="ntTableRef" v-bind="tableAttrs">
      <slot></slot>
      <template #otherOperate="{ row: $row }">
        <slot name="otherOperate" :row="$row"></slot>
      </template>
      <template #empty>
        <slot name="empty"></slot>
      </template>
    </NTTable>

    <div v-if="isShowSetting" class="nt-custom-table__setting">
      <el-popover
        ref="tableStyleSettingPopoverRef"
        placement="top"
        title="表格设置"
        :width="400"
        trigger="click"
        :hide-after="0"
      >
        <template #reference>
          <el-button circle>
            <i class="ri-table-line"></i>
          </el-button>
        </template>

        <NTTableStyleSetting v-model:config="tableStyleConfig"></NTTableStyleSetting>
      </el-popover>

      <el-popover placement="top" title="表格列设置" width="auto" trigger="click" :hide-after="0">
        <template #reference>
          <el-button circle>
            <i class="ri-equalizer-line"></i>
          </el-button>
        </template>

        <NTTableColumnSetting v-model:tableColumns="tableColumnConfig"></NTTableColumnSetting>
      </el-popover>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, useAttrs } from 'vue'
import NTTableStyleSetting from './NTTableStyleSetting.vue'
import NTTableColumnSetting from './NTTableColumnSetting.vue'
import NTTable from '@/components/NTTable/index.vue'

defineProps({
  isShowSetting: {
    type: Boolean,
    default: true,
  },
})

const attrs = useAttrs()
const ntTableRef = ref()

// 表格风格设置配置
const tableStyleConfig = ref({
  size: 'default',
  stripe: true,
  border: true,
})

// 表格列column设置配置
const tableColumnConfig = ref(attrs.columns || [])

const computedColumns = computed(() => {
  return tableColumnConfig.value.filter((column) => {
    return column.isVisible !== false
  })
})

const tableAttrs = computed(() => {
  return {
    ...attrs,
    ...tableStyleConfig.value,
    columns: computedColumns.value,
  }
})

const tableStyleSettingPopoverRef = ref()

watch(
  () => tableStyleConfig.value,
  () => {
    // 表格的尺寸变化后，动态调整popover位置
    tableStyleSettingPopoverRef.value?.popperRef?.popperInstanceRef?.update()
  },
  {
    deep: true,
  },
)
</script>

<style lang="scss" scoped>
.nt-custom-table {
  position: relative;
  &__setting {
    position: absolute;
    right: 16px;
    bottom: 12px;
  }
}
</style>
