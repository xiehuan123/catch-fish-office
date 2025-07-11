<script setup lang="ts">
import { ref, onMounted, defineProps, watch } from 'vue'
import { setupCanvas } from '../utils/index'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

// 开始时间
const props = defineProps({
  // 已过分钟数
  minutesPassedRatio: {
    type: Number,
    default: 300
  },
  // 还有多久下班
  daysToEndTime: {
    type: String,
    default: '18:00'
  },
  name: {
    type: String,
    default: '9:00'
  },

  height: {
    type: Number,
    default: 300
  },
  rootFontSize: {
    type: Number,
    default: 16
  }
})
const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

const width = ref(props.height)
const height = ref(props.height)
const rootFontSize = ref(props.rootFontSize)
// 定义起始角度
const startAngle = ref(90)
// 结束角度
const endAngle = ref(270)
// 总角度
const totalAngle = ref(180)

onMounted(() => {
  init()
})
const init = () => {
  ctx.value = setupCanvas(canvas.value, width.value, height.value)
}
// 画半框
const drawBackgroundArc = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  line: number,
  color: string | CanvasGradient | CanvasPattern
) => {
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, startAngle, endAngle, false)
  ctx.strokeStyle = color
  ctx.lineWidth = line
  ctx.stroke()

  ctx.closePath()
}
// 绘制背景
const drawBackground = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  color: string | CanvasGradient | CanvasPattern
) => {
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, startAngle, endAngle, false)
  ctx.strokeStyle = color
  ctx.fillStyle = 'rgba(255, 255, 255, .2)'
  ctx.stroke()
  ctx.fill()
  ctx.closePath()
}
// 绘制太阳
const drawSun = (
  ctx: CanvasRenderingContext2D,
  sunX: number,
  sunY: number,
  sunRadius: number,
  color: string
) => {
  ctx.beginPath()
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2, false) // 太阳的圆形
  ctx.fillStyle = color // 太阳颜色
  ctx.fill()
  ctx.closePath()
}
// 绘制文字
const drawText = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  font: string,
  color: string
) => {
  ctx.font = font
  ctx.fillStyle = color
  // ctx.textAlign = 'center';
  // ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y)
}
// 计算文字宽度和高度
function getTextWidthHeight(text: string, fontSize = 16, fontFamily = 'Arial') {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return 0
  ctx.font = `${fontSize}px ${fontFamily}`

  return ctx.measureText(text).width
}
watch(
  () => props.daysToEndTime,
  () => {

      update()
  }
)
watch(
  () => props.height,
  () => {
    width.value = props.height
    height.value = props.height
    rootFontSize.value = props.rootFontSize
    console.log('init 高度发生变化', props.height)
    init()
    update()
  }
)
const update = () => {
  console.log('时间进度', props.minutesPassedRatio)
  // 当前占比 *总角度数 = 当前角度
  const currentAngle = props.minutesPassedRatio * totalAngle.value

  const centerX = width.value / 2 + 40
  const centerY = height.value / 2
  const radius = width.value / 2

  if (!ctx.value) return
  ctx.value.clearRect(0, 0, width.value, height.value)
  drawBackgroundArc(
    ctx.value,
    centerX,
    centerY,
    radius,
    ((endAngle.value - currentAngle) * Math.PI) / 180,
    (endAngle.value * Math.PI) / 180,
    2,
    'rgba(255, 255, 255, 1)'
  )

  drawBackgroundArc(
    ctx.value,
    centerX,
    centerY,
    radius,
    (startAngle.value * Math.PI) / 180,
    ((endAngle.value - currentAngle) * Math.PI) / 180,
    1,
    'rgba(255, 255, 255, .2)'
  )

  // 绘制背景
  drawBackground(
    ctx.value,
    centerX,
    centerY,
    radius,
    (0 * Math.PI) / 180,
    (360 * Math.PI) / 180,
    'rgba(255, 255, 255, .2)'
  )
  // 将角度转换为弧度
  const radians = (currentAngle * Math.PI) / 180
  // 太阳的 X 和 Y 坐标
  const sunY = centerY - radius * Math.cos(radians) // Y坐标
  const sunX = centerX - radius * Math.sin(radians) // X坐标
  drawSun(ctx.value, sunX, sunY, 28 / 2, 'rgba(255, 255, 255, .3)')
  drawSun(ctx.value, sunX, sunY, 20 / 2, 'rgba(255, 255, 255, .6)')
  drawSun(ctx.value, sunX, sunY, 11 / 2, 'rgba(255, 255, 255, 1)')
  console.log(`${0.12 * rootFontSize.value}px SF-Pro`)
  const x1Width = getTextWidthHeight(props.name, 0.12 * rootFontSize.value, 'SF-Pro')
  const x2Width = getTextWidthHeight(props.daysToEndTime, 0.24 * rootFontSize.value, 'SF-Pro')
  drawText(
    ctx.value,
    height.value * 0.25 - x1Width / 2 + 0.14 * height.value,
    height.value * 0.5 - 0.06 * height.value,
    props.name,
    `${0.13 * rootFontSize.value}px SF-Pro`,
    'rgba(255, 255, 255, .7)'
  )
  drawText(
    ctx.value,
    height.value * 0.25 - x2Width / 2,
    height.value * 0.5 + 0.019 * height.value,
    props.daysToEndTime,
    `${0.4 * rootFontSize.value}px SF-Pro`,
    'rgba(255, 255, 255, 1)'
  )
}
</script>

<template>
  <div class="arc-progress">
    <canvas id="canvas" ref="canvas"></canvas>
  </div>
</template>

<style lang="scss" scoped></style>
