<script setup lang="ts">
import type { CodeStyleId, FrameworkId, Pattern } from '@backdrop/data'
import type { CSSProperties } from 'vue'
import type { CardOrigin } from './origin'
import { generatePatternCode, PATTERN_CODE_STYLES, PATTERN_FRAMEWORKS } from '@backdrop/data'
import { AnimatePresence, Motion } from 'motion-v'
import { readOrigin } from './origin'

const props = defineProps<{
  origin?: CardOrigin | null
  originEl?: HTMLElement | null
}>()

const selected = defineModel<Pattern | null>('selected', { default: null })

const framework = ref<FrameworkId>('weixin')
const codeStyle = ref<CodeStyleId>('separated')
const preferredMotion = usePreferredReducedMotion()
const reduceMotion = computed(() => preferredMotion.value === 'reduce')

const presented = ref(false)
const closing = ref(false)
const settled = ref(false)
const heroMorph = ref<'card' | 'phone'>('card')
const originSnapshot = ref<CardOrigin | null>(null)
const targetPhone = ref<CardOrigin | null>(null)
const activePattern = ref<Pattern | null>(null)
const phoneSlotRef = ref<HTMLElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const heroBox = ref<CardOrigin | null>(null)

let heroAnimation: Animation | null = null

const HERO_MS = 480
const HERO_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

const files = computed(() => {
  if (!activePattern.value)
    return []
  return generatePatternCode(activePattern.value, framework.value, codeStyle.value)
})

const easeOut = [0.22, 1, 0.36, 1] as const

// SpecularButton 没有选中态概念，用颜色亮度 + 常亮扫光区分选中项
function chipFxProps(active: boolean) {
  return active
    ? {
        autoAnimate: true,
        textColor: '#ffffff',
        baseColor: '#a1a1aa',
        intensity: 1,
      }
    : {
        autoAnimate: false,
        textColor: 'rgba(255, 255, 255, 0.65)',
        baseColor: '#525252',
        intensity: 0.55,
      }
}

const fadeTransition = computed(() => {
  if (reduceMotion.value)
    return { duration: 0.12 }
  return { duration: 0.28, ease: easeOut }
})

const contentTransition = computed(() => {
  if (reduceMotion.value)
    return { duration: 0.12 }
  return { duration: 0.32, delay: 0.16, ease: easeOut }
})

const rootExitTransition = computed(() => ({
  duration: reduceMotion.value ? 0.12 : 0.5,
}))

const heroVisible = computed(() => !(settled.value && !closing.value))

const showInFlowPhone = computed(() => {
  return settled.value || !originSnapshot.value || Boolean(reduceMotion.value)
})

const showHero = computed(() => {
  return Boolean(activePattern.value && originSnapshot.value && (presented.value || closing.value))
})

const heroStyle = computed<CSSProperties>(() => {
  const box = heroBox.value
  if (!box)
    return {}
  return {
    left: `${box.left}px`,
    top: `${box.top}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    borderRadius: `${box.borderRadius}px`,
  }
})

function boxKeyframes(from: CardOrigin, to: CardOrigin) {
  return [
    {
      left: `${from.left}px`,
      top: `${from.top}px`,
      width: `${from.width}px`,
      height: `${from.height}px`,
      borderRadius: `${from.borderRadius}px`,
    },
    {
      left: `${to.left}px`,
      top: `${to.top}px`,
      width: `${to.width}px`,
      height: `${to.height}px`,
      borderRadius: `${to.borderRadius}px`,
    },
  ]
}

function cancelHeroAnimation() {
  if (!heroAnimation)
    return
  heroAnimation.cancel()
  heroAnimation = null
}

async function animateHero(from: CardOrigin, to: CardOrigin) {
  cancelHeroAnimation()
  heroBox.value = from
  await nextTick()
  const el = heroRef.value
  if (!el || reduceMotion.value) {
    heroBox.value = to
    return
  }
  const animation = el.animate(boxKeyframes(from, to), {
    duration: HERO_MS,
    easing: HERO_EASING,
    fill: 'forwards',
  })
  heroAnimation = animation
  try {
    await animation.finished
  }
  catch {
    return
  }
  if (heroAnimation !== animation)
    return
  heroBox.value = to
  heroAnimation = null
}

async function doubleRaf() {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

function measurePhone(): CardOrigin | null {
  const el = phoneSlotRef.value?.querySelector('.phone-shell')
  if (!el)
    return null
  const rect = el.getBoundingClientRect()
  if (rect.width < 2 || rect.height < 2)
    return null
  return readOrigin(el)
}

async function startEnter() {
  settled.value = false
  closing.value = false
  heroMorph.value = 'card'
  targetPhone.value = null
  heroBox.value = originSnapshot.value

  if (!originSnapshot.value || reduceMotion.value) {
    await nextTick()
    heroMorph.value = 'phone'
    settled.value = true
    return
  }

  await nextTick()
  await doubleRaf()
  const measured = measurePhone()
  if (!measured) {
    heroMorph.value = 'phone'
    settled.value = true
    return
  }
  targetPhone.value = measured
  heroMorph.value = 'phone'
  await animateHero(originSnapshot.value, measured)
  if (presented.value && !closing.value)
    settled.value = true
}

watch(selected, (pattern) => {
  if (!pattern)
    return
  activePattern.value = pattern
  originSnapshot.value = props.origin ? { ...props.origin } : null
  framework.value = 'weixin'
  presented.value = true
  startEnter()
})

watch(presented, (isOpen) => {
  if (typeof document === 'undefined')
    return
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onUnmounted(() => {
  cancelHeroAnimation()
  document.body.style.overflow = ''
})

function resetModal() {
  cancelHeroAnimation()
  selected.value = null
  activePattern.value = null
  closing.value = false
  settled.value = false
  targetPhone.value = null
  originSnapshot.value = null
  heroBox.value = null
  heroMorph.value = 'card'
}

async function close() {
  if (!presented.value || closing.value)
    return
  closing.value = true
  settled.value = false

  if (props.originEl)
    originSnapshot.value = readOrigin(props.originEl)
  else if (props.origin)
    originSnapshot.value = { ...props.origin }

  const from = targetPhone.value ?? heroBox.value
  const to = originSnapshot.value

  presented.value = false
  heroMorph.value = 'card'

  if (!reduceMotion.value && from && to)
    await animateHero(from, to)

  resetModal()
}

function onExitComplete() {
  if (closing.value)
    return
  resetModal()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape')
    close()
}

useEventListener(document, 'keydown', onKeydown)

useEventListener(window, 'resize', () => {
  if (!presented.value || closing.value)
    return
  const measured = measurePhone()
  if (!measured)
    return
  targetPhone.value = measured
  if (settled.value)
    heroBox.value = measured
})
</script>

<template>
  <Teleport to="body">
    <AnimatePresence @exit-complete="onExitComplete">
      <Motion
        v-if="presented && activePattern"
        :key="`chrome-${activePattern.id}`"
        class="inset-0 fixed z-[100]"
        :initial="{ opacity: 1 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 1, transition: rootExitTransition }"
      >
        <Motion
          class="bg-black/65 inset-0 absolute backdrop-blur-sm"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="fadeTransition"
          @click="close"
        />

        <div
          class="p-3 flex items-center inset-0 justify-center absolute sm:p-6"
          @click.self="close"
        >
          <Motion
            class="border border-white/10 rounded-3xl bg-[#16141c]/92 max-h-[92vh] max-w-5xl w-full shadow-2xl relative z-1 overflow-hidden backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="`pattern-dialog-${activePattern.id}`"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="fadeTransition"
          >
            <button
              type="button"
              class="text-white/80 border border-white/10 rounded-full bg-white/5 flex h-9 w-9 transition items-center right-3 top-3 justify-center absolute z-10 hover:text-white hover:bg-white/10"
              aria-label="关闭"
              @click="close"
            >
              <i i-carbon:close />
            </button>

            <div class="overscroll-contain grid grid-cols-1 max-h-[92vh] overflow-auto lg:grid-cols-[minmax(280px,0.9fr)_1.2fr]">
              <div
                ref="phoneSlotRef"
                class="p-4 bg-black/20 flex items-center justify-center sm:p-8"
              >
                <PhoneFrame
                  :pattern="activePattern"
                  :class="showInFlowPhone ? 'opacity-100' : 'opacity-0'"
                />
              </div>

              <Motion
                class="p-5 flex flex-col gap-4 min-h-0 min-w-0 sm:p-6"
                :initial="{ opacity: 0, y: 14 }"
                :animate="{ opacity: 1, y: 0 }"
                :exit="{ opacity: 0, y: 8 }"
                :transition="contentTransition"
              >
                <div class="pr-10">
                  <h3
                    :id="`pattern-dialog-${activePattern.id}`"
                    class="text-xl text-white font-semibold"
                  >
                    {{ activePattern.name }}
                  </h3>
                  <p v-if="activePattern.description" class="text-sm text-white/60 mt-1">
                    {{ activePattern.description }}
                  </p>
                </div>

                <div class="flex flex-col gap-3">
                  <div>
                    <p class="text-xs text-white/40 mb-2">
                      框架
                    </p>
                    <div class="flex flex-wrap gap-2">
                      <SpecularButton
                        v-for="item in PATTERN_FRAMEWORKS"
                        :key="item.id"
                        size="sm"
                        :radius="999"
                        :proximity="90"
                        v-bind="chipFxProps(framework === item.id)"
                        @click="framework = item.id"
                      >
                        {{ item.label }}
                      </SpecularButton>
                    </div>
                  </div>

                  <div>
                    <p class="text-xs text-white/40 mb-2">
                      代码风格
                    </p>
                    <div class="flex flex-wrap gap-2">
                      <SpecularButton
                        v-for="item in PATTERN_CODE_STYLES"
                        :key="item.id"
                        size="sm"
                        :radius="999"
                        :proximity="90"
                        v-bind="chipFxProps(codeStyle === item.id)"
                        @click="codeStyle = item.id"
                      >
                        {{ item.label }}
                      </SpecularButton>
                    </div>
                  </div>
                </div>

                <div class="overscroll-contain flex flex-1 flex-col gap-3 max-h-[32vh] min-h-0 overflow-auto lg:max-h-[56vh] sm:max-h-[56vh]">
                  <PatternCodeBlock
                    v-for="file in files"
                    :key="file.filename"
                    :filename="file.filename"
                    :code="file.code"
                    :lang="file.lang"
                  />
                </div>
              </Motion>
            </div>
          </Motion>
        </div>
      </Motion>
    </AnimatePresence>

    <div
      v-if="showHero && activePattern"
      ref="heroRef"
      class="pointer-events-none fixed z-[110] overflow-hidden"
      data-expand-hero
      :class="heroVisible ? 'opacity-100' : 'opacity-0'"
      :style="heroStyle"
      aria-hidden="true"
    >
      <PhoneFrame
        fluid
        :pattern="activePattern"
        :morph="heroMorph"
      />
    </div>
  </Teleport>
</template>
