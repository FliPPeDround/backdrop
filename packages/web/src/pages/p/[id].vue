<script setup lang="ts">
/**
 * 图案深链页 `/p/<id>/`。
 *
 * 构建时 scripts/prerender.ts 会为每个图案生成一份带独立标题、描述和分享图的
 * 静态 HTML——微信、掘金、Twitter 的抓取器不执行 JS，只能看到那一份。
 *
 * 这里故意不做重定向：`/p/<id>/` 就是这个图案的正式地址，改变它会让深链和
 * canonical 对不上。要打开的图案由 PatternShowcase 直接读路径得到。
 */
import HomeBody from '~/layout/HomeBody.vue'

defineOptions({
  name: 'PatternPage',
})
</script>

<template>
  <HomeBody />
</template>
