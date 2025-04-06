<!--
 * 列表搜索筛选过滤表单
-->
<template>
  <div class="nt-search-form-filter">
    <el-form v-bind="$attrs" ref="ntSearchFormFilterForm">
      <el-row>
        <slot :isFoldFormFilter="isFoldFormFilter"></slot>

        <NTSearchFormFilterItem
          :col="$attrs?.btnsCol"
          class="nt-search-form-filter__btns"
        >
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="handleSearch">
              查 询
            </el-button>
            <el-button plain @click="handleReset">重 置</el-button>
            <el-button
              v-if="isShowFoldUnfoldBtn"
              link
              type="primary"
              @click="isFoldFormFilter = !isFoldFormFilter"
            >
              {{ isFoldFormFilter ? '展开' : '收起' }}
              <i v-show="isFoldFormFilter" class="ri-arrow-down-s-line"></i>
              <i v-show="!isFoldFormFilter" class="ri-arrow-up-s-line"></i>
            </el-button>
          </el-form-item>
        </NTSearchFormFilterItem>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import useCurrentInstance from '@/hooks/business/useCurrentInstance'
import NTSearchFormFilterItem from './NTSearchFormFilterItem/index.vue'

const props = defineProps({
  isShowFoldUnfoldBtn: {
    type: Boolean,
    default: true,
  },
  searchHandle: {
    type: Function,
    default: null,
  },
  resetHandle: {
    type: Function,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const {
  $is: { isFunction },
} = useCurrentInstance()

const ntSearchFormFilterForm = ref(null)
const isFoldFormFilter = ref(true)

const handleSearch = () => {
  if (isFunction(props?.searchHandle)) {
    props?.searchHandle()
  }
}

const handleReset = () => {
  if (isFunction(props?.resetHandle)) {
    props?.resetHandle()
  }
}
</script>

<style lang="scss" scoped>
.nt-search-form-filter {
  padding: 24px 12px 12px;
  background: #fff;
}
</style>