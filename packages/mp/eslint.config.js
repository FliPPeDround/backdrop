import uniHelper from '@uni-helper/eslint-config'

export default uniHelper({}, [
  {
    // @dcloudio/* 要求依赖版本与其编译器严格对齐（vue 3.4.21、vite 5.2.8 等），
    // 这些精确 pin 不能收进根 catalog，否则会被解析成 web 端那份新版本。
    files: ['**/package.json'],
    rules: {
      'pnpm/json-enforce-catalog': 'off',
    },
  },
])
