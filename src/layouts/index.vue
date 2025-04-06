<!-- layout页面框架结构整体布局主入口-->
<template>
  <NTLayoutNormalMode ref="ntLayoutModeRef"></NTLayoutNormalMode>
</template>

<script setup>
import { ref, watch } from 'vue'
import useLayoutStore from '@/store/modules/layout.js'
import { useCssVar } from '@vueuse/core'
import NTLayoutNormalMode from '@/layouts/layoutMode/NTLayoutNormalMode/index.vue'

// 菜单展开状态下的宽度
const NAV_MENU_UNFOLD_WIDTH = '200px'
// 菜单折叠状态下的宽度
const NAV_MENU_FOLD_WIDTH = '64px'

const layoutStore = useLayoutStore()

// 操作左侧菜单导航宽度css变量
const ntLayoutModeRef = ref(null)
const layoutMenuWidth = useCssVar('--nt-layout-menu-width', ntLayoutModeRef, {
  initialValue: NAV_MENU_UNFOLD_WIDTH,
})

watch(
  () => layoutStore.isNavMenuFold,
  (status) => {
    if (status) {
      layoutMenuWidth.value = NAV_MENU_FOLD_WIDTH
    } else {
      layoutMenuWidth.value = NAV_MENU_UNFOLD_WIDTH
    }

    console.log('layoutMenuWidth', layoutMenuWidth.value)
  },
)
</script>

<style lang="scss" scoped></style>
