import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  pages: [],
  globalStyle: {
    backgroundColor: '#16141c',
    backgroundColorBottom: '#16141c',
    backgroundColorTop: '#16141c',
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#16141c',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: 'Backdrop 背景图案库',
    navigationStyle: 'default',
    // 图案列表靠页面滚动 + 分页渲染，触发点上移避免要滑到底才加载
    onReachBottomDistance: 160,
  },
  subPackages: [],
})
