<template>
  <div class="page-container page-container--bg flex">
    <div class="poem-category flex">
      <NTColumn>
        <template #header>
          <div class="truncate">诗歌分类</div>
        </template>

        <NTList
          v-loading="categoryLoading"
          :list="categoryList"
          :options="categoryListOptions"
          :beforeLeave="beforeLeaveGuard"
          @switch="handleSwitchCategoryListItem"
          @row-context-menu="handleCategoryRowContextMenu"
        ></NTList>

        <template #footer>
          <el-button type="primary" class="block w-40">新增</el-button>
        </template>
      </NTColumn>
    </div>

    <div class="poem-list">
      <!-- S 搜索表单 -->
      <NTSearchFormFilter
        ref="searchFormFilterRef"
        :model="searchFormFilter"
        :inline="true"
        label-width="80"
        label-position="left"
        :loading="loadding"
        :searchHandle="handleSearch"
        :resetHandle="handleReset"
      >
        <template #default="{ isFoldFormFilter }">
          <NTSearchFormFilterItem>
            <el-form-item label="标题:" prop="title">
              <el-input
                v-model.trim="searchFormFilter.title"
                clearable
                placeholder="请输入标题"
                @clear="handleSearch"
              />
            </el-form-item>
          </NTSearchFormFilterItem>

          <NTSearchFormFilterItem>
            <el-form-item label="作者名称:" prop="author">
              <el-input
                v-model.trim="searchFormFilter.author"
                clearable
                placeholder="请输入作者"
                @clear="handleSearch"
              />
            </el-form-item>
          </NTSearchFormFilterItem>

          <NTSearchFormFilterItem>
            <el-form-item label="时期:" prop="dynasty">
              <el-input
                v-model.trim="searchFormFilter.dynasty"
                clearable
                placeholder="请输入时期"
                @clear="handleSearch"
              />
            </el-form-item>
          </NTSearchFormFilterItem>

          <NTSearchFormFilterItem v-show="!isFoldFormFilter">
            <el-form-item label="状态:" prop="publishStatus">
              <el-input
                v-model.trim="searchFormFilter.publishStatus"
                clearable
                placeholder="请输入状态"
                @clear="handleSearch"
              />
            </el-form-item>
          </NTSearchFormFilterItem>
        </template>
      </NTSearchFormFilter>
      <!-- E 搜索表单 -->

      <!-- S 表格列表 -->
      <NTCustomTable
        ref="tableRef"
        v-loading="loadding"
        :data="dataList"
        :columns="columns"
        stripe
        :show-overflow-tooltip="true"
        :pagination="pagination"
        @page-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
        <template #otherOperate="{ row }">
          <el-button type="primary" text size="small" @click="handleShowDetail(row)">详情 </el-button>
        </template>
      </NTCustomTable>
      <!-- E 表格列表 -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, resolveComponent, h } from 'vue'
import { ElMessageBox } from 'element-plus'
import useCurrentInstance from '@/hooks/business/useCurrentInstance'
import useListPage from '@/hooks/business/useListPage'
import NTColumn from '@/components/NTColumn/index.vue'
import NTList from '@/components/NTList/index.vue'
import NTSearchFormFilter from '@/components/NTSearchFormFilter/index.vue'
import NTSearchFormFilterItem from '@/components/NTSearchFormFilter/NTSearchFormFilterItem/index.vue'
import NTCustomTable from '@/components/NTCustomTable/index.vue'

const { $api, $apiCode, $message, $dict } = useCurrentInstance()
const { list: dataList, loadding } = useListPage()

// 分类列表配置
const categoryListOptions = {
  key: 'id',
  label: 'name',
}

const categoryList = ref([])

// 当前选中的分类
const currentCategoryIndex = ref('')
const currentCategory = ref({})

// 分类列表获取
const categoryLoading = ref(false)
const categorySearchFormFilter = reactive({
  name: '',
})

const getCategoryList = async () => {
  categoryLoading.value = true

  const { name } = categorySearchFormFilter

  const params = {
    name,
  }

  const apiRes = await $api.poem.getPoemCategoryList(params).catch((error) => {
    $message.error({
      message: error,
      duration: 3000,
    })
    setTimeout(() => {
      categoryLoading.value = false
    }, 150)
  })

  const { code, data, msg } = apiRes.data
  if (code === $apiCode.SUCCESS && data) {
    categoryList.value = [
      {
        id: '',
        name: '全部',
      },
      ...data,
    ]
  } else {
    $message.error({
      message: msg,
      duration: 3000,
    })
  }
  setTimeout(() => {
    categoryLoading.value = false
  }, 150)
}

getCategoryList()

const tableRef = ref(null)
const searchFormFilterRef = ref(null)
const searchFormFilter = reactive({
  title: '',
  category: '',
  author: '',
})

// 列表列配置
const columns = [
  {
    label: '#',
    prop: '$index',
    width: 80,
  },
  {
    label: '标题',
    prop: 'title',
  },
  {
    label: '封面',
    prop: 'cover',
    dataFormatConf: {
      renderType: 'html',
      withScopeRow: true,
      formatFunction: ({ value }) => {
        const component = {
          setup() {
            const ElImage = resolveComponent('ElImage')
            return () => {
              return h(ElImage, {
                src: value,
                fit: 'cover',
                'preview-src-list': [value],
                'preview-teleported': true,
                class: 'cover',
              })
            }
          },
        }
        return component
      },
    },
    minWidth: 60,
  },
  {
    label: '作者',
    prop: 'author',
  },
  {
    label: '分类',
    prop: 'category',
  },
  {
    label: '时期',
    prop: 'dynasty',
  },
  {
    label: '状态',
    prop: 'publishStatus',
    dataFormatConf: {
      withScopeRow: true,
      formatFunction: ({ value }) => {
        return `${$dict.$formatDictKeyToValue($dict.poem.PUBLISH_STATUS, value)}`
      },
    },
  },
  {
    label: '创建日期',
    prop: 'createTime',
  },
  {
    label: '操作',
    prop: 'TABLE_COLUMN_OPTS',
    fixed: 'right',
    width: 200,
    overflowTooltip: false,
  },
]

// 分页配置
const pagination = ref({
  layout: 'total, prev, pager, next, sizes, jumper',
  total: 0,
})

// 获取数据列表
const getDataList = async () => {
  let apiReqStatus = false
  loadding.value = true

  const { title, category } = searchFormFilter
  const { currentPage, pageSize } = tableRef.value
  const params = {
    title,
    category,
    page: currentPage,
    pageSize,
  }

  const apiRes = await $api.poem.getPoemList(params).catch((error) => {
    $message.error({
      message: error,
      duration: 3000,
    })
    setTimeout(() => {
      loadding.value = false
    }, 150)
  })

  const { code, data, msg } = apiRes.data
  if (code === $apiCode.SUCCESS && data) {
    const { list, total } = data
    dataList.value = list
    pagination.value.total = total
    apiReqStatus = true
  } else {
    $message.error({
      message: msg,
      duration: 3000,
    })
  }
  setTimeout(() => {
    loadding.value = false
  }, 150)
  return apiReqStatus
}

const handleCurrentChange = () => {
  getDataList()
}

const handleSizeChange = () => {
  getDataList()
}

const handleSearch = async () => {
  tableRef.value.currentPage = 1
  const apiRes = await getDataList()
  return apiRes
}

onMounted(() => {
  handleSearch()
})

const handleReset = () => {
  tableRef.value.currentPage = 1
  searchFormFilterRef.value.$refs.ntSearchFormFilterForm.resetFields()
  handleSearch()
}

const beforeLeaveGuard = async (index, item, value) => {
  searchFormFilter.category = value
  const apiRes = await handleSearch()
  return apiRes
}

const handleSwitchCategoryListItem = (value, item) => {
  currentCategoryIndex.value = value
  currentCategory.value = item
}

const handleCategoryRowContextMenu = (event, value, item) => {
  event.preventDefault()
  console.log(value, item)
}

const handleShowDetail = (row) => {
  ElMessageBox.confirm(
    `
      根据自身业务需要，使用row数据进行相关逻辑处理。
      <br />
      ${JSON.stringify(row)}
    `,
    '提示',
    {
      type: 'warning',
      dangerouslyUseHTMLString: true,
    },
  )
    .then(() => {})
    .catch(() => {})
  console.log(row)
}
</script>

<style lang="scss" scoped>
:deep(.cover) {
  width: 30px;
}
.poem-category {
  width: 188px;
  height: 360px;
}

.poem-list {
  flex: 1;
  @apply ml-[16px];
}
</style>
