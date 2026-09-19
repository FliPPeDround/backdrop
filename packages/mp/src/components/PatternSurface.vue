<script setup lang="ts">
import type { Pattern } from '@backdrop/data'
import { toBindingStyle } from '@backdrop/shared'
import { computed } from 'vue'

const props = defineProps<{
  pattern: Pattern
}>()

const bindingStyle = computed(() => toBindingStyle(props.pattern.style))
</script>

<template>
  <view class="pattern-surface" :style="bindingStyle" />
</template>

<style scoped>
/* 图案数据自带 absolute + inset，这里只兜底缺失该字段的图案 */
.pattern-surface {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  border-radius: inherit;
}
</style>
