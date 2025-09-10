<script setup lang="ts">
</script>

<template>
  <div mb-6 sm:mb-8>
    <h1 text-3xl tracking-tight font-bold mb-1 mt-20 flex lg:text-6xl md:text-5xl sm:text-4xl sm:mb-3>
      <span text-white font-600 mr-2 transition-colors duration-300>
        创建
      </span>
      <SparklesText
        text="Bling Bling"
        :colors="{ first: '#9E7AFF', second: '#FE8BBB' }"
        :sparkles-count="6"
      />
    </h1>
    <h2 text-2xl tracking-tight font-bold lg:text-4xl md:text-4xl sm:text-3xl>
      <span class="bg-gradient-to-r text-#fff leading-tight bg-[200%_auto] transition-all duration-300 from-neutral-100 to-neutral-400 via-slate-400 bg-clip-text">
        的小程序背景图
      </span>
    </h2>
  </div>
  <p class="text-base text-gray-200 leading-relaxed mx-auto mb-6 px-4 max-w-lg transition-colors duration-300 sm:text-lg sm:mb-8 sm:px-0">
    <span block>专业级别的背景图案和渐变效果</span>
    <span block>轻松复制代码，无缝集成到你的小程序中</span>
    <span block> 支持原生、uniapp、taro 等小程序框架</span>
  </p>
</template>
