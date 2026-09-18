import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
    pnpm: false,
    ignores: ['packages/mp/**'],
    rules: {
      'pnpm/yaml-no-duplicate-catalog-item': 'off',
    },
  },
)
