<script lang="ts" setup>
defineOptions({
  name: 'Logo',
})
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512" role="img" aria-label="Backdrop">
    <defs>
      <mask id="bd-logo-mark">
        <rect x="0" y="0" width="512" height="512" fill="#000" />
        <rect x="95" y="95" width="250" height="250" rx="58" fill="#fff" />
        <rect x="155" y="155" width="274" height="274" rx="66" fill="#000" />
        <rect x="167" y="167" width="250" height="250" rx="58" fill="#fff" />
        <rect x="189" y="189" width="206" height="206" rx="36" fill="#000" />
      </mask>
    </defs>
    <rect x="0" y="0" width="512" height="512" fill="currentColor" mask="url(#bd-logo-mark)" />
  </svg>
</template>
