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
  <!-- 图案数据自带 absolute + inset，这里只兜底缺失该字段的图案 -->
  <view class="absolute inset-0 overflow-hidden rounded-[inherit]" :style="bindingStyle" />
</template>
