<script lang="ts" setup>
defineOptions({
  name: 'Logo',
})
</script>

<template>
  <!-- viewBox 收紧到标形旋转后的实际外框（512 空间内 251×271），让标填满 1em -->
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="112 112 288 288" role="img" aria-label="Backdrop">
    <defs>
      <linearGradient id="bd-logo-layer" x1="0.046" y1="-0.026" x2="0.954" y2="1.026">
        <stop offset="0" stop-color="#FFFFFF" />
        <stop offset="1" stop-color="#FFFFFF" stop-opacity=".12" />
      </linearGradient>
    </defs>
    <g transform="translate(256 256) scale(8.2) rotate(-10) translate(-13 -14.5)">
      <rect x="6.5" y="6.5" width="13" height="16" rx="3" fill="url(#bd-logo-layer)" />
      <rect x="0.75" y="0.75" width="24.5" height="27.5" rx="5.25" fill="none" stroke="#FFFFFF" stroke-opacity=".95" stroke-width="1.5" />
    </g>
  </svg>
</template>
