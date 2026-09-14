<script setup lang="ts">
import type { PatternCodeLang } from '@backdrop/data'
import { highlight } from 'sugar-high'

const props = defineProps<{
  filename: string
  code: string
  lang: PatternCodeLang
}>()

const { copy, copied } = useClipboard({ copiedDuring: 1800 })

const highlightedCode = computed(() => {
  if (!props.code)
    return ''
  try {
    return highlight(props.code, { lang: props.lang })
  }
  catch {
    return props.code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }
})

async function copyCode() {
  if (!props.code)
    return
  await copy(props.code)
}
</script>

<template>
  <div class="border border-white/10 rounded-2xl bg-black/35 shrink-0 overflow-hidden">
    <div class="px-3 py-1.5 border-b border-white/10 flex gap-2 items-center justify-between">
      <span class="text-[11px] text-white/45 font-mono truncate">{{ filename }}</span>
      <button
        type="button"
        class="text-[11px] text-white/90 px-2.5 py-1 border border-white/10 rounded-full bg-white/10 inline-flex shrink-0 gap-1 transition items-center hover:bg-white/16"
        @click="copyCode"
      >
        <i :class="copied ? 'i-carbon:checkmark' : 'i-carbon:copy'" />
        {{ copied ? '已复制' : '复制' }}
      </button>
    </div>
    <pre class="pattern-code"><code v-html="highlightedCode" /></pre>
  </div>
</template>

<style scoped>
.pattern-code {
  --sh-class: #7eb5ff;
  --sh-identifier: #d4d4d4;
  --sh-sign: #8b949e;
  --sh-string: #88bbb6;
  --sh-keyword: #ffada8;
  --sh-comment: #8b8b8b;
  --sh-jsxliterals: #d2a8ff;
  --sh-entity: #b7adff;
  --sh-property: #79c0ff;
  margin: 0;
  padding: 10px 12px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  line-height: 1.45;
  tab-size: 2;
  color: #d4d4d4;
  /* Line spans are display:block; ignore HTML newlines between them. */
  white-space: normal;
}

.pattern-code::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.pattern-code :deep(code) {
  display: block;
  font: inherit;
  line-height: inherit;
}

.pattern-code :deep(.sh__line) {
  display: block;
  white-space: pre;
  line-height: 1.45;
  min-height: 1.45em;
}
</style>
