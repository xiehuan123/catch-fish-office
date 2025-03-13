import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import postCssPxToRem from 'postcss-pxtorem'
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()],
    css: {
      postcss: {
        plugins: [
          postCssPxToRem({
            // 配置在将px转化为rem时 1rem等于多少px(因为我们搭配使用了amfe-flexible插件 此处我们需要设置的值应是UI设计稿全屏基准宽度的十分之一)
            // 当UI设计稿的全屏基准宽度是1920px时 此处设置的值为192
            rootValue: 192,
            // 所有px均转化为rem
            propList: ['*']
            // 若想设置部分样式不转化 可以在配置项中写出
            // eg: 除 border和font-size外 所有px均转化为rem
            // propList: ["*", "!height",],
          })
        ]
      }
    }
  }
})
