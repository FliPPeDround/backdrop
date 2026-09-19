<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'

onLaunch(() => {})
</script>

<style>
/*
 * 全局设计令牌：两条曲线 + 一套排印。
 * --spring 是 iOS 面板曲线（起步快、收尾稳，可反复打断重定向）；
 * --settle 近似临界阻尼弹簧（damping 1.0，不过冲）。
 */
page {
  --spring: cubic-bezier(0.32, 0.72, 0, 1);
  --settle: cubic-bezier(0.22, 1, 0.36, 1);
  --press: cubic-bezier(0.2, 0, 0, 1);
  --ink: #f5f4f7;
  --ink-2: rgba(255, 255, 255, 0.72);
  --ink-3: rgba(255, 255, 255, 0.48);

  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Helvetica Neue", sans-serif;
  background: #16141c;
}

/* 所有可点元素的按下反馈：touch-down 立即响应，不等抬起 */
.press {
  transition: transform 140ms var(--press), opacity 140ms var(--press);
}

.press--on {
  transform: scale(0.94);
  opacity: 0.72;
}

@media (prefers-reduced-motion: reduce) {
  .press--on {
    transform: none;
    opacity: 1;
  }
}
</style>
