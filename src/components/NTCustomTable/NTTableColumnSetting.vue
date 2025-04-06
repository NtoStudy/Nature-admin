<template>
  <NTTable
    :columns="columnSettingTableColumns"
    :data="columnSettingTableData"
    :height="300"
    size="small"
    :show-overflow-tooltip="true"
    :pagination="{ isShow: false }"
  ></NTTable>
</template>

<script setup>
import { computed, h, nextTick, resolveComponent } from 'vue'
import NTTable from '@/components/NTTable/index.vue'

// Props 定义
const props = defineProps({
  tableColumns: {
    type: Array,
    default: () => [],
  },
})

// Emits 定义
const emit = defineEmits(['update:tableColumns'])

const dataFormatConfWithElSwitch = (field) => {
  return {
    renderType: 'html',
    withScopeRow: true,
    formatFunction: ({ row }) => {
      return {
        setup() {
          const ElSwitch = resolveComponent('ElSwitch')
          return () => {
            return h(ElSwitch, {
              'model-value': row[field],
              'onUpdate:modelValue': (checked) => {
                updateColumns(field, checked, row)
              },
            })
          }
        },
      }
    },
  }
}

// 更新表格列
const updateColumns = (field, value, row) => {
  nextTick(() => {
    const tableColumns = [...props.tableColumns]
    const index = tableColumns.findIndex((column) => {
      return column.prop === row.originColumnProp
    })
    if (index !== -1) {
      tableColumns[index][field] = value
      emit('update:tableColumns', tableColumns)
    }
  })
}

// 表格列设置功能表格列配置
const columnSettingTableColumns = [
  {
    label: '序号',
    prop: '$index',
    width: 80,
    sortable: true,
  },
  {
    label: '列名称',
    prop: 'columnTitle',
    width: 160,
  },
  {
    label: '是否显示',
    prop: 'isVisible',
    width: 80,
    dataFormatConf: dataFormatConfWithElSwitch('isVisible'),
  },
  {
    label: '开启排序',
    prop: 'sortable',
    width: 80,
    dataFormatConf: dataFormatConfWithElSwitch('sortable'),
  },
  {
    label: '是否固定',
    prop: 'fixed',
    width: 130,
    dataFormatConf: {
      renderType: 'html',
      withScopeRow: true,
      formatFunction: ({ row }) => {
        return {
          setup() {
            const ElSelect = resolveComponent('ElSelect')
            const ElOption = resolveComponent('ElOption')
            return () => {
              return h(
                ElSelect,
                {
                  'model-value': row.fixed,
                  clearable: true,
                  'onUpdate:modelValue': (selectedValue) => {
                    updateColumns('fixed', selectedValue, row)
                  },
                  onClear: () => {
                    updateColumns('fixed', false, row)
                  },
                },
                () => [
                  h(ElOption, {
                    value: false,
                    label: '不固定',
                  }),
                  h(ElOption, {
                    value: 'left',
                    label: '固定-左侧',
                  }),
                  h(ElOption, {
                    value: 'right',
                    label: '固定-右侧',
                  }),
                ],
              )
            }
          },
        }
      },
    },
  },
]

// 列设置表格数据
const columnSettingTableData = computed(() => {
  const columnSettingTableDataFormated = []

  props.tableColumns.forEach((tbColumn) => {
    const columnSettingTableDataFormatedRow = {
      originColumnProp: tbColumn.prop,
    }

    columnSettingTableColumns.forEach((columnSettingTableColumn) => {
      let columnSettingTableDataFormatedColValue = null
      if (columnSettingTableColumn.prop === 'isVisible') {
        columnSettingTableDataFormatedColValue = tbColumn.isVisible !== false
      } else if (columnSettingTableColumn.prop === 'columnTitle') {
        columnSettingTableDataFormatedColValue = tbColumn.label
      } else if (columnSettingTableColumn.prop === 'sortable') {
        columnSettingTableDataFormatedColValue = tbColumn.sortable === true
      } else if (columnSettingTableColumn.prop === 'fixed') {
        columnSettingTableDataFormatedColValue = [undefined, false].includes(tbColumn.fixed) ? false : tbColumn.fixed
      }
      columnSettingTableDataFormatedRow[columnSettingTableColumn.prop] = columnSettingTableDataFormatedColValue
    })
    columnSettingTableDataFormated.push(columnSettingTableDataFormatedRow)
  })

  return columnSettingTableDataFormated
})
</script>

<style lang="scss" scoped>
.nt-table {
  padding-bottom: 0;
  margin-bottom: 0;

  :deep(.el-table) {
    .el-table__inner-wrapper {
      &::before {
        display: none;
      }
    }
  }
}
</style>
