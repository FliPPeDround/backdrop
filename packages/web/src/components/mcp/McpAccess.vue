<script setup lang="ts">
// Derived from the visitor's own origin so it is already correct on deploy previews.
const mcpUrl = computed(() => `${window.location.origin}/mcp`)

const config = computed(() => JSON.stringify({
  mcpServers: {
    backdrop: { url: mcpUrl.value },
  },
}, null, 2))

const { copy, copied } = useClipboard({ copiedDuring: 1800 })

async function copyConfig() {
  await copy(config.value)
}
</script>

<template>
  <section mx-auto pb-10 w-fit>
    <GlassSurface
      simple
      width="min(48rem, calc(100vw - 1.5rem))"
      height="auto"
      :border-radius="20"
    >
      <div class="text-left flex flex-col gap-4 w-full items-start">
        <div class="ml-2 mt-2 flex flex-col gap-1.5">
          <h2 class="text-sm text-white/92 tracking-wide font-medium">
            MCP 接入
          </h2>
          <p class="text-xs text-white/55 leading-relaxed">
            在 AI 助手里说一句「柔和一点的蓝色渐变」。
          </p>
        </div>
        <div class="border border-white/10 rounded-xl bg-black/35 shrink-0 w-full overflow-hidden">
          <div class="px-3 py-1.5 border-b border-white/10 flex gap-2 items-center justify-between">
            <span class="text-[11px] text-white/45 font-mono truncate">mcp.json</span>
            <button
              type="button"
              class="text-[11px] text-white/90 px-2.5 py-1 border border-white/10 rounded-full bg-white/10 inline-flex shrink-0 gap-1 transition items-center hover:bg-white/16"
              @click="copyConfig"
            >
              <i :class="copied ? 'i-carbon:checkmark' : 'i-carbon:copy'" />
              {{ copied ? '已复制' : '复制' }}
            </button>
          </div>
          <pre class="text-[12px] text-white/80 leading-relaxed font-mono m-0 px-3 py-2.5 whitespace-pre overflow-x-auto">{{ config }}</pre>
        </div>
      </div>
    </GlassSurface>
  </section>
</template>
