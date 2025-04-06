<template>
  <div class="nt-echarts">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from 'vue'
import * as echarts from 'echarts'
// 重写原生的 addEventListener 方法，为滚轮事件添加 passive 选项
const patchEventListener = () => {
  const originalAddEventListener = Element.prototype.addEventListener
  Element.prototype.addEventListener = function (type, listener, options) {
    const modifiedOptions = options || {}
    if (type === 'mousewheel' || type === 'wheel') {
      if (typeof modifiedOptions === 'boolean') {
        return originalAddEventListener.call(this, type, listener, {
          capture: modifiedOptions,
          passive: true,
        })
      } else {
        modifiedOptions.passive = true
        return originalAddEventListener.call(this, type, listener, modifiedOptions)
      }
    }
    return originalAddEventListener.call(this, type, listener, options)
  }
}

const chartRef = ref(null)

// vue中使用echarts，chart如果为响应式对象会导致tooltip无法显示
let chart = null

// 在组件挂载前修补事件监听器
onMounted(() => {
  patchEventListener()
})

const init = () => {
  chart = echarts.init(chartRef.value, 'purple-passion')

  // 监听窗口变化，调整chart布局
  window.addEventListener('resize', chart.resize, { passive: true })
}

const setOption = (option) => {
  chart.setOption(option)
}

onUnmounted(() => {
  // 移除监听窗口变化
  window.removeEventListener('resize', chart.resize)

  // 销毁chart
  if (chart) {
    chart.dispose()
  }
})

// 暴露方法供父组件使用
defineExpose({
  init,
  setOption
})
</script>

<style lang="scss" scoped>
.nt-echarts {
  width: 100%;
  height: 100%;

  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>